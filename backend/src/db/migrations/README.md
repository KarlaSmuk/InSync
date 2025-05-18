# Migrations

This document provides instructions used for running migrations for the backend project using **Alembic**.

### Generate a Migration Script

```sh
alembic revision --autogenerate -m "description of changes"
```

### Apply Migrations

```sh
alembic upgrade head
```

### Downgrade Last Migration

```sh
alembic downgrade -1
```
