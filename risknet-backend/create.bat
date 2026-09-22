@echo off

REM ===========================
REM CREATE FOLDERS
REM ===========================

mkdir docs
mkdir sql

mkdir src\main\java\com\risknet\config
mkdir src\main\java\com\risknet\controller
mkdir src\main\java\com\risknet\service
mkdir src\main\java\com\risknet\repository
mkdir src\main\java\com\risknet\entity
mkdir src\main\java\com\risknet\dto
mkdir src\main\java\com\risknet\mapper
mkdir src\main\java\com\risknet\exception
mkdir src\main\java\com\risknet\util

mkdir src\main\resources\static

mkdir src\test\java\com\risknet\controller
mkdir src\test\java\com\risknet\service
mkdir src\test\java\com\risknet\repository

REM ===========================
REM CREATE ROOT FILES
REM ===========================

type nul > pom.xml
type nul > mvnw
type nul > mvnw.cmd
type nul > README.md

REM ===========================
REM DOCS
REM ===========================

type nul > docs\api_contract.md
type nul > sql\schema.sql

REM ===========================
REM JAVA ROOT
REM ===========================

type nul > src\main\java\com\risknet\RiskNetApplication.java

REM ===========================
REM CONFIG
REM ===========================

type nul > src\main\java\com\risknet\config\Neo4jConfig.java
type nul > src\main\java\com\risknet\config\SecurityConfig.java
type nul > src\main\java\com\risknet\config\SwaggerConfig.java

REM ===========================
REM CONTROLLERS
REM ===========================

type nul > src\main\java\com\risknet\controller\AlertController.java
type nul > src\main\java\com\risknet\controller\ApplicantController.java
type nul > src\main\java\com\risknet\controller\GraphController.java
type nul > src\main\java\com\risknet\controller\CaseController.java
type nul > src\main\java\com\risknet\controller\AuditController.java

REM ===========================
REM SERVICES
REM ===========================

type nul > src\main\java\com\risknet\service\AlertService.java
type nul > src\main\java\com\risknet\service\ApplicantService.java
type nul > src\main\java\com\risknet\service\GraphService.java
type nul > src\main\java\com\risknet\service\CaseService.java
type nul > src\main\java\com\risknet\service\AuditService.java

REM ===========================
REM REPOSITORIES
REM ===========================

type nul > src\main\java\com\risknet\repository\ApplicantRepository.java
type nul > src\main\java\com\risknet\repository\AlertRepository.java
type nul > src\main\java\com\risknet\repository\DeviceRepository.java
type nul > src\main\java\com\risknet\repository\IPAddressRepository.java
type nul > src\main\java\com\risknet\repository\InvestigationCaseRepository.java
type nul > src\main\java\com\risknet\repository\AnalystDecisionRepository.java
type nul > src\main\java\com\risknet\repository\AuditLogRepository.java
type nul > src\main\java\com\risknet\repository\Neo4jGraphRepository.java

REM ===========================
REM ENTITIES
REM ===========================

type nul > src\main\java\com\risknet\entity\Applicant.java
type nul > src\main\java\com\risknet\entity\Alert.java
type nul > src\main\java\com\risknet\entity\Device.java
type nul > src\main\java\com\risknet\entity\IPAddress.java
type nul > src\main\java\com\risknet\entity\InvestigationCase.java
type nul > src\main\java\com\risknet\entity\AnalystDecision.java
type nul > src\main\java\com\risknet\entity\AuditLog.java
type nul > src\main\java\com\risknet\entity\ApplicantDevice.java
type nul > src\main\java\com\risknet\entity\ApplicantIP.java

REM ===========================
REM DTO
REM ===========================

type nul > src\main\java\com\risknet\dto\AlertDTO.java
type nul > src\main\java\com\risknet\dto\ApplicantDTO.java
type nul > src\main\java\com\risknet\dto\GraphDTO.java
type nul > src\main\java\com\risknet\dto\CaseDTO.java
type nul > src\main\java\com\risknet\dto\DecisionDTO.java
type nul > src\main\java\com\risknet\dto\AuditDTO.java

REM ===========================
REM MAPPERS
REM ===========================

type nul > src\main\java\com\risknet\mapper\AlertMapper.java
type nul > src\main\java\com\risknet\mapper\ApplicantMapper.java
type nul > src\main\java\com\risknet\mapper\CaseMapper.java

REM ===========================
REM EXCEPTIONS
REM ===========================

type nul > src\main\java\com\risknet\exception\ResourceNotFoundException.java
type nul > src\main\java\com\risknet\exception\GlobalExceptionHandler.java
type nul > src\main\java\com\risknet\exception\ValidationException.java

REM ===========================
REM UTIL
REM ===========================

type nul > src\main\java\com\risknet\util\Constants.java
type nul > src\main\java\com\risknet\util\RiskLevelUtil.java

REM ===========================
REM RESOURCES
REM ===========================

type nul > src\main\resources\application.properties
type nul > src\main\resources\application-dev.properties
type nul > src\main\resources\application-prod.properties

echo.
echo ==========================================
echo PROJECT STRUCTURE CREATED SUCCESSFULLY!
echo ==========================================
pause