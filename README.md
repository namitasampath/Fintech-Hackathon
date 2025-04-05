# Decentralized Emergency Loan Network

A peer-to-peer (P2P) emergency loan platform that uses social trust scoring and blockchain to enable microloans without traditional credit scores.

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Linux/Mac
# or
.\venv\Scripts\activate  # On Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up the database:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

## Project Structure

- `blockchain/` - Core blockchain implementation
- `loans/` - Loan management system
- `users/` - User management and authentication
- `trust_score/` - Social trust scoring system

## Features

- Mock blockchain implementation
- P2P loan management
- Social trust scoring
- Basic identity verification
- Loan request and approval system
- Transaction history tracking

## API Endpoints

- `/api/loans/` - Loan management
- `/api/blockchain/` - Blockchain operations
- `/api/users/` - User management
- `/api/trust-score/` - Trust score operations 