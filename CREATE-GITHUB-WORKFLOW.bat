@echo off
setlocal
cd /d "%~dp0"

echo =====================================================
echo  Student Score Portal - GitHub workflow setup
echo =====================================================
echo.

if not exist "deploy-workflow-template.yml" (
  echo ERROR: deploy-workflow-template.yml is missing.
  pause
  exit /b 1
)

if not exist ".github\workflows" mkdir ".github\workflows"
if errorlevel 1 (
  echo ERROR: Could not create the GitHub workflow directory.
  pause
  exit /b 1
)

copy /Y "deploy-workflow-template.yml" ".github\workflows\deploy.yml" >nul
if errorlevel 1 (
  echo ERROR: Could not create .github\workflows\deploy.yml.
  pause
  exit /b 1
)

echo Workflow created successfully:
echo .github\workflows\deploy.yml
echo.
echo This is the one required GitHub folder. The ZIP itself keeps all project files together.
echo Commit and push this new workflow file with GitHub Desktop.
pause
