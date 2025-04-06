from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'chain', views.BlockchainViewSet, basename='blockchain')
router.register(r'blocks', views.BlockViewSet, basename='block')
router.register(r'transactions', views.TransactionViewSet, basename='transaction')

urlpatterns = [
    path('', include(router.urls)),
] 