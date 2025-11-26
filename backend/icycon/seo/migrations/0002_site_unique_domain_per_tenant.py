from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('seo', '0001_initial'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='site',
            unique_together={('tenant', 'domain')},
        ),
    ]