#!/bin/bash

set -e

if [ "$DEBUG" = "True" ]; then
  echo "Development environment detected."
else
  echo "Production environment detected. Skipping superuser creation."
fi

echo "Running database migrations..."
poetry run python manage.py makemigrations --no-input
poetry run python manage.py migrate --no-input

echo "Collecting static files..."
poetry run python manage.py collectstatic --no-input

poetry run python manage.py createsuperuser --noinput --username=admin --email=admin@example.com || true

echo "Setup completed successfully!"
