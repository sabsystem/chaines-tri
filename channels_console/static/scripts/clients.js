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

    // Vérifie si le nom du client a bien été passé
    if (!clientNom) {
        console.error("Le nom du client n'a pas été passé correctement.");
        return;
    }

    const elementNomClient = document.getElementById("formulaire-client");

    elementNomClient.textContent = clientNom;
}

// Fonction pour fermer le formulaire
function fermer_formulaire(id_formulaire) {
    document.getElementById(id_formulaire).style.display = 'none';
}

// Fonction pour ouvrir le formulaire (si nécessaire)
function ouvrir_formulaire(id_formulaire) {
    document.getElementById(id_formulaire).style.display = 'block';
}

async function enregistrer_chaines(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    const clientNom = document.getElementById("formulaire-client").textContent;

    const elementListeChaines = document.getElementById("liste-chaines");
    const selecteursChaines = elementListeChaines.querySelectorAll("input[type='checkbox']");

    const chainesSelectionnees = [];

    for (const selecteur of selecteursChaines) {
        if (selecteur.checked) {
            chainesSelectionnees.push(selecteur.id.replace("chaine-", ""));
        }
    }

    if (chainesSelectionnees.length > 0) {
        await fetch(`/api/clients/ajouter/chaine`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                'client': clientNom,
                'chaines': chainesSelectionnees
            })
        });

        // Ferme le formulaire
        formulaire.style.display = "none";
        window.location.reload();
    } else {
        alert("Aucune chaîne sélectionnée");
    }
}


