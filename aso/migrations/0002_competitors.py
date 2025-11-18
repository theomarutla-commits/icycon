from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('aso', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='applisting',
            name='category',
            field=models.CharField(blank=True, max_length=100, default=''),
        ),
        migrations.AddField(
            model_name='applisting',
            name='primary_keyword',
            field=models.CharField(blank=True, max_length=120, default=''),
        ),
        migrations.CreateModel(
            name='AppCompetitor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150)),
                ('rating', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('downloads', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('listing', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='competitors', to='aso.applisting')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
