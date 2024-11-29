from django.urls import path

from . import views

urlpatterns = [
    # Getters
    path("categories", views.categories, name="categories"),
    path("clients", views.clients, name="clients"),
    path("clients/chaine/<str:chaine>", views.clients_chaine, name="clients_chaine"),
    path("pays", views.pays, name="pays"),
    path("langues", views.langues, name="langues"),

    # Setters
    path("clients/ajouter", views.ajout_client, name="ajouter_client"),
    path("clients/ajouter/chaine", views.ajout_clients_chaine, name="ajouter_clients_chaine"),
    path('clients/supprimer', views.suppression_client, name='suppression_client'),

    path('pays/', views.pays, name='obtenir_pays'),
    path('pays/ajout/', views.ajout_pays, name='ajout_pays'),
    path('pays/suppression/', views.suppression_pays, name='suppression_pays'),
]
