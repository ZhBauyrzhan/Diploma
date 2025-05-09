"""gunicorn WSGI server configuration."""

from multiprocessing import cpu_count
from os import environ

bind = "0.0.0.0:8000"
loglevel = environ.get("LOGLEVEL", "info")
max_requests = 1000
worker_class = "sync"  # TODO: test
workers = cpu_count() * 2 + 1  # TODO: test
# threads = 2  # TODO: test
