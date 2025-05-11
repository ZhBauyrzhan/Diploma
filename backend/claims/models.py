from django.db import models


class AgeChoices(models.IntegerChoices):
    AGE_16_25 = 0, "16-25"
    AGE_26_39 = 1, "26-39"
    AGE_40_64 = 2, "40-64"
    AGE_65_PLUS = 3, "65+"


class DriverProfile(models.Model):
    GENDER_CHOICES = [("female", "Female"), ("male", "Male")]
    RACE_CHOICES = [("majority", "Majority"), ("minority", "Minority")]
    DRIVING_EXPERIENCE_CHOICES = [
        ("0-9y", "0-9 years"),
        ("10-19y", "10-19 years"),
        ("20-29y", "20-29 years"),
        ("30y+", "30+ years"),
    ]
    EDUCATION_CHOICES = [
        ("none", "None"),
        ("high school", "High School"),
        ("university", "University"),
    ]

    INCOME_CHOICES = [
        ("poverty", "Poverty"),
        ("working class", "Working Class"),
        ("middle class", "Middle Class"),
        ("upper class", "Upper Class"),
    ]

    AGE = models.IntegerField(verbose_name="AGE", choices=AgeChoices.choices)
    GENDER = models.CharField(max_length=10, choices=GENDER_CHOICES)
    RACE = models.CharField(max_length=20, choices=RACE_CHOICES)
    DRIVING_EXPERIENCE = models.CharField(
        max_length=10, choices=DRIVING_EXPERIENCE_CHOICES
    )
    EDUCATION = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
    INCOME = models.CharField(max_length=20, choices=INCOME_CHOICES)

    CREDIT_SCORE = models.FloatField()
    VEHICLE_OWNERSHIP = models.BooleanField(default=True)
    VEHICLE_YEAR = models.CharField(
        max_length=20,
        choices=[("before 2015", "Before 2015"), ("after 2015", "After 2015")],
    )
    MARRIED = models.BooleanField()
    CHILDREN = models.BooleanField()
    POSTAL_CODE = models.CharField(max_length=10)
    ANNUAL_MILEAGE = models.IntegerField()
    VEHICLE_TYPE = models.CharField(
        max_length=20,
        choices=[("sedan", "Sedan"), ("sports car", "Sports Car")],
    )
    SPEEDING_VIOLATIONS = models.IntegerField()
    DUIS = models.IntegerField()
    PAST_ACCIDENTS = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.GENDER} driver ({self.AGE} years)"
