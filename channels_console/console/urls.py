from django.urls import path

from . import views

urlpatterns = [
    path("", views.accueil, name="accueil"),
    path("chaines", views.chaines, name="chaines"),
    path("clients", views.clients, name="clients"),
    path("clients/<str:filtre>", views.clients, name="clients"),
    path('pays/', views.pays, name='pays'),
    path('categories', views.categories, name='categories'),
    path('serveurs/', views.serveurs, name='serveurs'),
]
