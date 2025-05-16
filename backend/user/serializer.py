from rest_framework import serializers

from .models import CustomUser


class UserCreateSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(read_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "email",
            "password",
            "is_staff",
            "is_superuser",
            "name",
            "surname",
            "position",
        ]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
            name=validated_data.get("name", ""),
            surname=validated_data.get("surname", ""),
            position=validated_data.get("position", ""),
        )
        user.is_staff = validated_data.get("is_staff", False)
        user.is_superuser = validated_data.get("is_superuser", False)
        user.save()
        return user
