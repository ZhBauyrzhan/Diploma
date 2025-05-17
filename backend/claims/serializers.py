from claims.models import DriverProfile
from rest_framework import serializers

from .models import AgeChoices


class DriverProfileSerializer(serializers.ModelSerializer):
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
