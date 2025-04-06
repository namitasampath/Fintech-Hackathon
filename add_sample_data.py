import os
import django
from datetime import date

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'p2p_loan_network.settings')
django.setup()

from django.contrib.auth.models import User
from users.models import UserProfile
from decimal import Decimal

def create_sample_users():
    # Create sample users
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'profile': {
                'phone_number': '+1234567890',
                'address': '123 Main St, New York',
                'date_of_birth': date(1990, 1, 1),
                'credit_score': 750,
                'wallet_address': '0x1234567890abcdef1234567890abcdef12345678',
                'total_loans_given': 5,
                'total_loans_taken': 2,
                'total_amount_lent': Decimal('10000.00'),
                'total_amount_borrowed': Decimal('5000.00'),
                'is_verified': True
            }
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'profile': {
                'phone_number': '+1987654321',
                'address': '456 Oak St, Los Angeles',
                'date_of_birth': date(1992, 5, 15),
                'credit_score': 800,
                'wallet_address': '0xabcdef1234567890abcdef1234567890abcdef12',
                'total_loans_given': 3,
                'total_loans_taken': 1,
                'total_amount_lent': Decimal('7500.00'),
                'total_amount_borrowed': Decimal('2000.00'),
                'is_verified': True
            }
        }
    ]

    for user_data in users_data:
        # Create user
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password='testpass123',
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        
        # Update profile
        profile = user.profile
        for key, value in user_data['profile'].items():
            setattr(profile, key, value)
        profile.save()
        
        print(f"Created user: {user.username}")

if __name__ == '__main__':
    create_sample_users() 