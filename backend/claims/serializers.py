import pickle

import pandas as pd
from claims.models import DriverProfile
from rest_framework import serializers

from .models import AgeChoices


class DriverProfileSerializer(serializers.ModelSerializer):

    normalized_order = [
        "CREDIT_SCORE",
        "VEHICLE_OWNERSHIP",
        "MARRIED",
        "CHILDREN",
        "ANNUAL_MILEAGE",
        "SPEEDING_VIOLATIONS",
        "DUIS",
        "PAST_ACCIDENTS",
        "65+",
        "16-25",
        "26-39",
        "40-64",
        "female",
        "male",
        "majority",
        "minority",
        "0-9y",
        "10-19y",
        "20-29y",
        "30y+",
        "upper class",
        "poverty",
        "working class",
        "middle class",
        "high school",
        "none",
        "university",
        "after 2015",
        "before 2015",
        "sedan",
        "sports car",
    ]

    class AgeChoiceField(serializers.ChoiceField):
        def to_internal_value(self, data):
            if isinstance(data, str):
                for key, label in self.choices.items():
                    if label == data:
                        return key
            return super().to_internal_value(data)

        def to_representation(self, value):
            return self.choices.get(value, value)

    AGE = AgeChoiceField(choices=AgeChoices.choices)

    class Meta:
        model = DriverProfile
        fields = "__all__"

        extra_kwargs = {
            "CREDIT_SCORE": {"min_value": 0.0, "max_value": 1.0},
            "ANNUAL_MILEAGE": {"min_value": 0},
            "SPEEDING_VIOLATIONS": {"min_value": 0},
            "DUIS": {"min_value": 0},
            "PAST_ACCIDENTS": {"min_value": 0},
        }

    def to_np_array(self):
        with open("prediction/training_columns.txt", "r") as f:
            training_columns = f.read().split(",")
        with open("prediction/scaler.pkl", "rb") as f:
            sc = pickle.load(f)
        data = self.validated_data
        X = pd.DataFrame([data])
        X = pd.get_dummies(X).reindex(columns=training_columns, fill_value=0)
        X.to_numpy(dtype="d")
        X = sc.transform(X)
        return X
