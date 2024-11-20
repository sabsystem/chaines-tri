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