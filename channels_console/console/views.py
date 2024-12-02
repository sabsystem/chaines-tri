import json

from django.shortcuts import render


def chaines(request):
    # Ouverture des fichiers json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines = json.load(json_file)

    with open("../res/liste_clients.json", "r") as json_file:
        liste_clients = json.load(json_file)

    # On affiche la page chaines.html et on envoie à la page le contenu du fichier json avec {'console': console}
    return render(request, 'chaines.html', {
        'chaines': liste_chaines,
        'clients': liste_clients
    })


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


def pays(request):
    # Charger les pays depuis le fichier JSON
    with open("../res/liste_pays.json", "r") as json_file:
        liste_pays = json.load(json_file)

    # Afficher la page `pays.html` et transmettre la liste des pays
    return render(request, 'pays.html', {
        'pays': liste_pays
    })


def categories(request):
    # Charger les catégories depuis le fichier JSON
    with open("../res/liste_categories.json", "r") as json_file:
        liste_categories: list[dict] = json.load(json_file)

    # Charger les équivalences github depuis le fichier iptv.json
    with open("../gen/iptv.json", "r") as json_file:
        liste_github = json.load(json_file)

    liste_equivalences: list[str] = []

    for chaine in liste_github:
        for categorie in chaine['categories']:
            if categorie not in liste_equivalences:
                liste_equivalences.append(categorie)

    # Afficher la page `categories.html` et transmettre la liste des pays
    return render(request, 'categories.html', {
        'categories': liste_categories,
        'categories_github': liste_equivalences
    })
