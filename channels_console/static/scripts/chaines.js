async function ouvrir_formulaire_clients(id, chaine) {
    ouvrir_formulaire(id);

    const elementChaine = document.getElementById("formulaire-chaine");
    elementChaine.textContent = chaine;

    const elementListeClients = document.getElementById("liste-clients");
    const selecteursClients = elementListeClients.querySelectorAll("input[type='checkbox']");

    const clientsChaine = await fetch(`/api/clients/chaine/${chaine}`).then(response => response.json());

    for (const selecteur of selecteursClients) selecteur.checked = clientsChaine.includes(selecteur.id);
}

async function ajouter_clients(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);

    const chaine = document.getElementById("formulaire-chaine").textContent;

    const elementListeClients = document.getElementById("liste-clients");
    const selecteursClients = elementListeClients.querySelectorAll("input[type='checkbox']");

    const clients = [];

    for (const selecteur of selecteursClients) if (selecteur.checked) clients.push(selecteur.id);

    await fetch(`/api/clients/ajouter/chaine`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            'clients': clients, 'chaine': chaine
        })
    });

    formulaire.style.display = "none";

    window.location.reload();
}

async function ouvrir_formulaire_deplacement(id, chaine) {
    ouvrir_formulaire(id);

    const elementChaine = document.getElementById("chaine-a-deplacer");
    elementChaine.textContent = chaine;
}

async function deplacer_chaine(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);

    const idChaine = document.getElementById("chaine-a-deplacer").textContent;

    const zoneTri = document.getElementById("zone-tri");
    const elementsTri = Array.from(zoneTri.querySelectorAll(".element-tri"));

    const position = elementsTri.findIndex(e => e.id === idChaine);
    const nouvellePosition = Number(document.getElementById("nouvelle-position").value);

    const elementDeplace = elementsTri.splice(position, 1)[0];
    elementsTri.splice(nouvellePosition, 0, elementDeplace);

    zoneTri.innerHTML = "";
    elementsTri.forEach((element, index) => {
        const elementNumero = element.querySelector("#numero");
        elementNumero.textContent = String(index);
        zoneTri.appendChild(element);
    });

    formulaire.style.display = "none";
}