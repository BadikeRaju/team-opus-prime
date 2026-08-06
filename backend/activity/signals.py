from django.db.models.signals import post_save
from django.dispatch import receiver
from tasks.models import Task
from .models import ActivityLog
from .tasks import send_notification_task

@receiver(post_save, sender=Task)
def log_task_activity(sender, instance, created, **kwargs):
    action = "created task" if created else "updated task"
    
    # Normally we'd get the user from context/middleware, but for signals without request context,
    # we might just log the reporter or assignee. We'll use the assignee for this example.
    user = instance.assignee or instance.reporter
    if user:
        ActivityLog.objects.create(
            project=instance.project,
            user=user,
            action=action,
            description=f"Task '{instance.title}' was {action}."
        )
        
        # Send notification to the assignee if it's assigned to someone
        if instance.assignee:
            send_notification_task.delay(
                instance.assignee.id,
                f"Task '{instance.title}' was {action}."
            )
