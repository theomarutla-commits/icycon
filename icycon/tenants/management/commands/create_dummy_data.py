from django.core.management.base import BaseCommand
from tenants.models import Tenant
from social.models import SocialAccount, Post, SocialLog
from seo.models import Site, KeywordCluster, ContentItem, FAQ
from email_engine.models import EmailList, Contact, EmailTemplate, EmailFlow, EmailSend
from django.utils import timezone

class Command(BaseCommand):
    help = 'Create dummy data for testing in dry run mode.'

    def handle(self, *args, **options):
        # Create test tenant
        tenant = Tenant.objects.create(
            name="Test Company",
            region="US",
            plan="free",
            brand_tone="Professional and friendly"
        )
        self.stdout.write(self.style.SUCCESS(f'Created tenant: {tenant.name}'))

        # Create Social dummy data
        account = SocialAccount.objects.create(
            tenant=tenant,
            platform="x",
            handle="@testcompany"
        )

        post = Post.objects.create(
            tenant=tenant,
            platform="x",
            status="draft",
            body="This is a test post #dryrun",
            scheduled_at=timezone.now()
        )

        log = SocialLog.objects.create(
            tenant=tenant,
            platform="x",
            action="create_post",
            message="[DRY RUN] Post created",
            policy_reference="Test policy"
        )
        
        # Create SEO dummy data
        site = Site.objects.create(
            tenant=tenant,
            domain="example.com",
            default_locale="en-US"
        )

        keywords = KeywordCluster.objects.create(
            tenant=tenant,
            intent="Test Keywords",
            terms=["test", "dummy", "keywords"]
        )

        content = ContentItem.objects.create(
            tenant=tenant,
            type="blog",
            url="https://example.com/blog/test",
            status="draft",
            brief_json={"topic": "Test Blog"}
        )

        faq = FAQ.objects.create(
            tenant=tenant,
            question="What is this?",
            answer="This is dummy data for testing."
        )

        # Create Email Engine dummy data
        email_list = EmailList.objects.create(
            tenant=tenant,
            name="Test List",
            lawful_basis="consent"
        )

        contact = Contact.objects.create(
            tenant=tenant,
            email="test@example.com",
            name="Test User"
        )

        template = EmailTemplate.objects.create(
            tenant=tenant,
            name="Test Template",
            subject="Test Email",
            body_html="<p>This is a test email</p>",
            body_text="This is a test email"
        )

        flow = EmailFlow.objects.create(
            tenant=tenant,
            name="Test Flow",
            template=template,
            description="A test email flow"
        )

        send = EmailSend.objects.create(
            tenant=tenant,
            template=template,
            recipient=contact,
            status="queued"
        )

        self.stdout.write(self.style.SUCCESS('Created dummy data for all apps'))