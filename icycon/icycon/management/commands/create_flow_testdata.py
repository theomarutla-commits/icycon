import json
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone


class Command(BaseCommand):
    help = 'Create test data for the main flow from a JSON template (dry-run by default).'

    def add_arguments(self, parser):
        parser.add_argument('--template', default='scripts/testdata/flow_template.json', help='Path to JSON template')
        parser.add_argument('--commit', action='store_true', help='Write data to DB')

    def handle(self, *args, **options):
        template_path = options['template']
        commit = options['commit']

        self.stdout.write(f'Loading template: {template_path}')
        try:
            with open(template_path, 'r', encoding='utf-8') as fh:
                data = json.load(fh)
        except FileNotFoundError:
            raise CommandError(f'Template not found: {template_path}')

        from django.apps import apps

        Tenant = apps.get_model('tenants', 'Tenant')
        User = apps.get_model('users', 'User')

        SMAccount = apps.get_model('social_media', 'SocialAccount')
        SMPost = apps.get_model('social_media', 'Post')

        SAccount = apps.get_model('social', 'SocialAccount')
        SPost = apps.get_model('social', 'Post')

        # Tenants and users
        for t in data.get('tenants', []):
            self.stdout.write(f"Tenant: {t['name']} (domain={t.get('domain')})")
            if commit:
                tenant = Tenant.objects.create(name=t['name'], domain=t.get('domain', ''))
            else:
                tenant = None

            for u in t.get('users', []):
                self.stdout.write(f"  User: {u['username']} <{u['email']}> is_super={u.get('is_superuser', False)}")
                if commit and tenant:
                    User.objects.create(username=u['username'], email=u['email'], is_superuser=u.get('is_superuser', False))

        # Social media accounts
        for acct in data.get('social_media', {}).get('accounts', []):
            self.stdout.write(f"SM account: tenant={acct['tenant']} platform={acct['platform']} handle={acct['handle']}")
            if commit:
                tenant = Tenant.objects.filter(name=acct['tenant']).first()
                if tenant:
                    SMAccount.objects.create(tenant=tenant, platform=acct['platform'], handle=acct['handle'], oauth_tokens={})

        # Social media posts
        for p in data.get('social_media', {}).get('posts', []):
            self.stdout.write(f"SM post: tenant={p['tenant']} title={p['title'][:30]} status={p.get('status')}")
            if commit:
                tenant = Tenant.objects.filter(name=p['tenant']).first()
                author = User.objects.filter(username=p.get('author')).first()
                if tenant and author:
                    SMPost.objects.create(
                        tenant=tenant,
                        author=author,
                        title=p.get('title', 'Test Post'),
                        content=p.get('content', ''),
                        excerpt=(p.get('content') or '')[:200],
                        post_type=p.get('post_type', 'post'),
                        category=p.get('category', 'general'),
                        status=p.get('status', 'draft'),
                        platforms=p.get('platforms', []),
                        scheduled_at=p.get('scheduled_at'),
                        media_attachments=p.get('media_attachments', []),
                    )

        # Legacy social
        for acct in data.get('social', {}).get('accounts', []):
            self.stdout.write(f"Legacy social account: {acct['handle']} on {acct['platform']}")
            if commit:
                tenant = Tenant.objects.filter(name=acct['tenant']).first()
                if tenant:
                    SAccount.objects.create(tenant=tenant, platform=acct['platform'], handle=acct['handle'], oauth_tokens={})

        for p in data.get('social', {}).get('posts', []):
            self.stdout.write(f"Legacy post: tenant={p['tenant']} body={p.get('body')[:40]} status={p.get('status')}")
            if commit:
                tenant = Tenant.objects.filter(name=p['tenant']).first()
                if tenant:
                    SPost.objects.create(tenant=tenant, platform=p.get('platform', ''), body=p.get('body', ''), status=p.get('status', 'draft'))

        if not commit:
            self.stdout.write('\nDry-run complete. Re-run with --commit to persist data.')
        else:
            self.stdout.write('\nData creation complete.')
