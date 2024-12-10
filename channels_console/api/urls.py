from django.urls import path

from . import views

urlpatterns = [
    # Getters
    path("categories", views.categories, name="categories"),
    path("categories/equivalences/<str:categorie>", views.equivalences_categorie, name="equivalences_categorie"),
    path("clients", views.clients, name="clients"),
    path("clients/chaine/<str:chaine>", views.clients_chaine, name="clients_chaine"),
    path("clients/<str:client_nom>/chaines", views.get_chaines_pour_client, name="get_chaines_pour_client"),
    path("pays", views.pays, name="pays"),
    path("langues", views.langues, name="langues"),
    path("iptv", views.iptv, name="iptv"),
    path("chaines", views.chaines, name="chaines"),
    path("frequences", views.frequences, name="frequences"),

    # Setters
    path("clients/ajouter", views.ajout_client, name="ajouter_client"),
    path("clients/ajouter/chaine", views.ajout_clients_chaine, name="ajouter_clients_chaine"),
    path('clients/supprimer', views.suppression_client, name='suppression_client'),
    path('categories/modifier/equivalences', views.modification_equivalences, name='modification_equivalences'),
    path('categories/supprimer', views.suppression_categorie, name='suppression_categorie'),
    path('categories/ajouter', views.ajout_categorie, name='ajout_categorie'),
    path('telecharger_csv/<str:client_nom>/', views.telecharger_csv, name='telecharger_csv'),
    path('pays/enregistrer', views.enregistrer_pays, name='enregistrer_pays'),
    path("serveurs/enregistrer", views.enregistrer_serveurs, name="enregistrer_serveurs"),
    path("occurrences", views.occurrences, name="occurrences"),
    path("occurrences/modifier", views.occurrences_modifier, name="occurrences_modifier"),
    path("chaines/modifier", views.chaines_modifier, name="chaines_modifier"),
]
