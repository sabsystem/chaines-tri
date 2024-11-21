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

    const input = document.createElement("input");
    const texte = element.innerText;
    input.type = "text";
    input.value = texte
    element.innerText = "";
    element.appendChild(input);

    input.onblur = function () {
        verification_modification_id(element, input, texte, liste_iptv);
    };

    input.onkeydown = function (event) {
        if (event.key === "Enter")
            verification_modification_id(element, input, texte, liste_iptv)
    };

    input.focus();
}

async function verification_modification_id(element, input, texte, liste_iptv) {
    const chaine = liste_iptv.find(iptv => iptv.id === input.value);

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

async function fusionner_occurrences(id) {
    const chaineAssocier = document.getElementById("chaine-a-associer").textContent;
    const iptvAssocier = document.getElementById("iptv-a-associer").textContent;

    const zoneTri = document.getElementById("zone-tri");
    const elementsTri = zoneTri.querySelectorAll(".element-tri");

    const listeChaines = await fetch("/api/chaines").then(response => response.json());

    const chaineAssocierInfos = listeChaines.find(c => c.nom_mumu === chaineAssocier);
    const iptvAssocierInfos = listeChaines.find(c => c.id === iptvAssocier);

    if (chaineAssocierInfos !== undefined && iptvAssocierInfos !== undefined)
        iptvAssocierInfos.occurrences = iptvAssocierInfos.occurrences.concat(chaineAssocierInfos.occurrences);

    listeChaines.pop(chaineAssocierInfos);
}