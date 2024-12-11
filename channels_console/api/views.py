import json
import csv
from django.http import JsonResponse
from django.http import HttpResponse
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

    # Envoi de la liste de clients à jour
    return JsonResponse(liste_clients, safe=False)


def clients_chaine(request, chaine: str):
    # Ouverture des fichiers json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines: list[dict] = json.load(json_file)

    informations_chaine = next((c for c in liste_chaines if c["nom_mumu"] == chaine), None)

    liste_clients_chaine: list[str] = []

    if informations_chaine is not None:
        liste_clients_chaine = informations_chaine["clients"]

    # Envoi de la liste de clients de la chaîne à jour
    return JsonResponse(liste_clients_chaine, safe=False)


def equivalences_categorie(request, categorie: str):
    # Ouverture des fichiers json
    with open("../res/liste_categories.json", "r") as json_file:
        liste_categories: list[dict] = json.load(json_file)

    informations_categorie = next((c for c in liste_categories if c["nom"] == categorie), None)

    # Envoi de la liste d'équivalences de la catégorie à jour
    return JsonResponse(informations_categorie["equivalence"], safe=False)


def pays(request):
    # Ouverture des fichiers json
    with open("../res/liste_pays.json", "r") as json_file:
        liste_pays: list[dict] = json.load(json_file)

    with open("../gen/association.json", "r") as json_file:
        liste_chaines: list[dict] = json.load(json_file)

    for p in liste_pays:
        for chaine in liste_chaines:
            if p["pays"] == chaine["pays"]:
                if chaine["langue"] not in p["langues"]:
                    p["langues"].append(chaine["langue"])

    # Enregistrement des pays actuels
    with open("../res/liste_pays.json", "w") as outfile:
        outfile.write(json.dumps(liste_pays, indent=4))

    # Envoi de la liste de pays à jour
    return JsonResponse(liste_pays, safe=False)


def langues(request):
    # Ouverture du fichier json
    with open("../res/liste_langues.json", "r") as json_file:
        correspondance_langues: dict = json.load(json_file)

    liste_langues: list[str] = []

    for key, value in correspondance_langues.items():
        liste_langues.append(value)

    # Envoi de la liste de langues à jour
    return JsonResponse(liste_langues, safe=False)


def iptv(request):
    # Ouverture du fichier json
    with open("../gen/iptv.json", "r") as json_file:
        liste_chaines: dict = json.load(json_file)

    # Envoi de la liste de chaînes iptv à jour
    return JsonResponse(liste_chaines, safe=False)


def chaines(request):
    # Ouverture du fichier json
    with open("../gen/association.json", "r") as json_file:
        liste_chaines: dict = json.load(json_file)

    # Envoi de la liste de chaînes à jour
    return JsonResponse(liste_chaines, safe=False)


def frequences(request):
    # Ouverture du fichier json
    with open("../gen/frequences_mumu.json", "r") as json_file:
        liste_frequences: dict = json.load(json_file)

    # Envoi de la liste de fréquences à jour
    return JsonResponse(liste_frequences, safe=False)


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


