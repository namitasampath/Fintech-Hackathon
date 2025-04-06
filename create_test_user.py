import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'p2p_loan_network.settings')
django.setup()

from django.contrib.auth.models import User
from datetime import date

def create_test_user():
    # Create a new user
    username = input("Enter username: ")
    email = input("Enter email: ")
    password = input("Enter password: ")
    first_name = input("Enter first name: ")
    last_name = input("Enter last name: ")
    
    # Get date of birth
    while True:
        try:
            year = int(input("Enter birth year (YYYY): "))
            month = int(input("Enter birth month (1-12): "))
            day = int(input("Enter birth day (1-31): "))
            date_of_birth = date(year, month, day)
            
            # Check if user is 18 or older
            today = date.today()
            age = today.year - date_of_birth.year - ((today.month, today.day) < (date_of_birth.month, date_of_birth.day))
            if age < 18:
                print("Error: User must be 18 or older")
                continue
            break
        except ValueError:
            print("Invalid date. Please try again.")
    
    # Delete the user if it already exists
    User.objects.filter(username=username).delete()
    
    # Create new user
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )
    
    # Update the profile with the provided date of birth
    profile = user.profile
    profile.date_of_birth = date_of_birth
    profile.save()
    
    print(f"\nCreated user: {user.username}")
    print(f"Date of birth: {user.profile.date_of_birth}")
    print(f"Is adult: {user.profile.is_adult()}")
    print(f"\nYou can now log in with:")
    print(f"Username: {username}")
    print(f"Password: {password}")

if __name__ == '__main__':
    create_test_user() 