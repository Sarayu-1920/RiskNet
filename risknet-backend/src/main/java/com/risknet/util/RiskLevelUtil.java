package com.risknet.util;

public final class RiskLevelUtil {

    private RiskLevelUtil() {
    }

    public static String getRiskLevel(double riskScore) {

        if (riskScore < 40) {
            return Constants.LOW_RISK;
        } else if (riskScore < 70) {
            return Constants.MEDIUM_RISK;
        } else {
            return Constants.HIGH_RISK;
        }
    }
}