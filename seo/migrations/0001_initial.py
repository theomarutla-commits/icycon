from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='PageMeta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(max_length=100, unique=True)),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('keywords', models.TextField(blank=True)),
                ('canonical_url', models.URLField(blank=True)),
                ('is_indexable', models.BooleanField(default=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Backlink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.URLField()),
                ('anchor_text', models.CharField(blank=True, max_length=150)),
                ('source', models.CharField(blank=True, max_length=255)),
                ('status', models.CharField(choices=[('active', 'Active'), ('lost', 'Lost'), ('pending', 'Pending')], default='active', max_length=10)),
                ('is_follow', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('page', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='backlinks', to='seo.pagemeta')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
