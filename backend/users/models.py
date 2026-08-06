from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('PROJECT_MANAGER', 'Project Manager'),
        ('MEMBER', 'Member'),
        ('VIEWER', 'Viewer'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='VIEWER')
    bio = models.TextField(blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def is_admin(self):
        return self.role == 'ADMIN'
        
    def is_project_manager(self):
        return self.role == 'PROJECT_MANAGER'

    def __str__(self):
        return self.username
