#!/bin/bash

# Exit on any error
set -e

echo "Building and starting Docker containers..."
docker-compose up -d --build

echo "Waiting for MySQL to be ready..."
sleep 15 # give mysql time to initialize

echo "Running migrations..."
docker-compose exec web python manage.py makemigrations users projects tasks activity
docker-compose exec web python manage.py migrate

echo "Creating superuser (admin)..."
docker-compose exec -e DJANGO_SUPERUSER_PASSWORD=admin web python manage.py createsuperuser --noinput --username admin --email admin@opusprime.com 2>/dev/null || echo "Admin user already exists."

echo "Setup complete! The backend is running on http://localhost:8000"
echo "You can log in at http://localhost:8000/admin/ with username: admin and password: admin"
