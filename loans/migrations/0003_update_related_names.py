from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('block_chain', '0002_remove_transaction_block_remove_transaction_receiver_and_more'),
        ('loans', '0002_rename_approved_at_loan_funded_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='loan',
            name='blockchain_transaction',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='funding_loan', to='block_chain.transaction'),
        ),
    ] 