from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Sum
from decimal import Decimal

User = get_user_model()

class TrustScore(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trust_score')
    score = models.DecimalField(max_digits=5, decimal_places=2, default=50.0)
    total_loans_completed = models.IntegerField(default=0)
    total_loans_defaulted = models.IntegerField(default=0)
    total_amount_lent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount_borrowed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_payment_delay = models.IntegerField(default=0)  # in days
    last_updated = models.DateTimeField(auto_now=True)

    def calculate_score(self):
        # Base score starts at 50
        score = Decimal('50.0')
        
        # Factor 1: Loan completion Rate (30 points max)
        if self.total_loans_completed > 0:
            completion_rate = (self.total_loans_completed - self.total_loans_defaulted) / self.total_loans_completed
            score += completion_rate * 30
        
        # Factor 2: Payment Punctuality (10 points max)
        if self.average_payment_delay <= 0:
            score += 5
        elif self.average_payment_delay <= 7:
            score += 3
        elif self.average_payment_delay <= 14:
            score += 1
        elif self.average_payment_delay >= 15:
            score -=5
        
        # Factor 3: Activity Level (10 points max)
        total_loans = self.total_loans_completed + self.total_loans_defaulted
        if total_loans >= 10:
            score += 5
        elif total_loans >= 5:
            score += 3
        elif total_loans >= 3:
            score += 2
        elif total_loans >= 1:
            score += 1
        
        # Ensure score stays within 0-100
        self.score = max(Decimal('0.0'), min(Decimal('100.0'), score))
        self.save()
        return self.score

    def update_from_loan_history(self):
        from loans.models import Loan, LoanPayment
        
        # Get completed loans
        completed_loans = Loan.objects.filter(
            borrower=self.user,
            status='COMPLETED'
        )
        
        # Get defaulted loans
        defaulted_loans = Loan.objects.filter(
            borrower=self.user,
            status='DEFAULTED'
        )
        
        # Update counts
        self.total_loans_completed = completed_loans.count()
        self.total_loans_defaulted = defaulted_loans.count()
        
        # Calculate total amounts
        self.total_amount_borrowed = completed_loans.aggregate(
            total=Sum('amount')
        )['total'] or Decimal('0.0')
        
        # Calculate average payment delay
        payments = LoanPayment.objects.filter(
            loan__borrower=self.user,
            loan__status__in=['COMPLETED', 'ACTIVE']
        )
        
        if payments.exists():
            self.average_payment_delay = payments.aggregate(
                avg_delay=Avg('payment_date')
            )['avg_delay'] or 0
        
        # Calculate new score
        self.calculate_score()
        return self.score

    def __str__(self):
        return f"Trust Score for {self.user.username}: {self.score}"

class TrustScoreHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trust_score_history')
    score = models.DecimalField(max_digits=5, decimal_places=2)
    reason = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trust Score History for {self.user.username}: {self.score} at {self.timestamp}"

class UserRating(models.Model):
    RATING_CHOICES = [
        (1, 'Poor'),
        (2, 'Fair'),
        (3, 'Good'),
        (4, 'Very Good'),
        (5, 'Excellent')
    ]
    
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_given')
    rated_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('rater', 'rated_user')
    
    def __str__(self):
        return f"{self.rater.username} rated {self.rated_user.username}: {self.rating}"

class Badge(models.Model):
    BADGE_TYPES = [
        ('COMMUNITY', 'Community Badge'),
        ('LENDER', 'Lender Badge'),
        ('ACHIEVEMENT', 'Achievement Badge')
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_type = models.CharField(max_length=20, choices=BADGE_TYPES)
    icon_url = models.URLField(max_length=200, null=True, blank=True)
    points_required = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'badge')
    
    def __str__(self):
        return f"{self.user.username} earned {self.badge.name}"

class LenderAchievement(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lender_achievements')
    total_loans_given = models.IntegerField(default=0)
    total_amount_lent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    total_borrowers_helped = models.IntegerField(default=0)
    community_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    points = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def calculate_points(self):
        points = 0
        
        # Points for number of loans given
        points += self.total_loans_given * 10
        
        # Points for amount lent (1 point per 1000)
        points += int(self.total_amount_lent / 1000)
        
        # Points for helping borrowers
        points += self.total_borrowers_helped * 5
        
        # Points for community rating
        points += int(self.community_rating * 20)
        
        # Bonus points for fair interest rates (5-15%)
        if 5 <= self.average_interest_rate <= 15:
            points += 50
        
        self.points = points
        self.save()
        return points
    
    def update_achievements(self):
        from loans.models import Loan
        
        # Update total loans and amount
        loans = Loan.objects.filter(lender=self.user, status='COMPLETED')
        self.total_loans_given = loans.count()
        self.total_amount_lent = loans.aggregate(total=Sum('amount'))['total'] or 0
        
        # Update average interest rate
        if self.total_loans_given > 0:
            self.average_interest_rate = loans.aggregate(avg=Avg('interest_rate'))['avg'] or 0
        
        # Update unique borrowers helped
        self.total_borrowers_helped = loans.values('borrower').distinct().count()
        
        # Update community rating
        ratings = UserRating.objects.filter(rated_user=self.user)
        if ratings.exists():
            self.community_rating = ratings.aggregate(avg=Avg('rating'))['avg'] or 0
        
        # Calculate new points
        self.calculate_points()
        
        # Award badges based on points
        self.award_badges()
        
        return self.points
    
    def award_badges(self):
        from django.db.models import Q
        
        # Community Provider Badge
        if self.points >= 1000:
            badge, _ = Badge.objects.get_or_create(
                name='Top Community Provider',
                defaults={
                    'description': 'Awarded for exceptional contribution to the community',
                    'badge_type': 'COMMUNITY',
                    'points_required': 1000
                }
            )
            UserBadge.objects.get_or_create(user=self.user, badge=badge)
        
        # Fair Lender Badge
        if 5 <= self.average_interest_rate <= 15 and self.total_loans_given >= 5:
            badge, _ = Badge.objects.get_or_create(
                name='Fair Lender',
                defaults={
                    'description': 'Awarded for maintaining fair interest rates',
                    'badge_type': 'LENDER',
                    'points_required': 0
                }
            )
            UserBadge.objects.get_or_create(user=self.user, badge=badge)
        
        # Trusted Lender Badge
        if self.community_rating >= 4.5 and self.total_loans_given >= 10:
            badge, _ = Badge.objects.get_or_create(
                name='Trusted Lender',
                defaults={
                    'description': 'Awarded for high community trust and consistent lending',
                    'badge_type': 'LENDER',
                    'points_required': 0
                }
            )
            UserBadge.objects.get_or_create(user=self.user, badge=badge)
