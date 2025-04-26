from django.urls import path

from .views import make_prediction

urlpatterns = [
    path("make-prediction/", make_prediction),
]
