from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, SprintViewSet, BoardViewSet, BoardColumnViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'sprints', SprintViewSet, basename='sprint')
router.register(r'boards', BoardViewSet, basename='board')
router.register(r'board-columns', BoardColumnViewSet, basename='board-column')

urlpatterns = [
    path('', include(router.urls)),
]
