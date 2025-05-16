import csv
import json
import math
from io import TextIOWrapper

from bson import ObjectId, json_util
from django.http import JsonResponse
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import IsAuthenticated

from .db import get_driver_collection


def _create_driver(request):
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


def _list_drivers(request):
    try:
        page = int(request.GET.get("page", 1))
        per_page = int(request.GET.get("per_page", 10))
        sort_field = request.GET.get("sort", "_id")
        sort_order = 1 if request.GET.get("order", "asc") == "asc" else -1
        if page < 1:
            raise ValueError("Page must be a positive integer")
        if per_page < 1 or per_page > 100:
            raise ValueError("Items per page must be between 1 and 100")
        skip = (page - 1) * per_page
        driver_collection = get_driver_collection()
        total_drivers = driver_collection.count_documents({})
        drivers = list(
            driver_collection.find()
            .sort(sort_field, sort_order)
            .skip(skip)
            .limit(per_page)
        )
        for driver in drivers:
            driver["_id"] = str(driver["_id"])
        total_pages = math.ceil(total_drivers / per_page)
        return JsonResponse(
            {
                "drivers": drivers,
                "pagination": {
                    "current_page": page,
                    "total_pages": total_pages,
                    "total_drivers": total_drivers,
                    "per_page": per_page,
                },
            },
            safe=False,
            json_dumps_params={"default": json_util.default},
        )
    except ValueError:
        return JsonResponse({"error": "Invalid page number"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def drivers_view(request):
    if request.method == "POST":
        return _create_driver(request)
    else:
        return _list_drivers(request)


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def driver_view(request, driver_id):
    if request.method == "GET":
        return _get_driver(request, driver_id)
    elif request.method == "PUT":
        return _update_driver(request, driver_id)
    elif request.method == "DELETE":
        return _delete_driver(request, driver_id)
    return JsonResponse(data="bad request method", status=400)


def _get_driver(request, driver_id):
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


def _update_driver(request, driver_id):
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


def _delete_driver(request, driver_id):
    try:
        driver_collection = get_driver_collection()
        result = driver_collection.delete_one({"_id": ObjectId(driver_id)})
        if result.deleted_count:
            return JsonResponse({"message": "Driver deleted successfully"})
        return JsonResponse({"error": "Driver not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def bulk_create_drivers(request):
    try:
        drivers_data = json.loads(request.body)
        if not isinstance(drivers_data, list):
            raise ValueError("Expected array of driver objects")
        driver_collection = get_driver_collection()
        result = driver_collection.insert_many(drivers_data)
        inserted_ids = [str(i) for i in result.inserted_ids]
        return JsonResponse(
            {"created_count": len(inserted_ids), "inserted_ids": inserted_ids},
            status=201,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([FileUploadParser])
def upload_drivers_csv(request, filename):
    try:
        if "file" not in request.FILES:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        csv_file = TextIOWrapper(request.FILES["file"].file, encoding="utf-8")
        csv_reader = csv.DictReader(csv_file)
        drivers = []
        csv_fieldnames = None
        for row_num, row in enumerate(csv_reader, start=1):
            if csv_fieldnames is None:
                csv_fieldnames = csv_reader.fieldnames
                csv_fieldnames = [
                    field_name.strip().lower().replace(" ", "_")
                    for field_name in csv_fieldnames
                ]

            driver_data = {
                "file_name": filename,
                "csv_row": row_num,
            }

            for idx, field_name in enumerate(csv_fieldnames):
                original_field_name = csv_reader.fieldnames[idx]
                value = (
                    row[original_field_name].strip()
                    if row[original_field_name]
                    else None
                )
                driver_data[field_name] = value

            drivers.append(driver_data)

        if not drivers:
            return JsonResponse({"error": "No valid driver data found"}, status=400)

        driver_collection = get_driver_collection()
        result = driver_collection.insert_many(drivers)

        return JsonResponse(
            {
                "inserted_count§": len(result.inserted_ids),
                "inserted_ids": [str(i) for i in result.inserted_ids],
            },
            status=201,
        )

    except csv.Error as e:
        return JsonResponse({"error": f"CSV parsing error: {str(e)}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
