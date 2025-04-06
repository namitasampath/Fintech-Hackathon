#!/bin/bash

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create Django project
django-admin startproject loan_network .

# Create Django apps
python manage.py startapp blockchain
python manage.py startapp loans
python manage.py startapp users
python manage.py startapp trust_score

# Make migrations
python manage.py makemigrations
python manage.py migrate

echo "Project setup completed successfully!" 