from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from user.views import MyTokenObtainPairView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/user/", include("user.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("prediction/", include("prediction.urls")),
    path("claims/", include("claims.urls")),
]
