async function enregistrer() {
    const zoneTri = document.getElementById('zone-tri');
    const pays = zoneTri.querySelectorAll("tr");

    const listePays = [];

    for (const p of pays) {
        const nom = p.querySelector("td[id='nom_pays']").textContent;
        const chaineParDefaut = p.querySelector("td[id='chaine_par_defaut']").textContent;

        listePays.push({pays: nom, chaine: chaineParDefaut});
    }

    await fetch('/api/pays/enregistrer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pays: listePays})
    });

    window.location.reload();
}