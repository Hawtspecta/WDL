@echo off
REM VogueAI Platform Setup Script for Windows
REM This script sets up the complete development environment

echo 🚀 Setting up VogueAI Fashion Platform...

REM Check if we're in the right directory
if not exist "requirements.txt" (
    echo ❌ Error: Please run this script from the voguai root directory
    pause
    exit /b 1
)

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "django_project\media" mkdir django_project\media
if not exist "django_project\staticfiles" mkdir django_project\staticfiles
if not exist "logs" mkdir logs

REM Setup Django environment
echo ⚙️ Setting up Django environment...
cd django_project

REM Copy environment file
if not exist ".env" (
    copy .env.example .env
    echo ✅ Created .env file - please update with your database credentials
)

REM Run database migrations
echo 🗄️ Running database migrations...
python manage.py makemigrations
python manage.py migrate

REM Load initial data
echo 📊 Loading initial data...
python manage.py loaddata blog/fixtures/seed_data.json

REM Collect static files
echo 🎨 Collecting static files...
python manage.py collectstatic --noinput

cd ..

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Update django_project\.env with your database credentials
echo 2. Create a superuser: cd django_project ^&^& python manage.py createsuperuser
echo 3. Run the applications using the run commands in the README
echo.
echo 📖 See README.md for detailed instructions
pause
