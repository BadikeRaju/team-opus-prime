from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            # Allow registration for everyone initially or restrict to admin based on requirements.
            # Let's say anyone can register as viewer, but only admin can create other admins.
            return [AllowAny()]
        elif self.action in ['destroy', 'update', 'partial_update']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
