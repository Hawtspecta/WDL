"""
Database configuration for VogueAI
Supports both PostgreSQL and SQLite based on environment
"""
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

def get_database_config():
    """
    Returns database configuration based on USE_POSTGRESQL environment variable
    Default: PostgreSQL
    Fallback: SQLite
    """
    use_postgresql = os.environ.get('USE_POSTGRESQL', 'true').lower() == 'true'
    
    if use_postgresql:
        # PostgreSQL configuration
        return {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': os.environ.get('DB_NAME', 'vogueai_db'),
                'USER': os.environ.get('DB_USER', 'postgres'),
                'PASSWORD': os.environ.get('DB_PASSWORD', 'postgres'),
                'HOST': os.environ.get('DB_HOST', 'localhost'),
                'PORT': os.environ.get('DB_PORT', '5432'),
            }
        }
    else:
        # SQLite configuration (fallback)
        return {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }

# Get the database configuration
DATABASES = get_database_config()
