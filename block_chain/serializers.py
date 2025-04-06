from rest_framework import serializers
from .models import Block, Transaction, Blockchain
from users.serializers import UserSerializer

class TransactionSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'recipient', 'amount', 'timestamp', 'status', 
                 'transaction_hash', 'description', 'transaction_type', 'loan']
        read_only_fields = ['transaction_hash', 'status', 'timestamp']

class BlockSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)
    hash = serializers.CharField(read_only=True)
    previous_hash = serializers.CharField()

    class Meta:
        model = Block
        fields = ['id', 'index', 'timestamp', 'transactions', 'previous_hash', 'hash', 'nonce']
        read_only_fields = ['hash', 'timestamp']

class BlockchainSerializer(serializers.ModelSerializer):
    chain = BlockSerializer(many=True, read_only=True)
    last_block = BlockSerializer(read_only=True)

    class Meta:
        model = Blockchain
        fields = ['id', 'chain', 'difficulty', 'last_block']
        read_only_fields = ['chain', 'last_block'] 