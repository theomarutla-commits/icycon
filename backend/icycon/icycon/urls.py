from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from users.auth_views import SignupView, LoginView
from users.views import profile_dashboard
from . import api_views as views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/signup', SignupView.as_view(), name='api_signup'),
    path('api/auth/login', LoginView.as_view(), name='api_login'),
    path('api/auth/request-reset', views.request_password_reset, name='api_request_reset'),
    path('api/auth/confirm-reset', views.confirm_password_reset, name='api_confirm_reset'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("", views.api_home, name="api-home"),
    # Core feature APIs are centralized in api_urls.py for scalability and single-source routing
    path("api/", include("icycon.api_urls")),
    path('api/chat/', include('chatbot.urls')),
    path('', include('users.urls')),
    path('api/profile', profile_dashboard, name='api_profile'),  # current user profile fetch/update
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
