async function creer_client(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    const nom = document.getElementById("nom-client").value;

    await fetch(`/api/clients/ajouter`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({nom})
    });

    formulaire.style.display = "none";

    window.location.reload();
}

window.onclick = function (event) {
    const formulaire = document.getElementById('ajout-client');

    if (event.target === formulaire)
        fermer_formulaire('ajout-client');
}

async function supprimer_client(nom_client) {
    try {
        const response = await fetch('/api/clients/supprimer', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: nom_client })
        });

        if (!response.ok) {
            const { error } = await response.json();
            alert(`Erreur : ${error}`);
            return;
        }

        alert("Client supprimé avec succès!");
        window.location.reload();
    } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        alert("Une erreur est survenue.");
    }
}

async function ouvrir_formulaire_chaines(id_formulaire, clientNom) {
    ouvrir_formulaire(id_formulaire);

    const elementNomClient = document.getElementById("formulaire-chaine");
    elementNomClient.textContent = clientNom;

    const elementListeChaines = document.getElementById("liste-chaines");
    const selecteursChaines = elementListeChaines.querySelectorAll("input[type='checkbox']");

    // On récupère les chaînes déjà associées à ce client
    const chainesAssociees = await fetch(`/api/clients/${clientNom}/chaines`)
        .then(response => response.json());

    // On met à jour les cases à cocher des chaînes en fonction de celles déjà associées
    for (const selecteur of selecteursChaines) {
        selecteur.checked = chainesAssociees.includes(selecteur.id);
    }
}

// Fonction pour fermer le formulaire
function fermer_formulaire(id_formulaire) {
    document.getElementById(id_formulaire).style.display = 'none';
}

// Fonction pour ouvrir le formulaire (si nécessaire)
function ouvrir_formulaire(id_formulaire) {
    document.getElementById(id_formulaire).style.display = 'block';
}
