#!/bin/bash

# Set environment variables for production
export DEBUG=False
export DJANGO_SETTINGS_MODULE=vogueblog.settings

# Install dependencies
pip install -r requirements.txt

# Collect static files
python django_project/manage.py collectstatic --noinput

# Run migrations (optional - uncomment for production)
# python django_project/manage.py migrate
