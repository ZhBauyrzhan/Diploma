from django.apps import AppConfig
from utils.db import close_mongo_connections


class ClaimsEditorConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "claims"

    def ready(self):
        pass

    def __del__(self):
        close_mongo_connections()
