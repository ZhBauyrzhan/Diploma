from django.urls import path

from . import views

urlpatterns = [
    path("drivers/", views.drivers_view, name="drivers_view"),
    path(
        "drivers/bulk-create/",
        views.bulk_create_drivers,
        name="bulk_create_drivers",
    ),
    path("drivers/<str:driver_id>/", views.driver_view, name="get_driver"),
]
