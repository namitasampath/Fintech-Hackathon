from django.db import models
from django.contrib.auth import get_user_model
import hashlib
import json
import time
from django.utils import timezone

User = get_user_model()

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('failed', 'Failed'),
    )
    
    TRANSACTION_TYPES = (
        ('loan_funding', 'Loan Funding'),
        ('loan_payment', 'Loan Payment'),
        ('interest_payment', 'Interest Payment'),
    )
    
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sent_transactions')
    recipient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='received_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_hash = models.CharField(max_length=64, blank=True)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES, default='loan_payment')
    loan = models.ForeignKey('loans.Loan', on_delete=models.SET_NULL, null=True, related_name='blockchain_transactions')

    def calculate_hash(self):
        transaction_string = json.dumps({
            'sender': self.sender.username if self.sender else None,
            'recipient': self.recipient.username if self.recipient else None,
            'amount': str(self.amount),
            'timestamp': str(self.timestamp),
            'description': self.description,
            'transaction_type': self.transaction_type,
            'loan_id': self.loan.id if self.loan else None
        }, sort_keys=True)
        return hashlib.sha256(transaction_string.encode()).hexdigest()

    def __str__(self):
        return f'Transaction from {self.sender} to {self.recipient} - {self.amount}'

    def save(self, *args, **kwargs):
        if not self.transaction_hash:
            self.transaction_hash = self.calculate_hash()
        super().save(*args, **kwargs)

class Block(models.Model):
    index = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    transactions = models.ManyToManyField(Transaction, blank=True)
    previous_hash = models.CharField(max_length=64)
    hash = models.CharField(max_length=64, blank=True)
    nonce = models.IntegerField(default=0)

    def __str__(self):
        return f'Block {self.index}'

    def calculate_hash(self):
        # Handle case where block hasn't been saved yet
        transactions_data = []
        if self.id:  # Only try to access transactions if block is saved
            transactions_data = [
                {'sender': t.sender.username if t.sender else None, 'recipient': t.recipient.username if t.recipient else None, 'amount': str(t.amount)} 
                for t in self.transactions.all()
            ]
        
        block_string = json.dumps({
            'index': self.index,
            'timestamp': str(self.timestamp),
            'transactions': transactions_data,
            'previous_hash': self.previous_hash,
            'nonce': self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty=4):
        target = '0' * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        return self.hash

    def save(self, *args, **kwargs):
        if not self.hash:
            self.hash = self.calculate_hash()
        super().save(*args, **kwargs)

class Blockchain(models.Model):
    name = models.CharField(max_length=50, default='P2P Loan Network Chain')
    difficulty = models.IntegerField(default=4)
    created_at = models.DateTimeField(default=timezone.now)
    chain = models.ManyToManyField(Block, related_name='blockchain_chain')
    last_block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, related_name='last_block')

    def get_latest_block(self):
        return self.chain.order_by('-index').first()

    def add_block(self, block):
        block.previous_hash = self.get_latest_block().hash if self.get_latest_block() else "0" * 64
        block.hash = block.calculate_hash()
        block.mine_block(self.difficulty)
        block.save()
        self.chain.add(block)
        self.last_block = block
        self.save()

    def is_chain_valid(self):
        for i in range(1, len(self.chain.all())):
            current = self.chain.get(index=i)
            previous = self.chain.get(index=i-1)

            if current.hash != current.calculate_hash():
                return False

            if current.previous_hash != previous.hash:
                return False

        return True

    def __str__(self):
        return self.name
