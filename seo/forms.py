from django import forms

from .models import Backlink, PageMeta


class BacklinkForm(forms.ModelForm):
    page = forms.ModelChoiceField(
        queryset=PageMeta.objects.order_by('slug'),
        label='Page',
        help_text='Select the page that owns this backlink.',
    )

    class Meta:
        model = Backlink
        fields = ['page', 'url', 'anchor_text', 'source', 'status', 'is_follow']
        widgets = {
            'url': forms.URLInput(attrs={'placeholder': 'https://example.com'}),
            'anchor_text': forms.TextInput(attrs={'placeholder': 'Optional anchor text'}),
            'source': forms.TextInput(attrs={'placeholder': 'Where the link lives'}),
        }
