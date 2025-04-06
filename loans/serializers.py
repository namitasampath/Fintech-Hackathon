from rest_framework import serializers
from .models import Loan, LoanPayment, LoanOffer
from users.serializers import UserSerializer

class LoanOfferSerializer(serializers.ModelSerializer):
    lender = UserSerializer(read_only=True)
    
    class Meta:
        model = LoanOffer
        fields = ['id', 'loan', 'lender', 'amount', 'status', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        validated_data['lender'] = self.context['request'].user
        return super().create(validated_data)

class LoanPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanPayment
        fields = ['id', 'loan', 'amount', 'payment_date', 'is_principal', 'blockchain_transaction']
        read_only_fields = ['payment_date', 'blockchain_transaction']

class LoanSerializer(serializers.ModelSerializer):
    borrower = UserSerializer(read_only=True)
    offers = LoanOfferSerializer(many=True, read_only=True)
    payments = LoanPaymentSerializer(many=True, read_only=True)
    total_offers = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    is_fully_funded = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Loan
        fields = ['id', 'borrower', 'amount', 'interest_rate', 'term_months', 
                 'purpose', 'status', 'created_at', 'updated_at', 'funded_at', 
                 'completed_at', 'blockchain_transaction', 'offers', 'payments',
                 'total_offers', 'is_fully_funded']
        read_only_fields = ['status', 'created_at', 'updated_at', 'funded_at', 
                           'completed_at', 'blockchain_transaction', 'total_offers',
                           'is_fully_funded']
    
    def create(self, validated_data):
        validated_data['borrower'] = self.context['request'].user
        return super().create(validated_data) 