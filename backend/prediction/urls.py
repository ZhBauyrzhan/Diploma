from django.urls import path

from .views import make_prediction, retrain_model

urlpatterns = [
    path("make-prediction/", make_prediction),
    path("retrain-model/", retrain_model),
]
