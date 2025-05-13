from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    name = models.CharField(max_length=30)
    surname = models.CharField(max_length=40)
    position = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.username} ({self.name} {self.surname})"
