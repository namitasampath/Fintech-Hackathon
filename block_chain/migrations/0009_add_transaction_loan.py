from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0004_remove_loan_lender_alter_loan_status_loanoffer'),
        ('block_chain', '0007_alter_transaction_amount_alter_transaction_recipient_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='loan',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='blockchain_transactions', to='loans.loan'),
        ),
    ] 