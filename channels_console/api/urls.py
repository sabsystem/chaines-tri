from django.urls import path

from . import views

urlpatterns = [
    # Getters
    path("categories", views.categories, name="categories"),
    path("clients", views.clients, name="clients"),
    path("pays", views.pays, name="pays"),
    path("langues", views.langues, name="langues"),

    # Setters
    path("clients/ajouter", views.ajout_client, name="ajouter_client"),
]
