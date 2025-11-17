from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_social_profile'),
    ]

    operations = [
        migrations.CreateModel(
            name='SocialMediaPost',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.CharField(max_length=280)),
                ('scheduled_at', models.DateTimeField(blank=True, null=True)),
                ('posted_at', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('profile', models.ForeignKey(on_delete=models.deletion.CASCADE, related_name='posts', to='accounts.socialmediaprofile')),
            ],
            options={
                'ordering': ['-scheduled_at', '-created_at'],
            },
        ),
    ]
