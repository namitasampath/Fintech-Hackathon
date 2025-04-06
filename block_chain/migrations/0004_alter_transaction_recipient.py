from django.db import migrations, models
import django.db.models.deletion
from django.contrib.auth import get_user_model

def migrate_user_fields(apps, schema_editor):
    Transaction = apps.get_model('block_chain', 'Transaction')
    User = apps.get_model('auth', 'User')
    
    for transaction in Transaction.objects.all():
        if transaction.sender_old:
            try:
                user = User.objects.get(username=transaction.sender_old)
                transaction.sender_new = user
            except User.DoesNotExist:
                transaction.sender_new = None
        
        if transaction.recipient_old:
            try:
                user = User.objects.get(username=transaction.recipient_old)
                transaction.recipient_new = user
            except User.DoesNotExist:
                transaction.recipient_new = None
        
        transaction.save()

class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
        ('block_chain', '0003_transaction_status_transaction_transaction_hash'),
    ]

    operations = [
        # Add new ForeignKey fields
        migrations.AddField(
            model_name='transaction',
            name='sender_new',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='sent_transactions_new', to='auth.user'),
        ),
        migrations.AddField(
            model_name='transaction',
            name='recipient_new',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='received_transactions_new', to='auth.user'),
        ),
        
        # Rename old fields
        migrations.RenameField(
            model_name='transaction',
            old_name='sender',
            new_name='sender_old',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='recipient',
            new_name='recipient_old',
        ),
        
        # Run data migration
        migrations.RunPython(migrate_user_fields),
        
        # Remove old fields
        migrations.RemoveField(
            model_name='transaction',
            name='sender_old',
        ),
        migrations.RemoveField(
            model_name='transaction',
            name='recipient_old',
        ),
        
        # Rename new fields to final names
        migrations.RenameField(
            model_name='transaction',
            old_name='sender_new',
            new_name='sender',
        ),
        migrations.RenameField(
            model_name='transaction',
            old_name='recipient_new',
            new_name='recipient',
        ),
    ] 