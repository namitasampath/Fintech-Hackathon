from django.db import models
from django.contrib.auth import get_user_model
import hashlib
import json
import time

User = get_user_model()

class Block(models.Model):
    index = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)
    transactions = models.JSONField(default=list)
    previous_hash = models.CharField(max_length=64)
    hash = models.CharField(max_length=64)
    nonce = models.IntegerField(default=0)

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": str(self.timestamp),
            "transactions": self.transactions,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty=4):
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        return self.hash

    def __str__(self):
        return f"Block #{self.index}"

class Transaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('REJECTED', 'Rejected')
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transactions')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transactions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    transaction_hash = models.CharField(max_length=64, unique=True)
    block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, blank=True, related_name='block_transactions')

    def calculate_hash(self):
        transaction_string = f"{self.sender.id}{self.receiver.id}{self.amount}{self.timestamp}"
        return hashlib.sha256(transaction_string.encode()).hexdigest()

    def save(self, *args, **kwargs):
        if not self.transaction_hash:
            self.transaction_hash = self.calculate_hash()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Transaction {self.transaction_hash[:8]}"

class Blockchain(models.Model):
    chain = models.ManyToManyField(Block, related_name='blockchain_chain')
    difficulty = models.IntegerField(default=4)
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
        return f"Blockchain with {self.chain.count()} blocks"
