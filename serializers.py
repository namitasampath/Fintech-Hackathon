from rest_framework import serializers
from .models import Block, Transaction, Blockchain

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'sender', 'receiver', 'amount', 'timestamp', 'status', 'transaction_hash']
        read_only_fields = ['transaction_hash', 'status']

class BlockSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Block
        fields = ['id', 'index', 'timestamp', 'transactions', 'previous_hash', 'hash', 'nonce']
        read_only_fields = ['hash', 'previous_hash']

class BlockchainSerializer(serializers.ModelSerializer):
    chain = BlockSerializer(many=True, read_only=True)
    last_block = BlockSerializer(read_only=True)

    class Meta:
        model = Blockchain
        fields = ['id', 'chain', 'difficulty', 'last_block']
        read_only_fields = ['chain', 'last_block'] 