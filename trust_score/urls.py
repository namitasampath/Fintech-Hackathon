from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'scores', views.TrustScoreViewSet)
router.register(r'history', views.TrustScoreHistoryViewSet)
router.register(r'ratings', views.UserRatingViewSet)
router.register(r'badges', views.BadgeViewSet)
router.register(r'achievements', views.LenderAchievementViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 