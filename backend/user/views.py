from rest_framework import permissions, viewsets

from .models import CustomUser
from .serializer import UserCreateSerializer


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAdminUser]


# class AdminCreateUserView(APIView):
#     permission_classes = [IsAdmin]
#
#     def post(self, request):
#         serializer = UserCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"message": "User created successfully."},
#                 status=status.HTTP_201_CREATED,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class AdminGetUserView(APIView):
#     permission_classes = [IsAdmin]
#     def get(self, requset):
#         return Response(data=CustomUser.objects.get(), status=status.HTTP_200_OK)
