# Databricks notebook source
# MAGIC %md
# MAGIC # RiskNet — Isolation Forest Risk Scoring
# MAGIC
# MAGIC ## Objective
# MAGIC Generate investigation priority scores for all applicants using graph-based features extracted from Neo4j.
# MAGIC
# MAGIC ## Input
# MAGIC - `graph_features.csv` — degree, community_id, connected_applicants (from Neo4j GDS)
# MAGIC - `risknet_augmented_dataset` — fraud labels for evaluation only
# MAGIC
# MAGIC ## Output
# MAGIC - `risk_scores.csv` — ApplicantID, IsolationForestScore, RiskScore, RiskLevel

# COMMAND ----------

# Configuration
VOLUME_PATH = "/Volumes/risknet_catalog/risknet/risknet_volume"
GRAPH_FEATURES_PATH = f"{VOLUME_PATH}/processed/graph_features.csv"
OUTPUT_PATH = f"{VOLUME_PATH}/processed/risk_scores.csv"

CONTAMINATION = 0.05  # Expected anomaly rate (~5%)
RANDOM_STATE = 42

print("Isolation Forest Pipeline Initialized")
print(f"Input : {GRAPH_FEATURES_PATH}")
print(f"Output: {OUTPUT_PATH}")

# COMMAND ----------

from pyspark.sql import functions as F

# Load relationship files
applicant_device_df = spark.read.option("header", True).csv(
    f"{VOLUME_PATH}/graph_export/applicant_device_relationships"
)

applicant_ip_df = spark.read.option("header", True).csv(
    f"{VOLUME_PATH}/graph_export/applicant_ip_relationships"
)

print(f"Device relationships : {applicant_device_df.count():,}")
print(f"IP relationships     : {applicant_ip_df.count():,}")


# COMMAND ----------

aug_df = spark.read.format("delta").table(
    "risknet_augmented_dataset"
)

print(f"Augmented dataset : {aug_df.count():,}")

# COMMAND ----------

# Count device connections per applicant
device_degree = (
    applicant_device_df
    .groupBy("ApplicantID")
    .agg(F.count("DeviceID").alias("device_degree"))
)

# Count IP connections per applicant
ip_degree = (
    applicant_ip_df
    .groupBy("ApplicantID")
    .agg(F.count("IPAddress").alias("ip_degree"))
)

# Combine into total degree
degree_df = (
    device_degree
    .join(ip_degree, on="ApplicantID", how="outer")
    .fillna(0)
    .withColumn("degree", F.col("device_degree") + F.col("ip_degree"))
    .select("ApplicantID", "degree")
)

print(f"Degree records : {degree_df.count():,}")
degree_df.show(5)

# COMMAND ----------

# Find applicants sharing same device
shared_device = (
    applicant_device_df.alias("a")
    .join(applicant_device_df.alias("b"), on="DeviceID")
    .filter(F.col("a.ApplicantID") != F.col("b.ApplicantID"))
    .select(F.col("a.ApplicantID").alias("ApplicantID"),
            F.col("b.ApplicantID").alias("ConnectedApplicant"))
)

# Find applicants sharing same IP
shared_ip = (
    applicant_ip_df.alias("a")
    .join(applicant_ip_df.alias("b"), on="IPAddress")
    .filter(F.col("a.ApplicantID") != F.col("b.ApplicantID"))
    .select(F.col("a.ApplicantID").alias("ApplicantID"),
            F.col("b.ApplicantID").alias("ConnectedApplicant"))
)

# Union and count distinct connected applicants
connected_df = (
    shared_device.union(shared_ip)
    .distinct()
    .groupBy("ApplicantID")
    .agg(F.countDistinct("ConnectedApplicant").alias("connected_applicants"))
)

print(f"Applicants with connections : {connected_df.count():,}")
connected_df.show(5)

# COMMAND ----------

# Start with all applicants
features_df = (
    aug_df.select("ApplicantID")
    .join(degree_df, on="ApplicantID", how="left")
    .join(connected_df, on="ApplicantID", how="left")
    .fillna(0)
)

print(f"Total feature records : {features_df.count():,}")
features_df.show(5)

# COMMAND ----------

from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np

# Convert to Pandas for sklearn
features_pd = features_df.toPandas()

# Define feature columns
feature_cols = ["degree", "connected_applicants"]

X = features_pd[feature_cols]

# Train Isolation Forest
model = IsolationForest(
    n_estimators=100,
    contamination=CONTAMINATION,
    random_state=RANDOM_STATE
)

model.fit(X)

# Generate anomaly scores
features_pd["isolation_forest_score"] = model.decision_function(X)

print("Isolation Forest training complete.")
print(f"Score range: {features_pd['isolation_forest_score'].min():.4f} to {features_pd['isolation_forest_score'].max():.4f}")

# COMMAND ----------

# Normalize: lower anomaly score = higher risk
# Invert and scale to 0-100
min_score = features_pd["isolation_forest_score"].min()
max_score = features_pd["isolation_forest_score"].max()

features_pd["risk_score"] = (
    (max_score - features_pd["isolation_forest_score"]) /
    (max_score - min_score) * 100
).round(2)

# Assign risk level
def assign_risk_level(score):
    if score >= 70:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    else:
        return "LOW"

features_pd["risk_level"] = features_pd["risk_score"].apply(assign_risk_level)

# Summary
print(features_pd["risk_level"].value_counts())
print(f"\nRisk score range: {features_pd['risk_score'].min()} to {features_pd['risk_score'].max()}")

# COMMAND ----------

# Select final columns
risk_scores_pd = features_pd[[
    "ApplicantID",
    "isolation_forest_score",
    "risk_score",
    "risk_level"
]]

# Save to volume
risk_scores_pd.to_csv(OUTPUT_PATH, index=False)

print(f"Risk scores exported : {len(risk_scores_pd):,} records")
print(f"Output path          : {OUTPUT_PATH}")
risk_scores_pd.head(5)

# COMMAND ----------

print("========== Risk Score Validation ==========")
print(f"Total Records     : {len(risk_scores_pd):,}")
print(f"Null ApplicantIDs : {risk_scores_pd['ApplicantID'].isnull().sum()}")
print(f"Null Risk Scores  : {risk_scores_pd['risk_score'].isnull().sum()}")
print(f"Null Risk Levels  : {risk_scores_pd['risk_level'].isnull().sum()}")
print(f"\nRisk Distribution:")
print(risk_scores_pd['risk_level'].value_counts())
print(f"\nScore Range: {risk_scores_pd['risk_score'].min()} - {risk_scores_pd['risk_score'].max()}")


# COMMAND ----------

