from rest_framework import permissions, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializer import MyTokenObtainPairSerializer, UserCreateSerializer


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAdminUser]
