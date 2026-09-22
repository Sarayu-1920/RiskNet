package com.risknet.util;

public final class RiskScoreUtil {

    private RiskScoreUtil() {
    }

    public static double calculateRiskScore(
            int sharedDeviceCount,
            int sharedIpCount,
            int connectedApplicantCount) {

        double score = 0;

        // Shared device = 30 points
        score += sharedDeviceCount * 30;

        // Shared IP = 25 points
        score += sharedIpCount * 25;

        // Each connected applicant = 10 points
        score += connectedApplicantCount * 10;

        // Maximum score = 100
        return Math.min(score, 100);
    }
}