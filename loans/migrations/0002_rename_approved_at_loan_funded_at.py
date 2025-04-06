from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('loans', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='loan',
            old_name='approved_at',
            new_name='funded_at',
        ),
    ] 