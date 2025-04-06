from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'loans', views.LoanViewSet, basename='loan')
router.register(r'offers', views.LoanOfferViewSet, basename='offer')
router.register(r'payments', views.LoanPaymentViewSet, basename='payment')

urlpatterns = [
    path('', include(router.urls)),
] 