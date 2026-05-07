# Gunicorn configuration for Django VogueAI Blog
# Production-ready configuration with performance optimizations

import multiprocessing
import os

# Server socket
bind = "127.0.0.1:9000"
backlog = 2048

# Worker processes
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 50
preload_app = True
timeout = 30
keepalive = 2

# Logging
accesslog = "/var/log/gunicorn/django_access.log"
errorlog = "/var/log/gunicorn/django_error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "vogueai_django"

# Server mechanics
daemon = False
pidfile = "/var/run/gunicorn/django.pid"
user = "www-data"
group = "www-data"
tmp_upload_dir = None

# SSL (if needed)
keyfile = None
certfile = None
ssl_version = None
ca_certs = None
suppress_ragged_eofs = True
worker_tmp_dir = "/dev/shm"

# Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vogueblog.settings')
raw_env = [
    'DJANGO_SETTINGS_MODULE=vogueblog.settings',
    'PATH=/path/to/voguai/venv/bin',
]

# Performance tuning
max_requests = 1000
max_requests_jitter = 50
preload_app = True

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Graceful shutdown
graceful_timeout = 30
timeout = 30

# Process naming
proc_name = "vogueai_django"

# Worker process settings
worker_class = "sync"
worker_connections = 1000

# Preload application for better memory efficiency
preload_app = True

# Worker temporary directory
worker_tmp_dir = "/dev/shm"

# Enable stats for monitoring
statsd_host = None
statsd_prefix = ""

# Hook functions
def on_starting(server):
    """Called just before the master process is initialized."""
    server.log.info("VogueAI Django server starting...")

def on_reload(server):
    """Called to recycle workers during a reload via SIGHUP."""
    server.log.info("VogueAI Django server reloading...")

def when_ready(server):
    """Called just after the server is started."""
    server.log.info("VogueAI Django server is ready. Listening on %s", server.address)

def worker_int(worker):
    """Called just after a worker exited on SIGINT or SIGQUIT."""
    worker.log.info("VogueAI Django worker received INT or QUIT signal")

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    server.log.info("VogueAI Django worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    server.log.info("VogueAI Django worker spawned (pid: %s)", worker.pid)

def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    worker.log.info("VogueAI Django worker initialized (pid: %s)", worker.pid)

def worker_abort(worker):
    """Called when a worker received the SIGABRT signal."""
    worker.log.info("VogueAI Django worker aborted (pid: %s)", worker.pid)

# Child exit codes
child_exit = 0

# Maximum requests for worker
max_requests = 1000

# Maximum requests jitter
max_requests_jitter = 50

# Worker timeout
timeout = 30

# Graceful timeout
graceful_timeout = 30

# Keepalive timeout
keepalive = 2

# Worker connections
worker_connections = 1000

# Worker class
worker_class = "sync"

# Workers count
workers = multiprocessing.cpu_count() * 2 + 1

# Threads per worker
threads = 1

# Worker connections
worker_connections = 1000

# Max requests
max_requests = 1000

# Max requests jitter
max_requests_jitter = 50

# Preload app
preload_app = True

# Worker temp directory
worker_tmp_dir = "/dev/shm"

# Limit request line
limit_request_line = 4094

# Limit request fields
limit_request_fields = 100

# Limit request field size
limit_request_field_size = 8190

# Graceful timeout
graceful_timeout = 30

# Timeout
timeout = 30

# Keepalive
keepalive = 2

# Worker class
worker_class = "sync"

# Workers
workers = multiprocessing.cpu_count() * 2 + 1

# Worker connections
worker_connections = 1000

# Max requests
max_requests = 1000

# Max requests jitter
max_requests_jitter = 50

# Preload app
preload_app = True

# Worker temp directory
worker_tmp_dir = "/dev/shm"
