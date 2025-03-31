from django.contrib import admin
from django.urls import path, include
from .views import make_prediction

urlpatterns = [
    path('make-prediction/', make_prediction),
]
