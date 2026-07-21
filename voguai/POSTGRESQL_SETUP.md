# PostgreSQL Setup Guide for VogueAI

## Quick Setup Options

### Option 1: Install PostgreSQL (Recommended for Production)

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL
   - Set password: `postgres` during installation

2. **Create Database**
   ```bash
   # After installation, run in command prompt:
   createdb -U postgres vogueai_db
   ```

3. **Start Django with PostgreSQL**
   ```bash
   cd django_project
   python manage.py migrate
   python manage.py runserver 8000
   ```

### Option 2: Use SQLite (Development Mode)

1. **Set Environment Variable**
   ```bash
   # Windows PowerShell:
   $env:USE_POSTGRESQL = "false"
   
   # Or in Command Prompt:
   set USE_POSTGRESQL=false
   ```

2. **Start Django with SQLite**
   ```bash
   cd django_project
   python manage.py migrate
   python manage.py runserver 8000
   ```

## Configuration Details

### Environment Variables

- `USE_POSTGRESQL`: `true` (default) or `false`
- `DB_NAME`: Database name (default: `vogueai_db`)
- `DB_USER`: PostgreSQL username (default: `postgres`)
- `DB_PASSWORD`: PostgreSQL password (default: `postgres`)
- `DB_HOST`: Database host (default: `localhost`)
- `DB_PORT`: Database port (default: `5432`)

### Database Configuration

The system automatically switches between PostgreSQL and SQLite based on the `USE_POSTGRESQL` environment variable.

#### PostgreSQL Configuration (Default)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'vogueai_db',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

#### SQLite Configuration (Fallback)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

## Testing the Setup

1. **Check Database Connection**
   ```bash
   python manage.py dbshell
   ```

2. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

3. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

4. **Test Blog Functionality**
   - Visit: http://localhost:8000/blog
   - Create test posts and verify database operations

## Troubleshooting

### PostgreSQL Connection Issues
- Ensure PostgreSQL service is running
- Verify username and password
- Check if database exists: `psql -U postgres -l`

### Migration Issues
- Delete migrations folder and re-run: `python manage.py makemigrations`
- Reset database: `dropdb -U postgres vogueai_db && createdb -U postgres vogueai_db`

### Permission Issues
- Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE vogueai_db TO postgres;`

## Production Considerations

- Use strong passwords in production
- Set `DEBUG = False` in settings
- Configure proper database connection pooling
- Set up database backups
- Use environment variables for sensitive data
