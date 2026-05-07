#!/bin/bash

# VogueAI Platform Setup Script
# This script sets up the complete development environment

echo "🚀 Setting up VogueAI Fashion Platform..."

# Check if we're in the right directory
if [ ! -f "requirements.txt" ]; then
    echo "❌ Error: Please run this script from the voguai root directory"
    exit 1
fi

# Create virtual environment
echo "📦 Creating virtual environment..."
python -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p django_project/media
mkdir -p django_project/staticfiles
mkdir -p logs

# Setup Django environment
echo "⚙️ Setting up Django environment..."
cd django_project

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env file - please update with your database credentials"
fi

# Run database migrations
echo "🗄️ Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Load initial data
echo "📊 Loading initial data..."
python manage.py loaddata blog/fixtures/seed_data.json

# Collect static files
echo "🎨 Collecting static files..."
python manage.py collectstatic --noinput

cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Update django_project/.env with your database credentials"
echo "2. Create a superuser: cd django_project && python manage.py createsuperuser"
echo "3. Run the applications using the run commands in the README"
echo ""
echo "📖 See README.md for detailed instructions"
