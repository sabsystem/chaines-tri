from django.urls import path

from . import views

urlpatterns = [
    path("", views.chaines, name="chaines"),
    path("chaines", views.chaines, name="chaines"),
    path("clients", views.clients, name="clients"),
    path("clients/<str:filtre>", views.clients, name="clients"),
]
