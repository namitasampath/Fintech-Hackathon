from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import date

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(help_text='Required for loan applications and offers. Must be 18 or older.', null=True, blank=True)
    credit_score = models.IntegerField(default=0)
    wallet_address = models.CharField(max_length=42, unique=True, null=True, blank=True)
    total_loans_given = models.IntegerField(default=0)
    total_loans_taken = models.IntegerField(default=0)
    total_amount_lent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount_borrowed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_verified = models.BooleanField(default=False)
    trust_score = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
        
    def is_adult(self):
        """Check if the user is 18 or older based on their date of birth."""
        if not self.date_of_birth:
            return False
        today = date.today()
        age = today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
        return age >= 18

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
