from django.urls import path

from .views import async_retrain_model, make_prediction, retrain_model

urlpatterns = [
    path("make-prediction/", make_prediction),
    path("retrain-model/", retrain_model),
    path("async-train-model/", async_retrain_model),
]
