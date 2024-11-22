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

function telechargerCSV(clientNom) {
    if (!clientNom) {
        console.error("Le nom du client est introuvable.");
        alert("Nom du client introuvable.");
        return;
    }

    var csvContent = "Nom Client;Adresse IP;Port\n";
    csvContent += `"${clientNom}";"adresse ip";"1234"\n`;

    var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = `${clientNom}.csv`;
    a.click();
}


