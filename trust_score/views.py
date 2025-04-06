from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Count
from .models import TrustScore, TrustScoreHistory, UserRating, Badge, UserBadge, LenderAchievement
from .serializers import (
    TrustScoreSerializer, TrustScoreHistorySerializer,
    UserRatingSerializer, BadgeSerializer, UserBadgeSerializer,
    LenderAchievementSerializer
)

# Create your views here.

class TrustScoreViewSet(viewsets.ModelViewSet):
    queryset = TrustScore.objects.all()
    serializer_class = TrustScoreSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TrustScore.objects.all()
        return TrustScore.objects.filter(user=user)
    
    @action(detail=True, methods=['post'])
    def update_score(self, request, pk=None):
        trust_score = self.get_object()
        new_score = trust_score.update_from_loan_history()
        
        # Create history entry
        TrustScoreHistory.objects.create(
            user=trust_score.user,
            score=new_score,
            reason='Score updated based on loan history'
        )
        
        return Response({
            'status': 'Score updated',
            'new_score': new_score
        })
    
    @action(detail=False, methods=['get'])
    def my_score(self, request):
        trust_score, created = TrustScore.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(trust_score)
        return Response(serializer.data)

class TrustScoreHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TrustScoreHistory.objects.all()
    serializer_class = TrustScoreHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TrustScoreHistory.objects.all()
        return TrustScoreHistory.objects.filter(user=user)

class UserRatingViewSet(viewsets.ModelViewSet):
    queryset = UserRating.objects.all()
    serializer_class = UserRatingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return UserRating.objects.all()
        return UserRating.objects.filter(rated_user=user)
    
    def perform_create(self, serializer):
        serializer.save(rater=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_ratings(self, request):
        ratings = UserRating.objects.filter(rated_user=request.user)
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def ratings_given(self, request):
        ratings = UserRating.objects.filter(rater=request.user)
        serializer = self.get_serializer(ratings, many=True)
        return Response(serializer.data)

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def my_badges(self, request):
        badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(badges, many=True)
        return Response(serializer.data)

class LenderAchievementViewSet(viewsets.ModelViewSet):
    queryset = LenderAchievement.objects.all()
    serializer_class = LenderAchievementSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return LenderAchievement.objects.all()
        return LenderAchievement.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        achievements = LenderAchievement.objects.all().order_by('-points')[:10]
        serializer = self.get_serializer(achievements, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def update_achievements(self, request, pk=None):
        achievement = self.get_object()
        new_points = achievement.update_achievements()
        serializer = self.get_serializer(achievement)
        return Response({
            'status': 'Achievements updated',
            'new_points': new_points,
            'achievement': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def my_achievements(self, request):
        achievement, created = LenderAchievement.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(achievement)
        return Response(serializer.data)
