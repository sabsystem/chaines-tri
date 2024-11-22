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

// Changer le nom de l'argument pour être cohérent
async function supprimer_client(nom_du_client) {
    try {
        const response = await fetch('/api/clients/supprimer', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nom: nom_du_client })
        });

        // Vérifier la réponse de l'API
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur lors de la suppression du client:", errorData.error);
            alert(`Erreur : ${errorData.error}`);
            return;
        }

        alert("Client supprimé avec succès!");
        window.location.reload();
    } catch (error) {
        console.error("Erreur lors de la suppression du client:", error);
        alert("Une erreur est survenue.");
    }
}

