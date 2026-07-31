# RiskNet — ML & Data Engineering

## Overview

This module is responsible for preprocessing the Bank Account Fraud (BAF) dataset, augmenting applicant relationships, and preparing graph data for Neo4j. It generates graph-ready CSV files that are later imported into Neo4j for fraud network analysis.

---

## Notebooks

| Notebook                       | Purpose                                                                                                                     |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `Data_augmentation.ipynb`      | Cleans the BAF dataset and augments it with `ApplicantID`, `AlertID`, `DeviceID`, `IPAddress`, and `RegistrationTimestamp`. |
| `Graph_data_preparation.ipynb` | Generates Neo4j node and relationship CSV files from the augmented dataset.                                                 |

---

## Dataset

* **Bank Account Fraud (BAF) NeurIPS Benchmark**
* **Records:** 1,000,000

---

## Output

All generated datasets are stored in the Databricks Unity Catalog Volume:

```text
/Volumes/risknet_catalog/risknet/risknet_volume/
```

### Graph Export

```text
graph_export/
├── applicant_nodes/
├── alert_nodes/
├── device_nodes/
├── ip_nodes/
├── applicant_device_relationships/
├── applicant_ip_relationships/
└── alert_applicant_relationships/
```

Each folder contains Neo4j-compatible CSV files exported from Databricks.

---

## Graph Model

```text
(Applicant)-[:USES_DEVICE]->(Device)
(Applicant)-[:USES_IP]->(IP)
(Alert)-[:GENERATED_FOR]->(Applicant)
```

---

## Tech Stack

* Databricks
* Apache Spark (PySpark)
* Delta Lake
* Unity Catalog Volumes
* Neo4j

---

## Notes

* Databricks access is required to execute the notebooks and generate the exported graph CSV files.
* Backend and frontend contributors do **not** require Databricks access. They can use the project schema, API contracts, and exported datasets for integration.
