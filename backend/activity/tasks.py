from celery import shared_task
from .models import Notification
from users.models import User

@shared_task
def send_notification_task(user_id, message):
    try:
        user = User.objects.get(id=user_id)
        Notification.objects.create(user=user, message=message)
        # Here we could also send an email or a real-time websocket event
        return f"Notification sent to {user.username}"
    except User.DoesNotExist:
        return f"User {user_id} not found"
