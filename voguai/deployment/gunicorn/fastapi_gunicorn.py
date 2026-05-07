# Gunicorn configuration for FastAPI VogueAI ML Service
# Optimized for async ML processing with uvicorn workers

import multiprocessing
import os

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Worker processes (optimized for async ML workloads)
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
max_requests = 500  # Lower for ML apps to manage memory
max_requests_jitter = 25
preload_app = True
timeout = 120  # Longer timeout for ML processing
keepalive = 2

# Logging
accesslog = "/var/log/gunicorn/fastapi_access.log"
errorlog = "/var/log/gunicorn/fastapi_error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "vogueai_fastapi"

# Server mechanics
daemon = False
pidfile = "/var/run/gunicorn/fastapi.pid"
user = "www-data"
group = "www-data"
tmp_upload_dir = None

# Environment variables for ML models
raw_env = [
    'PATH=/path/to/voguai/venv/bin',
    'TRANSFORMERS_CACHE=/tmp/transformers_cache',
    'HF_HOME=/tmp/huggingface_cache',
    'PYTHONPATH=/path/to/voguai/fastapi_app',
]

# Performance tuning for ML workloads
max_requests = 500
max_requests_jitter = 25
preload_app = True

# Security
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Graceful shutdown (important for ML models)
graceful_timeout = 60
timeout = 120

# Process naming
proc_name = "vogueai_fastapi"

# Worker process settings
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000

# Preload application for better model loading
preload_app = True

# Worker temporary directory
worker_tmp_dir = "/dev/shm"

# Enable stats for monitoring
statsd_host = None
statsd_prefix = ""

# Hook functions for ML model management
def on_starting(server):
    """Called just before the master process is initialized."""
    server.log.info("VogueAI FastAPI ML server starting...")
    # Create cache directories
    os.makedirs("/tmp/transformers_cache", exist_ok=True)
    os.makedirs("/tmp/huggingface_cache", exist_ok=True)

def on_reload(server):
    """Called to recycle workers during a reload via SIGHUP."""
    server.log.info("VogueAI FastAPI ML server reloading...")

def when_ready(server):
    """Called just after the server is started."""
    server.log.info("VogueAI FastAPI ML server is ready. Listening on %s", server.address)

def worker_int(worker):
    """Called just after a worker exited on SIGINT or SIGQUIT."""
    worker.log.info("VogueAI FastAPI ML worker received INT or QUIT signal")

def pre_fork(server, worker):
    """Called just before a worker is forked."""
    server.log.info("VogueAI FastAPI ML worker spawned (pid: %s)", worker.pid)

def post_fork(server, worker):
    """Called just after a worker has been forked."""
    server.log.info("VogueAI FastAPI ML worker spawned (pid: %s)", worker.pid)

def post_worker_init(worker):
    """Called just after a worker has initialized the application."""
    worker.log.info("VogueAI FastAPI ML worker initialized (pid: %s)", worker.pid)

def worker_abort(worker):
    """Called when a worker received the SIGABRT signal."""
    worker.log.info("VogueAI FastAPI ML worker aborted (pid: %s)", worker.pid)

def child_exit(server, worker):
    """Called just after a worker has been exited."""
    server.log.info("VogueAI FastAPI ML child worker exited (pid: %s)", worker.pid)

# Async worker settings
worker_class = "uvicorn.workers.UvicornWorker"
workers = multiprocessing.cpu_count() * 2 + 1
worker_connections = 1000

# ML-specific settings
max_requests = 500  # Lower to manage memory for ML models
max_requests_jitter = 25
preload_app = True

# Timeout settings for ML processing
timeout = 120
graceful_timeout = 60
keepalive = 2

# Memory management
worker_tmp_dir = "/dev/shm"

# Request limits for ML processing
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Logging configuration
accesslog = "/var/log/gunicorn/fastapi_access.log"
errorlog = "/var/log/gunicorn/fastapi_error.log"
loglevel = "info"

# Process management
proc_name = "vogueai_fastapi"
pidfile = "/var/run/gunicorn/fastapi.pid"
user = "www-data"
group = "www-data"

# Server socket
bind = "127.0.0.1:8000"
backlog = 2048

# Environment for ML models
raw_env = [
    'PATH=/path/to/voguai/venv/bin',
    'TRANSFORMERS_CACHE=/tmp/transformers_cache',
    'HF_HOME=/tmp/huggingface_cache',
    'PYTHONPATH=/path/to/voguai/fastapi_app',
]

# Performance optimization
preload_app = True
max_requests = 500
max_requests_jitter = 25

# Security settings
limit_request_line = 4094
limit_request_fields = 100
limit_request_field_size = 8190

# Graceful shutdown
graceful_timeout = 60
timeout = 120

# Keepalive
keepalive = 2

# Worker configuration
worker_class = "uvicorn.workers.UvicornWorker"
workers = multiprocessing.cpu_count() * 2 + 1
worker_connections = 1000

# Temporary directory
worker_tmp_dir = "/dev/shm"