@csrf_exempt
def suppression_client(request):
    if request.method == "POST":
        try:
            nom = json.loads(request.body).get("nom")
            if not nom:
                raise ValueError("Nom non fourni")

            # Supprimer le client de liste_clients.json
            with open("../res/liste_clients.json", "r+") as json_file:
                liste_clients = json.load(json_file)
                if nom in liste_clients:
                    liste_clients.remove(nom)
                    json_file.seek(0)
                    json.dump(liste_clients, json_file, indent=4)
                    json_file.truncate()
                else:
                    return JsonResponse({"error": "Client non trouvé"}, status=404)

            # Supprimer le client de toutes les chaînes dans association.json
            with open("../gen/association.json", "r+") as json_file:
                liste_chaines = json.load(json_file)
                for chaine in liste_chaines:
                    if nom in chaine.get("clients", []):
                        chaine["clients"].remove(nom)

                json_file.seek(0)
                json.dump(liste_chaines, json_file, indent=4)
                json_file.truncate()

            return JsonResponse({"message": "Client supprimé avec succès"})

        except (json.JSONDecodeError, ValueError):
            return JsonResponse({"error": "Nom non fourni ou données invalides"}, status=400)
        except FileNotFoundError:
            return JsonResponse({"error": "Fichier introuvable"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)


def telecharger_csv(request, client_nom):
    with open("../gen/association.json", "r") as json_file:
        associations = json.load(json_file)

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{client_nom}_chaines.csv"'

    writer = csv.writer(response, delimiter=";")
    # Les titres des colonnes
    writer.writerow(["CHANNELS", "IP ADDRESS", "PORT"])

    for association in associations:
        # Vérifie si le client fait partie de cette chaîne
        if client_nom in association.get("clients", []):
            nom_github = association.get("nom_github", "Inconnu")
            ip = association.get("ip", "Inconnue")
            port = 1234  # Port par défaut

            writer.writerow([nom_github, ip, port])

    return response


@csrf_exempt
def occurrences(request):
    if request.method == "POST":
        data = json.loads(request.body)
        chaine = data.get("chaine")

        # Ouverture des fichiers JSON
        with open("../gen/association.json", "r") as json_file:
            liste_chaines = json.load(json_file)

        with open("../gen/frequences_mumu.json", "r") as json_file:
            liste_frequences = json.load(json_file)

        chaine_associee = next((c for c in liste_chaines if c["nom_mumu"] == chaine), None)

        if chaine_associee is None:
            return JsonResponse({"error": "Chaine non trouvée"}, status=404)

        liste_occurrences = chaine_associee["occurrences"]

        for occurrence in liste_occurrences:
            frequence = next((f for f in liste_frequences if f["frequence"] == occurrence["frequence"]
                              and f["satellite"] == occurrence["satellite"]
                              and occurrence["service_id"] in f["service_ids"]), None)

            if frequence is not None:
                occurrence["ber"] = frequence["signal"]["ber"]
                occurrence["signal"] = frequence["signal"]["signal"]
                occurrence["snr"] = frequence["signal"]["snr"]
                occurrence["ub"] = frequence["signal"]["ub"]
                occurrence["ts_discontinuities"] = frequence["signal"]["ts_discontinuities"]

        return JsonResponse(liste_occurrences, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def occurrences_modifier(request):
    if request.method == "POST":
        data = json.loads(request.body)
        chaine = data.get("chaine")
        liste_occurrences = data.get("occurrences")

        # Ouverture des fichiers JSON
        with open("../gen/association.json", "r") as json_file:
            liste_chaines = json.load(json_file)

        chaine_associee = next((c for c in liste_chaines if c["nom_mumu"] == chaine), None)

        if chaine_associee is None:
            return JsonResponse({"error": "Chaine non trouvée"}, status=404)

        chaine_associee["occurrences"] = liste_occurrences

        # Sauvegarder les modifications dans le fichier JSON
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(liste_chaines, indent=4))

        return JsonResponse(liste_chaines, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def ajout_clients_chaine(request):
    if request.method == "POST":
        data = json.loads(request.body)
        client_nom = data.get("client")
        chaines = data.get("chaines")

        if client_nom and chaines:
            # Charger le fichier d'association JSON
            with open("../gen/association.json", "r") as json_file:
                liste_chaines = json.load(json_file)

            # Trouver la chaîne correspondant au client
            for chaine in liste_chaines:
                if chaine["id"] in chaines:
                    if client_nom not in chaine["clients"]:
                        chaine["clients"].append(client_nom)

            # Sauvegarder les modifications dans le fichier JSON
            with open("../gen/association.json", "w") as json_file:
                json.dump(liste_chaines, json_file, indent=4)

            return JsonResponse({"message": "Chaînes ajoutées avec succès"})
        else:
            return JsonResponse({"error": "Données invalides"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=400)


def get_chaines_pour_client(request, client_nom):
    # Charger le fichier JSON contenant les associations
    with open("../gen/association.json", "r") as json_file:
        liste_chaines = json.load(json_file)

    chaines_associees = [
        chaine["id"]
        for chaine in liste_chaines
        if client_nom in chaine["clients"]  # Vérifie si le client appartient à la chaîne
    ]

    return JsonResponse({"chaines_associees": chaines_associees})


@csrf_exempt
def modification_equivalences(request):
    if request.method == "POST":
        data = json.loads(request.body)
        liste_equivalences = data.get("equivalences")
        nom_categorie = data.get("categorie")

        # Ouverture du fichier json
        with open("../res/liste_categories.json", "r") as json_file:
            liste_categories: list[dict] = json.load(json_file)

        for equivalence in liste_equivalences:
            for categorie in liste_categories:
                if equivalence in categorie["equivalence"]:
                    categorie["equivalence"].remove(equivalence)

        categorie = next((c for c in liste_categories if c["nom"] == nom_categorie), None)

        if categorie is not None:
            categorie["equivalence"] = liste_equivalences

        # Ecriture de la nouvelle liste de clients
        with open("../res/liste_categories.json", "w") as outfile:
            outfile.write(json.dumps(liste_categories, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(liste_categories, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def suppression_categorie(request):
    if request.method == "DELETE":
        data = json.loads(request.body)
        nom_categorie = data.get("categorie")

        # Ouverture du fichier json
        with open("../res/liste_categories.json", "r") as json_file:
            liste_categories: list[dict] = json.load(json_file)

        categorie = next((c for c in liste_categories if c["nom"] == nom_categorie), None)

        if categorie is not None:
            liste_categories.remove(categorie)

        # Ecriture de la nouvelle liste de clients
        with open("../res/liste_categories.json", "w") as outfile:
            outfile.write(json.dumps(liste_categories, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(liste_categories, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def ajout_categorie(request):
    if request.method == "POST":
        data = json.loads(request.body)
        categorie: dict = data.get("categorie")

        # Ouverture du fichier json
        with open("../res/liste_categories.json", "r") as json_file:
            liste_categories: list[dict] = json.load(json_file)

        categorie_existante: dict = next((c for c in liste_categories if c["nom"] == categorie["nom"]), None)

        if categorie_existante is None:
            for equivalence in categorie["equivalence"]:
                for cat in liste_categories:
                    if equivalence in cat["equivalence"]:
                        cat["equivalence"].remove(equivalence)

            liste_categories.append(categorie)

        # Ecriture de la nouvelle liste de clients
        with open("../res/liste_categories.json", "w") as outfile:
            outfile.write(json.dumps(liste_categories, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(liste_categories, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def enregistrer_pays(request):
    if request.method == "POST":
        data = json.loads(request.body)
        informations = data.get("pays")

        liste_pays: list[dict] = []

        # Ouverture du fichier json
        with open("../gen/association.json", "r") as json_file:
            liste_chaines: list[dict] = json.load(json_file)

        for information in informations:
            nom_chaine = information["chaine"]
            nom_pays = information["pays"]
            langues_pays = information["langues"]
            diffuser_pays = information["diffuser"]

            liste_pays.append({
                "pays": nom_pays,
                "diffuser": diffuser_pays,
                "langues": langues_pays,
            })

            for chaine in liste_chaines:
                if chaine["nom_mumu"] == nom_chaine and nom_chaine != "None":
                    chaine["chaine_par_defaut"].append(nom_pays)

                elif nom_pays in chaine["chaine_par_defaut"]:
                    chaine["chaine_par_defaut"].remove(nom_pays)

        # Ecriture des nouvelles informations
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(liste_chaines, indent=4))

        with open("../res/liste_pays.json", "w") as outfile:
            outfile.write(json.dumps(liste_pays, indent=4))

        # Envoi de la nouvelle liste de pays
        return JsonResponse(liste_pays, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def enregistrer_serveurs(request):
    if request.method == "POST":
        data = json.loads(request.body)
        serveurs = data.get("serveurs")

        # Ouverture du fichier json
        with open("../res/liste_serveurs.json", "r") as json_file:
            liste_serveurs: dict = json.load(json_file)

        liste_serveurs = serveurs

        # Ecriture des nouvelles informations
        with open("../res/liste_serveurs.json", "w") as outfile:
            outfile.write(json.dumps(liste_serveurs, indent=4))

        # Envoi de la nouvelle liste de serveurs
        return JsonResponse(liste_serveurs, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def chaines_modifier(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nouvelle_liste_chaines = data.get("chaines")

        # Ecriture des nouvelles informations
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(nouvelle_liste_chaines, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(nouvelle_liste_chaines, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def chaines_enregistrer(request):
    if request.method == "POST":
        data = json.loads(request.body)
        nouvelle_liste_chaines = data.get("chaines")

        # Ouverture du fichier json
        with open("../gen/association.json", "r") as json_file:
            liste_chaines: list[dict] = json.load(json_file)

        nouvelles_chaines = []

        for nouvelle_chaine in nouvelle_liste_chaines:
            chaine = next((c for c in liste_chaines if c["nom_mumu"] == nouvelle_chaine["nom_mumu"]), None)

            if chaine is None:
                continue

            chaine["id"] = nouvelle_chaine["id"]
            chaine["nom_github"] = nouvelle_chaine["nom_github"]
            chaine["pays"] = nouvelle_chaine["pays"]
            chaine["langue"] = nouvelle_chaine["langue"]
            chaine["categorie"] = nouvelle_chaine["categorie"]
            chaine["media"] = nouvelle_chaine["media"]
            chaine["adulte"] = nouvelle_chaine["adulte"] == "True"
            chaine["ip"] = nouvelle_chaine["ip"]
            chaine["forcer_diffusion"] = nouvelle_chaine["forcer_diffusion"] == "True"
            chaine["forcer_non_diffusion"] = nouvelle_chaine["forcer_non_diffusion"] == "True"
            chaine["a_diffuser"] = nouvelle_chaine["a_diffuser"] == "True"

            nouvelles_chaines.append(chaine)

        # Ecriture des nouvelles informations
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(nouvelles_chaines, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(nouvelles_chaines, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def trier_categories(request):
    if request.method == "POST":
        nouvelles_chaines: list[dict] = []

        # Ouverture des fichiers json
        with open("../gen/association.json", "r") as json_file:
            liste_chaines: list[dict] = json.load(json_file)

        with open("../res/liste_categories.json", "r") as json_file:
            liste_categories: list[dict] = json.load(json_file)

        for categorie in liste_categories:
            for chaine in liste_chaines:
                if categorie["nom"] == chaine["categorie"]:
                    nouvelles_chaines.append(chaine)
                    liste_chaines.remove(chaine)

        # Ecriture des nouvelles informations
        with open("../gen/association.json", "w") as outfile:
            outfile.write(json.dumps(nouvelles_chaines, indent=4))

        # Envoi de la nouvelle liste de chaines
        return JsonResponse(nouvelles_chaines, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
