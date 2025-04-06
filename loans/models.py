from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
from django.dispatch import receiver
from users.twilio_utils import send_loan_upload_notification
import logging

logger = logging.getLogger('django')

class Loan(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('FUNDED', 'Funded'),
        ('REJECTED', 'Rejected'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('DEFAULTED', 'Defaulted'),
    ]
    
    borrower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='borrowed_loans')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
    term_months = models.IntegerField()
    purpose = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    funded_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    blockchain_transaction = models.ForeignKey('block_chain.Transaction', on_delete=models.SET_NULL, null=True, blank=True, related_name='funding_loan')
    
    def __str__(self):
        return f"Loan #{self.id} - {self.borrower.username} - {self.amount}"
    
    def clean(self):
        """Validate that the borrower is 18 or older."""
        if not self.borrower.profile.is_adult():
            raise ValidationError("Borrower must be 18 or older to apply for a loan.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def get_total_offers(self):
        return self.offers.filter(status='PENDING').aggregate(total=models.Sum('amount'))['total'] or 0
    
    def is_fully_funded(self):
        return self.get_total_offers() >= self.amount
    
    def fund_loan(self):
        if self.status == 'PENDING' and self.is_fully_funded():
            self.status = 'FUNDED'
            self.funded_at = timezone.now()
            self.save()
            return True
        return False
    
    def reject(self):
        if self.status == 'PENDING':
            self.status = 'REJECTED'
            self.save()
            return True
        return False
    
    def complete(self):
        if self.status == 'ACTIVE':
            self.status = 'COMPLETED'
            self.completed_at = timezone.now()
            self.save()
            return True
        return False
    
    def default(self):
        if self.status == 'ACTIVE':
            self.status = 'DEFAULTED'
            self.save()
            return True
        return False

@receiver(post_save, sender=Loan)
def notify_loan_creation(sender, instance, created, **kwargs):
    """
    Send SMS notification when a new loan is created
    """
    if created and instance.borrower.profile.phone_number:
        try:
            send_loan_upload_notification(
                instance.borrower.profile.phone_number,
                instance.amount,
                instance.id
            )
            logger.info(f"Loan creation notification sent to {instance.borrower.username}")
        except Exception as e:
            logger.error(f"Failed to send loan creation notification: {str(e)}")

class LoanOffer(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('WITHDRAWN', 'Withdrawn'),
    ]
    
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='offers')
    lender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loan_offers')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Offer for Loan #{self.loan.id} - {self.lender.username} - {self.amount}"
    
    def clean(self):
        """Validate that the lender is 18 or older."""
        if not self.lender.profile.is_adult():
            raise ValidationError("Lender must be 18 or older to make loan offers.")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def accept(self):
        if self.status == 'PENDING':
            self.status = 'ACCEPTED'
            self.save()
            return True
        return False
    
    def reject(self):
        if self.status == 'PENDING':
            self.status = 'REJECTED'
            self.save()
            return True
        return False
    
    def withdraw(self):
        if self.status == 'PENDING':
            self.status = 'WITHDRAWN'
            self.save()
            return True
        return False

class LoanPayment(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    is_principal = models.BooleanField(default=True)
    blockchain_transaction = models.ForeignKey('block_chain.Transaction', on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return f"Payment for Loan #{self.loan.id} - {self.amount}"
