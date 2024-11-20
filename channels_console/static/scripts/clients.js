const formulaire = document.getElementById("ajout-client");

function nouveau_client() {
    formulaire.style.display = "block";
}

function fermer_formulaire() {
    formulaire.style.display = "none";
}

async function creer_client() {
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
    if (event.target === formulaire)
        fermer_formulaire();
}