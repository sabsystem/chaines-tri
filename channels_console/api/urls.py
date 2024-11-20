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
]
