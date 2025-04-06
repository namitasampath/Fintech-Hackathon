from django.db import migrations, models
import django.db.models.deletion
from datetime import date

def set_default_date_of_birth(apps, schema_editor):
    UserProfile = apps.get_model('users', 'UserProfile')
    # Set a default date that would make users over 18 (e.g., 20 years ago)
    default_date = date(2000, 1, 1)
    UserProfile.objects.filter(date_of_birth__isnull=True).update(date_of_birth=default_date)

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(set_default_date_of_birth),
        migrations.AlterField(
            model_name='userprofile',
            name='date_of_birth',
            field=models.DateField(help_text='Required for loan applications and offers. Must be 18 or older.', null=False, blank=False),
        ),
    ] 