@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if errorlevel 1 (
  echo Python 3 is required for local validation. GitHub Actions will also validate on push.
  pause
  exit /b 1
)

py -3 validate_scores.py scores.csv students.csv
if errorlevel 1 (
  echo.
  echo Please correct the errors before pushing your changes.
) else (
  echo.
  echo Your roster and score CSV files passed validation.
)
pause
