from django.contrib import admin
from django.urls import path
from visualization.views import get_data

urlpatterns = [
    path('admin/', admin.site.urls),
    path('data/', get_data, name='get_data'),
]