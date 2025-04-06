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
    # Create borrower user with lower credit score and no lending history
    borrower_data = {
        'username': 'borrower2',
        'email': 'borrower2@example.com',
        'first_name': 'Bob',
        'last_name': 'Smith',
        'profile': {
            'phone_number': '+1234567890',
            'address': '123 Borrower St, New York',
            'date_of_birth': date(1992, 5, 15),
            'credit_score': 650,  # Lower credit score for borrower
            'wallet_address': '0xBBBB543210abcdef1234567890abcdef12345678',
            'total_loans_taken': 2,
            'total_amount_borrowed': Decimal('5000.00'),
            'total_loans_given': 0,
            'total_amount_lent': Decimal('0.00'),
            'is_verified': True
        }
    }

    # Create borrower
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
    
    print(f"\nCreated borrower account:")
    print(f"Username: {user.username}")
    print(f"Password: borrower123")
    print(f"Email: {user.email}")
    print(f"Credit Score: {profile.credit_score}")
    print(f"Total Borrowed: ${profile.total_amount_borrowed}")

def create_lender():
    # Create lender user with higher credit score and lending history
    lender_data = {
        'username': 'lender1',
        'email': 'lender1@example.com',
        'first_name': 'Alice',
        'last_name': 'Johnson',
        'profile': {
            'phone_number': '+1987654321',
            'address': '456 Lender Ave, Los Angeles',
            'date_of_birth': date(1985, 8, 20),
            'credit_score': 800,  # Higher credit score for lender
            'wallet_address': '0xLLLL543210abcdef1234567890abcdef12345678',
            'total_loans_given': 5,
            'total_amount_lent': Decimal('25000.00'),
            'total_loans_taken': 0,
            'total_amount_borrowed': Decimal('0.00'),
            'is_verified': True
        }
    }

    # Create lender
    user = User.objects.create_user(
        username=lender_data['username'],
        email=lender_data['email'],
        password='lender123',
        first_name=lender_data['first_name'],
        last_name=lender_data['last_name']
    )
    
    # Update profile
    profile = user.profile
    for key, value in lender_data['profile'].items():
        setattr(profile, key, value)
    profile.save()
    
    print(f"\nCreated lender account:")
    print(f"Username: {user.username}")
    print(f"Password: lender123")
    print(f"Email: {user.email}")
    print(f"Credit Score: {profile.credit_score}")
    print(f"Total Lent: ${profile.total_amount_lent}")

if __name__ == '__main__':
    print("Creating distinct borrower and lender accounts...")
    create_borrower()
    create_lender()
    print("\nAccounts created successfully!") 