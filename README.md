# P2P Loan Network

A decentralized peer-to-peer lending platform built with Django and blockchain technology. This platform enables direct lending between users while ensuring transaction security and transparency through blockchain verification.

## Features

- **User Management**
  - Secure user registration and authentication
  - Profile management with credit score tracking
  - Email verification system
  - Password reset functionality

- **Loan Management**
  - Create and manage loan requests
  - Make and accept loan offers
  - Track loan payments and status
  - Automated payment processing

- **Blockchain Integration**
  - Immutable transaction records
  - Chain validation for security
  - Transparent loan history
  - Smart contract-like functionality

## Technical Stack

- **Backend**: Django 4.2
- **Database**: PostgreSQL
- **Authentication**: Token-based with JWT
- **API Documentation**: Django REST Framework
- **Blockchain**: Custom implementation with cryptographic verification

## API Endpoints

### User Management
```
POST /api/users/register/     - Create new account
POST /api/users/login/        - Authenticate user
GET  /api/users/profile/      - View profile
PUT  /api/users/profile/      - Update profile
```

### Loan Operations
```
POST /api/loans/              - Create loan request
GET  /api/loans/              - List loans
POST /api/loans/{id}/offers/  - Make loan offer
POST /api/loans/{id}/payments/- Process payment
```

### Blockchain
```
GET  /api/blockchain/         - View blockchain
POST /api/blockchain/validate-chain/ - Verify integrity
```

## Setup

1. Clone the repository
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the server:
   ```bash
   python manage.py runserver
   ```

## Security Features

- Token-based authentication
- CORS protection
- CSRF protection
- Secure cookie handling
- Rate limiting
- Input validation
- SQL injection prevention

## Testing

Run the test suite:
```bash
python manage.py test
```

## API Documentation

Access the interactive API documentation at:
```
http://localhost:8000/docs/
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 