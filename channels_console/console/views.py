import json

from django.shortcuts import render


def chaines(request):
    # Ouverture du fichier json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines = json.load(json_file)

    # On affiche la page chaines.html et on envoie à la page le contenu du fichier json avec {'console': console}
    return render(request, 'chaines.html', {'chaines': liste_chaines})


def clients(request, filtre=""):
    # Ouverture des fichiers json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines = json.load(json_file)

    with open("../res/liste_clients.json", "r") as json_file:
        liste_clients = json.load(json_file)

    # On affiche la page clients.html et on envoie à la page le contenu du fichier json avec {'console': console}
    return render(request, 'clients.html', {
        'chaines': liste_chaines,
        'clients': liste_clients,
        'filtre': filtre
    })
