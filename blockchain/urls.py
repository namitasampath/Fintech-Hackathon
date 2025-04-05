from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'chain', views.BlockchainViewSet)
router.register(r'blocks', views.BlockViewSet)
router.register(r'transactions', views.TransactionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 