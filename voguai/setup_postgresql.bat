@echo off
echo Setting up PostgreSQL for VogueAI...

REM Check if PostgreSQL is already installed
psql --version >nul 2>&1
if %errorlevel% == 0 (
    echo PostgreSQL is already installed
    goto :create_db
)

echo PostgreSQL not found. Please install PostgreSQL manually:
echo 1. Download from: https://www.postgresql.org/download/windows/
echo 2. Install with password: postgres
echo 3. After installation, run this script again
echo.
echo For now, falling back to SQLite...
goto :end

:create_db
echo Creating PostgreSQL database...
createdb -U postgres vogueai_db
if %errorlevel% == 0 (
    echo Database vogueai_db created successfully
) else (
    echo Database may already exist or there was an error
)

:end
echo Setup complete
