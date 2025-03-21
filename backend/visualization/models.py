from django.db import models

class DataEntry(models.Model):
    end_year = models.CharField(max_length=10, blank=True, null=True)
    intensity = models.IntegerField()
    sector = models.CharField(max_length=100, blank=True)
    topic = models.CharField(max_length=100, blank=True)
    insight = models.TextField()
    url = models.URLField()
    region = models.CharField(max_length=100, blank=True)
    start_year = models.CharField(max_length=10, blank=True, null=True)
    impact = models.CharField(max_length=10, blank=True, null=True)
    added = models.CharField(max_length=50)
    published = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True)
    relevance = models.IntegerField()
    pestle = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=200)
    title = models.TextField()
    likelihood = models.IntegerField()
    city = models.CharField(max_length=100, blank=True, null=True)  # Added optional city field

    def __str__(self):
        return f"{self.title[:50]}..."
