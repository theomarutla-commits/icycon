from django.db import migrations
from django.db.migrations.operations.special import Merge


class Migration(migrations.Migration):

    dependencies = [
        ('aso', '0002_alter_applisting_bundle_id'),
        ('aso', '0002_competitors'),
    ]

    operations = [
        Merge(
            basis=('aso', '0002_alter_applisting_bundle_id'),
            head=('aso', '0002_competitors'),
        ),
    ]
