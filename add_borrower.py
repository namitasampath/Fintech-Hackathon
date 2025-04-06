import os
import django
from datetime import date

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'p2p_loan_network.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from decimal import Decimal

def create_borrower():
    # Create borrower user
    borrower_data = {
        'username': 'borrower1',
        'email': 'borrower1@example.com',
        'first_name': 'John',
        'last_name': 'Borrower',
        'profile': {
            'phone_number': '+1234567890',
            'address': '123 Borrower St, New York',
            'date_of_birth': date(1990, 1, 1),
            'credit_score': 650,
            'wallet_address': '0x9876543210abcdef1234567890abcdef12345678',
            'total_loans_taken': 0,
            'total_amount_borrowed': Decimal('0.00'),
            'is_verified': False
        }
    }

    # Create user
    user = User.objects.create_user(
        username=borrower_data['username'],
        email=borrower_data['email'],
        password='borrower123',
        first_name=borrower_data['first_name'],
        last_name=borrower_data['last_name']
    )
    
    # Update profile
    profile = user.profile
    for key, value in borrower_data['profile'].items():
        setattr(profile, key, value)
    profile.save()
    
    print(f"Created borrower account:")
    print(f"Username: {user.username}")
    print(f"Password: borrower123")
    print(f"Email: {user.email}")

if __name__ == '__main__':
    create_borrower() 