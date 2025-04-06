from rest_framework import serializers
from .models import TrustScore, TrustScoreHistory, UserRating, Badge, UserBadge, LenderAchievement
from users.serializers import UserSerializer

class TrustScoreHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustScoreHistory
        fields = '__all__'

class TrustScoreSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    history = TrustScoreHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = TrustScore
        fields = '__all__'

class UserRatingSerializer(serializers.ModelSerializer):
    rater_username = serializers.CharField(source='rater.username', read_only=True)
    rated_user_username = serializers.CharField(source='rated_user.username', read_only=True)
    
    class Meta:
        model = UserRating
        fields = ['id', 'rater', 'rater_username', 'rated_user', 'rated_user_username', 
                 'rating', 'comment', 'created_at']
        read_only_fields = ['rater']

class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge_details = BadgeSerializer(source='badge', read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'badge_details', 'earned_at']

class LenderAchievementSerializer(serializers.ModelSerializer):
    badges = UserBadgeSerializer(source='user.badges', many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LenderAchievement
        fields = ['id', 'user', 'username', 'total_loans_given', 'total_amount_lent',
                 'average_interest_rate', 'total_borrowers_helped', 'community_rating',
                 'points', 'last_updated', 'badges'] 