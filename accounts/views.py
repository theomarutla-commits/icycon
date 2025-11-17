import logging

from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.core.mail import send_mail
from django.shortcuts import redirect, render

from .forms import SignupForm


def _redirect_target(request, default='accounts:home'):
    next_url = request.GET.get('next')
    return next_url if next_url else default


logger = logging.getLogger(__name__)


def home(request):
    return render(request, 'accounts/home.html', {
        'user': request.user,
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
