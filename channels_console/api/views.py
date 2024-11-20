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
