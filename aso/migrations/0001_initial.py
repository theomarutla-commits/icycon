from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        (settings.AUTH_USER_MODEL.split('.')[0], '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppListing',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('store', models.CharField(choices=[('apple', 'App Store'), ('google', 'Google Play'), ('amazon', 'Amazon'), ('other', 'Other')], default='other', max_length=15)),
                ('bundle_id', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('rating', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('downloads', models.PositiveIntegerField(default=0)),
                ('icon_url', models.URLField(blank=True)),
                ('last_updated', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='aso_listings', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-last_updated'],
            },
        ),
        migrations.CreateModel(
            name='AppMetric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('field', models.CharField(max_length=80)),
                ('value', models.CharField(max_length=150)),
                ('recorded_at', models.DateTimeField(auto_now_add=True)),
                ('listing', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='metrics', to='aso.applisting')),
            ],
            options={
                'ordering': ['-recorded_at'],
            },
        ),
    ]
