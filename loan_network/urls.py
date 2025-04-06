from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/blockchain/', include('blockchain.urls')),
    path('api/loans/', include('loans.urls')),
    path('api/trust-score/', include('trust_score.urls')),
    path('api/users/', include('users.urls')),
] 