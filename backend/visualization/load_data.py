import json
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()
from visualization.models import DataEntry


def load_json_data(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        for entry in data:
            DataEntry.objects.create(
                end_year=entry.get('end_year') if entry.get('end_year') else None,
                intensity=entry.get('intensity', 0),
                sector=entry.get('sector', ''),
                topic=entry.get('topic', ''),
                insight=entry.get('insight', ''),
                url=entry.get('url', ''),
                region=entry.get('region', ''),
                start_year=entry.get('start_year') if entry.get('start_year') else None,
                impact=entry.get('impact') if entry.get('impact') else None,
                added=entry.get('added', ''),
                published=entry.get('published', ''),
                country=entry.get('country', ''),
                relevance=entry.get('relevance', 0),
                pestle=entry.get('pestle', ''),
                source=entry.get('source', ''),
                title=entry.get('title', ''),
                likelihood=entry.get('likelihood', 0),
                city=entry.get('city', '')  # Add city if present in your data
            )

if __name__ == "__main__":
    load_json_data('visualization/Data/data.json')