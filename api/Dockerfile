FROM python:3.12-slim AS base

RUN apt-get update && apt-get install -y \
    curl build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_HOME="/opt/poetry"
ENV PATH="$POETRY_HOME/bin:$PATH"
RUN curl -sSL https://install.python-poetry.org | python3 -

WORKDIR /app
COPY pyproject.toml poetry.lock ./

FROM base AS development
RUN poetry install
COPY . .
ENV DJANGO_SETTINGS_MODULE=config.settings.development
EXPOSE 8000
CMD ["poetry", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production
RUN poetry install --no-root --without dev
COPY . .
WORKDIR /app
ENV DJANGO_SETTINGS_MODULE=config.settings.production
EXPOSE 8000
CMD ["poetry", "run", "gunicorn", "config.wsgi:application", "-c", "gunicorn.conf.py"]
