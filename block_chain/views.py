from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Block, Transaction, Blockchain
from .serializers import BlockSerializer, TransactionSerializer, BlockchainSerializer
from django.db import transaction
from users.permissions import IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly

# Create your views here. 

class BlockchainViewSet(viewsets.ModelViewSet):
    queryset = Blockchain.objects.all()
    serializer_class = BlockchainSerializer
    permission_classes = [permissions.AllowAny]  # Allow public access to blockchain data

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
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Block.objects.all().order_by('timestamp')

    def create(self, request, *args, **kwargs):
        # Get the latest block to use its hash as previous_hash
        latest_block = Block.objects.all().order_by('-timestamp').first()
        
        # Create new block with the previous hash and empty transactions
        data = {
            'index': request.data.get('index', 0),
            'previous_hash': latest_block.hash if latest_block else '0' * 64,
            'transactions': []  # Initialize with empty transactions
        }
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Mine the block after creation
        block = serializer.instance
        block.mine_block()
        block.save()
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['post'])
    def mine(self, request, pk=None):
        block = self.get_object()
        block.mine_block()
        return Response({'message': f'Block {block.index} mined successfully'})

    @action(detail=False, methods=['get'])
    def latest(self, request):
        latest_block = Block.objects.all().order_by('-timestamp').first()
        if latest_block:
            serializer = self.get_serializer(latest_block)
            return Response(serializer.data)
        return Response({'message': 'No blocks found'}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        transaction_obj = serializer.save()
        transaction_obj.transaction_hash = transaction_obj.calculate_hash()
        transaction_obj.save()
