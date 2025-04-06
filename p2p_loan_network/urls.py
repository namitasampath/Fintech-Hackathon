"""
URL configuration for p2p_loan_network project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.documentation import include_docs_urls
from rest_framework.permissions import AllowAny

urlpatterns = [
    path('', RedirectView.as_view(url='/docs/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('loans.urls')),
    path('api/', include('block_chain.urls')),
    path('docs/', include_docs_urls(
        title='P2P Loan Network API',
        description='API for managing P2P loans and blockchain transactions',
        permission_classes=[AllowAny],
    )),
]
