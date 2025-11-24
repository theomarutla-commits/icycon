from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required
def aso_dashboard(request):
    """ASO Dashboard view."""
    return render(request, 'aso/dashboard.html')


@login_required
def aso_app_management(request):
    """ASO App Management view."""
    return render(request, 'aso/app_management.html')


@login_required
def aso_keyword_research(request):
    """ASO Keyword Research view."""
    return render(request, 'aso/keyword_research.html')
