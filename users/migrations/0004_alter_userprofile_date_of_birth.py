# Generated by Django 4.2.20 on 2025-04-05 21:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_merge_20250405_2140'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='date_of_birth',
            field=models.DateField(blank=True, help_text='Required for loan applications and offers. Must be 18 or older.', null=True),
        ),
    ]
