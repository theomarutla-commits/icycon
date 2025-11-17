from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import SocialMediaProfile


class SignupForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={'placeholder': 'you@example.com'}),
    )

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data.get('email', '')
        if commit:
            user.save()
        return user


class SocialMediaForm(forms.ModelForm):
    class Meta:
        model = SocialMediaProfile
        fields = ('platform', 'handle', 'url', 'description')
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
        }
