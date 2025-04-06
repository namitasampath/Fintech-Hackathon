from django.contrib import admin
from .models import Loan, LoanPayment, LoanOffer

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('id', 'borrower', 'amount', 'interest_rate', 'term_months', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'funded_at', 'completed_at')
    search_fields = ('borrower__username', 'purpose')
    readonly_fields = ('created_at', 'updated_at', 'funded_at', 'completed_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('borrower', 'amount', 'interest_rate', 'term_months', 'purpose')
        }),
        ('Status Information', {
            'fields': ('status', 'created_at', 'updated_at', 'funded_at', 'completed_at')
        }),
    )

@admin.register(LoanOffer)
class LoanOfferAdmin(admin.ModelAdmin):
    list_display = ('id', 'loan', 'lender', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('loan__id', 'lender__username')

@admin.register(LoanPayment)
class LoanPaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'loan', 'amount', 'payment_date', 'is_principal')
    list_filter = ('is_principal', 'payment_date')
    search_fields = ('loan__id',)
    readonly_fields = ('payment_date',)
