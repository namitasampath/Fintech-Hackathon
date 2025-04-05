 from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Block, Transaction, Blockchain
from .serializers import BlockSerializer, TransactionSerializer, BlockchainSerializer
from django.db import transaction

class BlockchainViewSet(viewsets.ModelViewSet):
    queryset = Blockchain.objects.all()
    serializer_class = BlockchainSerializer

    @action(detail=True, methods=['get'])
    def validate_chain(self, request, pk=None):
        blockchain = self.get_object()
        is_valid = blockchain.is_chain_valid()
        return Response({'is_valid': is_valid})

    @action(detail=True, methods=['post'])
    def add_transaction(self, request, pk=None):
        blockchain = self.get_object()
        serializer = TransactionSerializer(data=request.data)
        
        if serializer.is_valid():
            with transaction.atomic():
                transaction_obj = serializer.save()
                latest_block = blockchain.get_latest_block()
                
                if not latest_block or len(latest_block.transactions) >= 10:  # Create new block after 10 transactions
                    new_block = Block.objects.create(
                        index=latest_block.index + 1 if latest_block else 0,
                        transactions=[]
                    )
                    blockchain.add_block(new_block)
                    latest_block = new_block
                
                latest_block.transactions.append(transaction_obj.id)
                latest_block.save()
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all()
    serializer_class = BlockSerializer

    @action(detail=True, methods=['post'])
    def mine(self, request, pk=None):
        block = self.get_object()
        blockchain = Blockchain.objects.first()
        if blockchain:
            block.mine_block(blockchain.difficulty)
            block.save()
            return Response(BlockSerializer(block).data)
        return Response({'error': 'No blockchain found'}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def perform_create(self, serializer):
        transaction_obj = serializer.save()
        transaction_obj.transaction_hash = transaction_obj.calculate_hash()
        transaction_obj.save()