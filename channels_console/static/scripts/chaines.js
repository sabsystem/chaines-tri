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

async function changer_id(element) {
    // Vérifie si un input ou select existe déjà dans la cellule pour éviter les duplications
    if (element.querySelector("input") || element.querySelector("select")) return;

    const liste_iptv = await fetch("/api/iptv").then(response => response.json());

    const select = document.createElement("select");
    select.innerHTML = liste_iptv.map(iptv => `<option value="${iptv.id}">${iptv.id}</option>`).join("\n");
    select.innerHTML += `<option value="None">None</option>`;
    const texte = element.innerText;
    select.value = texte;
    element.innerText = "";
    element.appendChild(select);

    select.onblur = function () {
        verification_modification_id(element, select, texte, liste_iptv);
    };

    select.onkeydown = function (event) {
        if (event.key === "Enter") verification_modification_id(element, select, texte, liste_iptv);
    };

    select.focus();
}

async function verification_modification_id(element, select, texte, liste_iptv) {
    const chaine = liste_iptv.find(iptv => iptv.id === select.value);

    if (chaine !== undefined) {
        const zoneTri = document.getElementById("zone-tri");
        const elementsTri = zoneTri.querySelectorAll(".element-tri");

        if (Array.from(elementsTri).find(e => e.id === chaine.id) && texte !== chaine.id) {
            element.innerText = texte;

            const chaineAssocier = document.getElementById("chaine-a-associer");
            chaineAssocier.textContent = element.parentElement.querySelector("#nom_mumu").innerText;

            const iptvAssocier = document.getElementById("iptv-a-associer");
            iptvAssocier.textContent = chaine.id;

            return ouvrir_formulaire('iptv-utilise');
        }

        const parent = element.parentElement;
        parent.id = chaine.id;
        element.innerText = chaine.id;
        parent.querySelector("#nom_github").innerText = chaine.nom;
        parent.querySelector("#pays").innerText = chaine.pays;
        parent.querySelector("#langue").innerText = chaine.langues[0];
        parent.querySelector("#categorie").innerText = chaine.categories[0];
        parent.querySelector("#adulte").innerText = chaine.adulte;
        parent.querySelector("#ip").innerText = chaine.ip;
    } else element.innerText = texte;
}

async function fusionner_occurrences(id_formulaire) {
    const chaineAssocier = document.getElementById("chaine-a-associer").textContent;
    const iptvAssocier = document.getElementById("iptv-a-associer").textContent;

    const zoneTri = document.getElementById("zone-tri");
    const elementsTri = zoneTri.querySelectorAll(".element-tri");

    const listeChaines = await fetch("/api/chaines").then(response => response.json());

    const chaineAssocierInfos = listeChaines.find(c => c.nom_mumu === chaineAssocier);
    const iptvAssocierInfos = listeChaines.find(c => c.id === iptvAssocier);

    console.log(chaineAssocierInfos);

    if (chaineAssocierInfos !== undefined && iptvAssocierInfos !== undefined) iptvAssocierInfos.occurrences = iptvAssocierInfos.occurrences.concat(chaineAssocierInfos.occurrences);

    listeChaines.splice(listeChaines.indexOf(chaineAssocierInfos), 1);

    await fetch("/api/chaines/modifier", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({chaines: listeChaines})
    });

    window.location.reload();
}

async function ouvrir_formulaire_occurrences(formulaire_id, chaine) {
    const elementChaine = document.getElementById("chaine-a-consulter");
    elementChaine.textContent = chaine;

    const listeOccurrences = document.getElementById("liste-occurrences");

    const occurrences = await fetch(`/api/occurrences`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            'chaine': chaine
        })
    }).then(response => response.json());

    listeOccurrences.innerHTML = "";

    let numero = 0;
    for (const occurrence of occurrences) listeOccurrences.innerHTML += `<td>${numero++}</td>
                                       <td id="service_id">${occurrence.service_id}</td>
                                       <td id="occurrence_diffuser" ondblclick="activerModification(this)">${occurrence.diffuser ? "True" : "False"}</td>
                                       <td id="occurrence_frequence">${occurrence.frequence}</td>
                                       <td id="occurrence_satellite">${occurrence.satellite}</td>
                                       <td id="cryptee">${occurrence.cryptee ? "True" : "False"}</td>
                                       <td id="en_ligne">${occurrence.en_ligne ? "True" : "False"}</td>
                                       <td id="occurrence_ber">${occurrence.ber}</td>
                                       <td id="occurrence_signal">${occurrence.signal}</td>
                                       <td id="occurrence_snr">${occurrence.snr}</td>
                                       <td id="occurrence_ub">${occurrence.ub}</td>
                                       <td id="occurrence_ts_d">${occurrence.ts_discontinuities}</td>`;

    ouvrir_formulaire(formulaire_id);
}

async function appliquer_modifications(formulaire_id) {
    const elementListeOccurrences = document.getElementById("liste-occurrences");
    const listeOccurrences = elementListeOccurrences.querySelectorAll("tr");

    const occurrences = [];

    for (const occurrence of listeOccurrences) {
        const service_id = Number(occurrence.querySelector("#service_id").textContent);
        const diffuser = occurrences.find(o => o.diffuser) !== undefined ? false : occurrence.querySelector("#occurrence_diffuser").textContent === "True";
        const frequence = occurrence.querySelector("#occurrence_frequence").textContent;
        const satellite = occurrence.querySelector("#occurrence_satellite").textContent;
        const cryptee = occurrence.querySelector("#cryptee").textContent === "True";
        const en_ligne = occurrence.querySelector("#en_ligne").textContent === "True";

        occurrences.push({
            satellite, frequence, service_id, diffuser, cryptee, en_ligne
        });
    }

    const chaine = document.getElementById("chaine-a-consulter").textContent;

    await fetch("/api/occurrences/modifier", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            chaine, occurrences
        })
    });

    fermer_formulaire(formulaire_id)
}

async function enregistrer() {
    const zoneTri = document.getElementById("zone-tri");
    const elementsTri = zoneTri.querySelectorAll(".element-tri");

    const chaines = [];

    for (const element of elementsTri) {
        const id = element.id;
        const nom_mumu = element.querySelector("#nom_mumu").innerText;
        const nom_github = element.querySelector("#nom_github").innerText;
        const pays = element.querySelector("#pays").innerText;
        const langue = element.querySelector("#langue").innerText;
        const categorie = element.querySelector("#categorie").innerText;
        const media = element.querySelector("#media").innerText;
        const adulte = element.querySelector("#adulte").innerText;
        const ip = element.querySelector("#ip").innerText;
        const forcer_diffusion = element.querySelector("#forcer_diffusion").innerText;
        const forcer_non_diffusion = element.querySelector("#forcer_non_diffusion").innerText;
        const a_diffuser = element.querySelector("#a_diffuser").innerText;

        chaines.push({
            id,
            nom_mumu,
            nom_github,
            pays,
            langue,
            categorie,
            media,
            adulte,
            ip,
            forcer_diffusion,
            forcer_non_diffusion,
            a_diffuser
        });
    }

    await fetch("/api/chaines/enregistrer", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({chaines})
    });

    window.location.reload();
}