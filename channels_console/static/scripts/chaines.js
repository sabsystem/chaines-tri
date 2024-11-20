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

window.onclick = function (event) {
    const formulaire = document.getElementById('ajout-client');

    if (event.target === formulaire) fermer_formulaire('ajout-client');
}