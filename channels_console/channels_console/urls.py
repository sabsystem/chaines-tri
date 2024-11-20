from django.urls import path, include

urlpatterns = [
    path('', include('console.urls')),
    path('api/', include('api.urls')),
]
