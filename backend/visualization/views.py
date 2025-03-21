from django.http import JsonResponse
from .models import DataEntry

def get_data(request):
    filters = {
        'end_year': request.GET.get('end_year', ''),
        'topic': request.GET.get('topic', ''),
        'sector': request.GET.get('sector', ''),
        'region': request.GET.get('region', ''),
        'pestle': request.GET.get('pestle', ''),
        'source': request.GET.get('source', ''),
        'swot': request.GET.get('swot', ''),  # Assuming SWOT might be derived from insight/title
        'country': request.GET.get('country', ''),
        'city': request.GET.get('city', ''),
        'start_year': request.GET.get('start_year', ''),
        'impact': request.GET.get('impact', ''),
    }

    data = DataEntry.objects.all()
    if filters['end_year']:
        data = data.filter(end_year=filters['end_year'])
    if filters['topic']:
        data = data.filter(topic__icontains=filters['topic'])
    if filters['sector']:
        data = data.filter(sector__icontains=filters['sector'])
    if filters['region']:
        data = data.filter(region__icontains=filters['region'])
    if filters['pestle']:
        data = data.filter(pestle__icontains=filters['pestle'])
    if filters['source']:
        data = data.filter(source__icontains=filters['source'])
    if filters['swot']:  # Simplified SWOT filter (could be enhanced with logic)
        data = data.filter(title__icontains=filters['swot'])  # Assuming SWOT in title/insight
    if filters['country']:
        data = data.filter(country__icontains=filters['country'])
    if filters['city']:
        data = data.filter(city__icontains=filters['city'])
    if filters['start_year']:
        data = data.filter(start_year=filters['start_year'])
    if filters['impact']:
        data = data.filter(impact=filters['impact'])

    data_list = list(data.values(
        'end_year', 'intensity', 'sector', 'topic', 'insight', 'url', 'region',
        'start_year', 'impact', 'added', 'published', 'country', 'relevance',
        'pestle', 'source', 'title', 'likelihood', 'city'
    ))
    return JsonResponse({'data': data_list})