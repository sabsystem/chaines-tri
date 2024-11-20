import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# Getters
def categories(request):
    # Ouverture du fichier json
    with open("../res/liste_categories.json", "r") as json_file:
        liste_categories: list[dict] = json.load(json_file)

    # Envoi de la liste de categories à jour
    return JsonResponse(liste_categories, safe=False)


def clients(request):
    # Ouverture du fichier json
    with open("../res/liste_clients.json", "r") as json_file:
        liste_clients: list[str] = json.load(json_file)

    # Envoi de la liste de categories à jour
    return JsonResponse(liste_clients, safe=False)


def clients_chaine(request, chaine: str):
    # Ouverture des fichiers json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines: list[dict] = json.load(json_file)

    informations_chaine = next((c for c in liste_chaines if c["nom_mumu"] == chaine), None)

    liste_clients_chaine: list[str] = []

    if informations_chaine is not None:
        liste_clients_chaine = informations_chaine["clients"]

    # Envoi de la liste de categories à jour
    return JsonResponse(liste_clients_chaine, safe=False)


def pays(request):
    # Ouverture du fichier json
    with open("../res/liste_pays.json", "r") as json_file:
        liste_pays: list[str] = json.load(json_file)

    # Envoi de la liste de categories à jour
    return JsonResponse(liste_pays, safe=False)


def langues(request):
    # Ouverture du fichier json
    with open("../res/liste_langues.json", "r") as json_file:
        correspondance_langues: dict = json.load(json_file)

    liste_langues: list[str] = []

    for key, value in correspondance_langues.items():
        liste_langues.append(value)

    # Envoi de la liste de categories à jour
    return JsonResponse(liste_langues, safe=False)


# Setters
@csrf_exempt
def ajout_client(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nom = data.get("nom")

        # Ouverture du fichier json
        with open("../res/liste_clients.json", "r") as json_file:
            liste_clients: list[str] = json.load(json_file)

        liste_clients.append(nom)

        # Ecriture de la nouvelle liste de clients
        with open("../res/liste_clients.json", "w") as outfile:
            outfile.write(json.dumps(liste_clients, indent=4))

        # Envoi de la nouvelle liste de clients
        return JsonResponse(liste_clients, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def ajout_clients_chaine(request):
    if request.method == "POST":
        data = json.loads(request.body)
        liste_clients = data.get("clients")
        nom_chaine = data.get("chaine")

        # Ouverture du fichier json
        with open("../gen/association.json", "r") as json_file:
            liste_chaines: list[dict] = json.load(json_file)

        chaine = next((c for c in liste_chaines if c["nom_mumu"] == nom_chaine), None)

        if chaine is not None:
            chaine["clients"] = liste_clients

        # Ecriture de la nouvelle liste de clients
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(liste_chaines, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(liste_chaines, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
