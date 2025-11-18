import json
import logging

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core.mail import send_mail
from django.http import JsonResponse, HttpRequest
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods

from .forms import ProfileForm, SignupForm, SocialMediaForm
from .models import Profile, SocialMediaPost, SocialMediaProfile


def _redirect_target(request, default='accounts:home'):
    next_url = request.GET.get('next')
    return next_url if next_url else default


logger = logging.getLogger(__name__)


def home(request):
    social_form = SocialMediaForm(request.POST or None)
    profiles = request.user.social_profiles.all() if request.user.is_authenticated else []
    if request.method == 'POST':
        if not request.user.is_authenticated:
            messages.error(request, 'You must be signed in to track social profiles.')
            return redirect('accounts:login')

        if social_form.is_valid():
            social = social_form.save(commit=False)
            social.user = request.user
            social.save()
            messages.success(request, 'Social profile tracked.')
            return redirect('accounts:home')

    return render(request, 'accounts/home.html', {
        'user': request.user,
        'social_form': social_form,
        'profiles': profiles,
    })


def _serialize_profile(profile: SocialMediaProfile) -> dict[str, object]:
    return {
        'id': profile.id,
        'platform': profile.platform,
        'handle': profile.handle,
        'url': profile.url,
        'description': profile.description,
    }


def _serialize_post(post: SocialMediaPost) -> dict[str, object]:
    return {
        'id': post.id,
        'profile_id': post.profile_id,
        'caption': post.caption,
        'scheduled_at': post.scheduled_at.isoformat() if post.scheduled_at else None,
        'posted_at': post.posted_at.isoformat() if post.posted_at else None,
        'created_at': post.created_at.isoformat(),
    }


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def social_profiles_api(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    if request.method == 'GET':
        profiles = request.user.social_profiles.order_by('-updated_at')
        return JsonResponse({'profiles': [ _serialize_profile(profile) for profile in profiles ]})

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    form = SocialMediaForm(payload)
    if not form.is_valid():
        return JsonResponse({'error': form.errors.get_json_data()}, status=400)

    profile = form.save(commit=False)
    profile.user = request.user
    profile.save()
    return JsonResponse(_serialize_profile(profile), status=201)


@require_http_methods(['GET', 'POST'])
@ensure_csrf_cookie
def social_posts_api(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=403)

    if request.method == 'GET':
        posts = SocialMediaPost.objects.filter(profile__user=request.user).order_by('-created_at')
        return JsonResponse({'posts': [_serialize_post(post) for post in posts]})

    try:
        payload = json.loads(request.body.decode() or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

    profile_id = payload.get('profile_id')
    caption = payload.get('caption')
    if not profile_id or not caption:
        return JsonResponse({'error': 'Profile and caption required'}, status=400)

    try:
        profile = SocialMediaProfile.objects.get(pk=profile_id, user=request.user)
    except SocialMediaProfile.DoesNotExist:
        return JsonResponse({'error': 'Invalid profile'}, status=404)

    scheduled = payload.get('scheduled_at')
    post = SocialMediaPost.objects.create(
        profile=profile,
        caption=caption,
        scheduled_at=scheduled if scheduled else None,
    )
    return JsonResponse(_serialize_post(post), status=201)


@login_required
def social_dashboard(request):
    return render(request, 'accounts/social_dashboard.html')


@login_required
def profile_view(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    form = ProfileForm(request.POST or None, request.FILES or None, instance=profile)
    if request.method == 'POST' and form.is_valid():
        form.save()
        messages.success(request, 'Profile updated.')
        return redirect('accounts:profile')

    return render(request, 'accounts/profile.html', {
        'user': request.user,
        'profile': profile,
        'form': form,
    })


def about(request):
    return render(request, 'accounts/about.html')


def support_info(request):
    offerings = [
        {'name': 'Live chat guidance', 'description': 'Vapi AI follows you through the workspace with contextual suggestions and support links.'},
        {'name': 'Ticketed support', 'description': 'Open a support request directly through Vapi AI with copies of your SEO dashboard state.'},
        {'name': 'Feature walk-through', 'description': 'Vapi’s assistant highlights each feature and explains how to use the SEO, ASO, marketplace, and social dashboards.'},
    ]
    return render(request, 'accounts/support.html', {
        'offerings': offerings,
        'vapi_url': 'https://vapi.ai',
    })


def _send_welcome_email(user):
    if not user.email:
        return

    subject = 'Welcome to Icycon SEO Intelligence'
    body = (
        f'Hi {user.get_full_name() or user.username},\n\n'
        'Thanks for signing up for the Icycon SEO dashboard. '
        'You can now manage metadata and backlinks centrally.\n\n'
        'If you need help, just reply to this email.'
    )
    try:
        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
    except Exception as exc:
        logger.exception('Unable to send welcome email', exc_info=exc)


def signup_view(request):
    if request.user.is_authenticated:
        return redirect('accounts:home')

    form = SignupForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.save()
        login(request, user)
        _send_welcome_email(user)
        messages.success(request, 'Account created! You are now signed in.')
        return redirect('accounts:home')

    return render(request, 'accounts/signup.html', {
        'form': form,
    })


def login_view(request):
    if request.user.is_authenticated:
        return redirect('accounts:home')

    form = AuthenticationForm(request, data=request.POST or None)
    if request.method == 'POST' and form.is_valid():
        user = form.get_user()
        login(request, user)
        messages.success(request, 'Signed in successfully.')
        return redirect(_redirect_target(request))

    return render(request, 'accounts/login.html', {
        'form': form,
    })


def logout_view(request): 
    if request.user.is_authenticated:
        logout(request)
        messages.info(request, 'You have been signed out.')
    return redirect('accounts:home')
