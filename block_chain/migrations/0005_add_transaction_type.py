from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('block_chain', '0004_alter_transaction_recipient'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='transaction_type',
            field=models.CharField(choices=[('loan_funding', 'Loan Funding'), ('loan_payment', 'Loan Payment'), ('interest_payment', 'Interest Payment')], default='loan_payment', max_length=20),
        ),
    ] 