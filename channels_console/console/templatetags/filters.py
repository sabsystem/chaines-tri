from django import template

register = template.Library()


@register.filter
def contenu_pages(entrees: int) -> list[int]:
    options = []
    for i in range(50, entrees + 1, 50):
        options.append(i)
    if entrees % 50 != 0:
        options.append(entrees)
    return options


@register.filter
def associations(chaines: list[dict]) -> int:
    liste_chaines: list[dict] = []

    for chaine in chaines:
        if chaine["id"] is not None:
            liste_chaines.append(chaine)

    return len(liste_chaines)


@register.filter
def client_nombre_chaines(client: str, chaines: list[dict]) -> int:
    compte: int = 0

    for chaine in chaines:
        if client in chaine["clients"]:
            compte += 1

    return compte


@register.filter
def sub(number: int, amount: int) -> int:
    return number - amount


@register.filter
def chaine_par_defaut(pays: str, chaines: list[dict]) -> str:
    for chaine in chaines:
        if pays in chaine["chaine_par_defaut"]:
            return chaine["nom_mumu"]
