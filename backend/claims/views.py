import json

from bson import ObjectId, json_util
from django.http import JsonResponse
from rest_framework.decorators import api_view

from .db import get_driver_collection


def create_driver(request):
    try:
        data = json.loads(request.body)
        driver_collection = get_driver_collection()
        result = driver_collection.insert_one(data)
        return JsonResponse(
            {
                "id": str(result.inserted_id),
                "message": "Driver created successfully",
            },
            status=201,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def list_drivers(request):
    try:
        driver_collection = get_driver_collection()
        drivers = list(driver_collection.find().limit(10))
        for driver in drivers:
            driver["_id"] = str(driver["_id"])
        return JsonResponse(
            {"drivers": drivers},
            safe=False,
            json_dumps_params={"default": json_util.default},
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST", "GET"])
def drivers_view(request):

    if request.method == "POST":
        return create_driver(request)
    else:
        return list_drivers(request)


@api_view(["GET", "PUT", "DELETE"])
def driver_view(request, driver_id):
    if request.method == "GET":
        return get_driver(request, driver_id)
    elif request.method == "PUT":
        return update_driver(request, driver_id)
    elif request.method == "DELETE":
        return delete_driver(request, driver_id)
    return JsonResponse(status=400)


def get_driver(request, driver_id):
    try:
        driver_collection = get_driver_collection()
        driver = driver_collection.find_one({"_id": ObjectId(driver_id)})
        if driver:
            driver["_id"] = str(driver["_id"])
            return JsonResponse(
                driver, json_dumps_params={"default": json_util.default}
            )
        return JsonResponse({"error": "Driver not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def update_driver(request, driver_id):
    try:
        driver_collection = get_driver_collection()
        data = json.loads(request.body)
        result = driver_collection.update_one(
            {"_id": ObjectId(driver_id)}, {"$set": data}
        )
        if result.modified_count:
            return JsonResponse({"message": "Driver updated successfully"})
        return JsonResponse({"message": "No changes detected"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def delete_driver(request, driver_id):
    try:
        driver_collection = get_driver_collection()
        result = driver_collection.delete_one({"_id": ObjectId(driver_id)})
        if result.deleted_count:
            return JsonResponse({"message": "Driver deleted successfully"})
        return JsonResponse({"error": "Driver not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST"])
def bulk_create_drivers(request):
    try:
        drivers_data = json.loads(request.body)
        if not isinstance(drivers_data, list):
            raise ValueError("Expected array of driver objects")
        driver_collection = get_driver_collection()
        result = driver_collection.insert_many(drivers_data)
        inserted_ids = [str(id) for id in result.inserted_ids]
        return JsonResponse(
            {"created_count": len(inserted_ids), "inserted_ids": inserted_ids},
            status=201,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
