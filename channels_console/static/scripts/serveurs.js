async function ouvrir_formulaire_adapteurs(id_formulaire, serveur) {
    const elementServeur = document.querySelector(`tr[id='${serveur}']`);
    const adapteurs = elementServeur.querySelector("td[id='adapteurs']").querySelectorAll("span");

    const elementListeAdapteurs = document.getElementById("liste-adapteurs");
    elementListeAdapteurs.innerHTML = "";

    for (const adapteur of adapteurs) {
        const elementAdapteur = document.createElement("tr");
        elementAdapteur.classList.add("element-tri");
        elementAdapteur.draggable = true;
        elementAdapteur.ondragstart = () => dragStart(elementAdapteur);
        elementAdapteur.ondragenter = () => dragEnter(elementAdapteur, "liste-adapteurs");
        elementAdapteur.ondragend = () => dragEnd(elementAdapteur, "liste-adapteurs");
        elementAdapteur.textContent = adapteur.textContent;

        elementAdapteur.innerHTML = `<td id="numero">${adapteur.textContent}</td>
                                     <td id="satellite" ondblclick="activerModification(this)">${adapteur.getAttribute("satellite")}</td>
                                     <td id="frequence" ondblclick="activerModification(this)">${adapteur.getAttribute("frequence")}</td>
                                     <td id="actions"><button class="bouton" onclick="supprimer_adapteur(this)">
                                         <span class="material-symbols-rounded"> delete </span>
                                     </button></td>`;

        elementListeAdapteurs.appendChild(elementAdapteur);
    }

    const elementNomServeur = document.getElementById("serveur-a-modifier");
    elementNomServeur.textContent = serveur;

    ouvrir_formulaire(id_formulaire);
}

async function ajouter_adapteur() {
    const elementListeAdapteurs = document.getElementById("liste-adapteurs");
    const listeAdapteurs = elementListeAdapteurs.childNodes;

    const dernierAdapteur = listeAdapteurs[listeAdapteurs.length - 1];

    const adapteur = document.createElement("tr");
    adapteur.ondragstart = () => dragStart(adapteur);
    adapteur.ondragenter = () => dragEnter(adapteur, "liste-adapteurs");
    adapteur.ondragend = () => dragEnd(adapteur, "liste-adapteurs");
    adapteur.classList.add("element-tri");
    adapteur.draggable = true;
    const numero = Number(dernierAdapteur.querySelector("td[id='numero']").textContent) + 1;
    adapteur.innerHTML = `
        <td id="numero">${numero}</td>
        <td id="satellite">${dernierAdapteur.querySelector("td[id='satellite']").textContent}</td>
        <td id="frequence">Aucune</td>
        <td id="actions"><button class="bouton" onclick="supprimer_adapteur(this)">
            <span class="material-symbols-rounded"> delete </span>
        </button></td>`;

    elementListeAdapteurs.appendChild(adapteur);
}

async function appliquer_modifications() {
    const serveur = document.querySelector("span[id='serveur-a-modifier']").textContent;
    const elementListeAdapteurs = document.getElementById("liste-adapteurs");
    const listeAdapteurs = elementListeAdapteurs.childNodes;
    const adapteurs = {}

    for (const adapteur of listeAdapteurs) {
        const numero = Number(adapteur.querySelector("td[id='numero']").textContent);
        const satellite = adapteur.querySelector("td[id='satellite']").textContent;
        const frequence = adapteur.querySelector("td[id='frequence']").textContent;

        adapteurs[numero] = {satellite, frequence}
    }

    await fetch("/api/serveurs/modifier/adapteurs", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            serveur, adapteurs
        })
    });

    window.location.reload();
}

async function supprimer_adapteur(element) {
    element.parentElement.parentElement.remove();

    const elementListeAdapteurs = document.getElementById("liste-adapteurs");

    const elementsTri = elementListeAdapteurs.querySelectorAll(".element-tri");

    let numero = 0;
    for (const element of elementsTri) {
        const elementNumero = element.querySelector("#numero");
        elementNumero.textContent = String(numero);
        numero++;
    }

    alert("Adapteur supprimé avec succès, les numéros ont été organisés pour ne laisser aucun trou.\nN'oubliez pas d'appliquer les modifications pour les sauvegarder.");
}