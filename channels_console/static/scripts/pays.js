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
        method: 'POST', headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({pays: listePays})
    });

    window.location.reload();
}

async function ouvrir_formulaire_langues(id_formulaire, pays) {
    const elementPays = document.querySelector(`tr[id='${pays}']`);
    const langues = elementPays.querySelector("td[id='langues']").querySelectorAll("span")

    const elementListeLangues = document.getElementById("liste-langues");
    elementListeLangues.innerHTML = "";

    let index = 0;
    for (const langue of langues) {
        const elementLangue = document.createElement("tr");
        elementLangue.classList.add("element-tri");
        elementLangue.draggable = true;
        elementLangue.ondragstart = () => dragStart(elementLangue);
        elementLangue.ondragenter = () => dragEnter(elementLangue, "liste-langues");
        elementLangue.ondragend = () => dragEnd(elementLangue, "liste-langues");
        elementLangue.textContent = langue.textContent;

        elementLangue.innerHTML = `<td id="numero">${index++}</td><td id="langue">${langue.textContent}</td>`;

        elementListeLangues.appendChild(elementLangue);
    }

    const elementNomPays = document.getElementById("pays-a-modifier");
    elementNomPays.textContent = pays;

    ouvrir_formulaire(id_formulaire);
}