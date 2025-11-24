# Generated manually
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.contrib.auth.models
import django.contrib.auth.validators
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, verbose_name='superuser status')),
                ('username', models.CharField(max_length=150, unique=True, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()])),
                ('first_name', models.CharField(blank=True, max_length=150)),
                ('last_name', models.CharField(blank=True, max_length=150)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('organization_name', models.CharField(blank=True, max_length=100)),
                ('region', models.CharField(blank=True, choices=[('US', 'United States'), ('EU', 'Europe'), ('UK', 'United Kingdom'), ('ZA', 'South Africa'), ('APAC', 'Asia-Pacific')], max_length=50)),
                ('plan', models.CharField(default='free', max_length=50)),
                ('brand_tone', models.TextField(blank=True, null=True)),
                ('organization_created_at', models.DateTimeField(blank=True, null=True)),
                ('organization_role', models.CharField(choices=[('owner', 'Owner'), ('admin', 'Admin'), ('editor', 'Editor'), ('viewer', 'Viewer')], default='owner', max_length=20)),
                ('groups', models.ManyToManyField(blank=True, related_name='custom_user_set', to='auth.group')),
                ('user_permissions', models.ManyToManyField(blank=True, related_name='custom_user_set', to='auth.permission')),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='OrganizationMembership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('owner', 'Owner'), ('admin', 'Admin'), ('editor', 'Editor'), ('viewer', 'Viewer')], default='viewer', max_length=20)),
                ('joined_at', models.DateTimeField(auto_now_add=True)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memberships', to=settings.AUTH_USER_MODEL)),
                ('organization', models.ForeignKey(limit_choices_to={'organization_name__isnull': False}, on_delete=django.db.models.deletion.CASCADE, related_name='member_memberships', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('member', 'organization')},
            },
        ),
    ]