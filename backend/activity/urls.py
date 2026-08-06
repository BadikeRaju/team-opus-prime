from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogViewSet, NotificationViewSet

router = DefaultRouter()
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
]
