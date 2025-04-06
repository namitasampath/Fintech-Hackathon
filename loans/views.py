from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Loan, LoanPayment, LoanOffer
from .serializers import LoanSerializer, LoanPaymentSerializer, LoanOfferSerializer
from block_chain.models import Transaction as BlockchainTransaction, Blockchain, Block
from users.permissions import IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Loan.objects.all()
        return Loan.objects.filter(borrower=user) | Loan.objects.filter(offers__lender=user).distinct()
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def fund(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'PENDING':
            return Response(
                {'error': 'Only pending loans can be funded'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if loan.fund_loan():
            return Response({'status': 'Loan funded'})
        return Response(
            {'error': 'Failed to fund loan'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'PENDING':
            return Response(
                {'error': 'Only pending loans can be rejected'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if loan.reject():
            return Response({'status': 'Loan rejected'})
        return Response(
            {'error': 'Failed to reject loan'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'ACTIVE':
            return Response(
                {'error': 'Only active loans can be completed'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if loan.complete():
            return Response({'status': 'Loan completed'})
        return Response(
            {'error': 'Failed to complete loan'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def default(self, request, pk=None):
        loan = self.get_object()
        if loan.status != 'ACTIVE':
            return Response(
                {'error': 'Only active loans can be defaulted'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if loan.default():
            return Response({'status': 'Loan defaulted'})
        return Response(
            {'error': 'Failed to default loan'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def make_payment(self, request, pk=None):
        loan = self.get_object()
        amount = request.data.get('amount')
        is_principal = request.data.get('is_principal', True)
        
        if not amount:
            return Response(
                {'error': 'Amount is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            amount = float(amount)
        except ValueError:
            return Response(
                {'error': 'Invalid amount'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        with transaction.atomic():
            # Create payment record
            payment = LoanPayment.objects.create(
                loan=loan,
                amount=amount,
                is_principal=is_principal
            )
            
            # Create blockchain transaction
            blockchain = Blockchain.objects.first()
            if blockchain:
                # Distribute payment to lenders based on their offer amounts
                total_loan_amount = float(loan.amount)
                for offer in loan.offers.filter(status='ACCEPTED'):
                    offer_amount = float(offer.amount)
                    payment_share = (offer_amount / total_loan_amount) * amount
                    
                    blockchain_transaction = BlockchainTransaction.objects.create(
                        sender=request.user,
                        recipient=offer.lender,
                        amount=payment_share,
                        status='CONFIRMED'
                    )
                    payment.blockchain_transaction = blockchain_transaction
                    payment.save()
                    
                    # Add transaction to blockchain
                    latest_block = blockchain.get_latest_block()
                    if not latest_block or len(latest_block.transactions) >= 10:
                        new_block = Block.objects.create(
                            index=latest_block.index + 1 if latest_block else 0,
                            transactions=[]
                        )
                        blockchain.add_block(new_block)
                        latest_block = new_block
                    
                    latest_block.transactions.append(blockchain_transaction.id)
                    latest_block.save()
            
            return Response(LoanPaymentSerializer(payment).data)

class LoanOfferViewSet(viewsets.ModelViewSet):
    queryset = LoanOffer.objects.all()
    serializer_class = LoanOfferSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return LoanOffer.objects.all()
        return LoanOffer.objects.filter(lender=user)
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        offer = self.get_object()
        if offer.status != 'PENDING':
            return Response(
                {'error': 'Only pending offers can be accepted'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if offer.accept():
            # Check if loan is fully funded
            loan = offer.loan
            if loan.is_fully_funded():
                loan.fund_loan()
            return Response({'status': 'Offer accepted'})
        return Response(
            {'error': 'Failed to accept offer'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        offer = self.get_object()
        if offer.status != 'PENDING':
            return Response(
                {'error': 'Only pending offers can be rejected'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if offer.reject():
            return Response({'status': 'Offer rejected'})
        return Response(
            {'error': 'Failed to reject offer'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def withdraw(self, request, pk=None):
        offer = self.get_object()
        if offer.status != 'PENDING':
            return Response(
                {'error': 'Only pending offers can be withdrawn'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if offer.withdraw():
            return Response({'status': 'Offer withdrawn'})
        return Response(
            {'error': 'Failed to withdraw offer'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

class LoanPaymentViewSet(viewsets.ModelViewSet):
    queryset = LoanPayment.objects.all()
    serializer_class = LoanPaymentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return LoanPayment.objects.all()
        return LoanPayment.objects.filter(loan__borrower=user) | LoanPayment.objects.filter(loan__offers__lender=user).distinct()
