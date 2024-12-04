function creerSelection(element, choix) {
    const select = document.createElement("select");

    select.innerHTML = choix.map(c => `<option value="${c}">${c}</option>`).join("\n");

    select.value = element.innerText;
    element.innerText = "";
    element.appendChild(select);

    select.onblur = function () {
        element.innerText = select.value;
    };

    select.onkeydown = function (event) {
        if (event.key === "Enter") {
            element.innerText = select.value;
        }
    };

    select.focus();
}

function creerInput(element) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = element.innerText;
    element.innerText = "";
    element.appendChild(input);

    input.onblur = function () {
        element.innerText = input.value;
    };

    input.onkeydown = function (event) {
        if (event.key === "Enter") {
            element.innerText = input.value;
        }
    };

    input.focus();
}

async function activerModification(element) {
    // Vérifie si un input ou select existe déjà dans la cellule pour éviter les duplications
    if (element.querySelector("input") || element.querySelector("select")) return;

    switch (element.id) {
        case "media":
            creerSelection(element, ["tv", "radio"])
            break;


        case "adulte":
        case "forcer_diffusion":
        case "forcer_non_diffusion":
        case "a_diffuser":
        case "diffuser":
            creerSelection(element, ["True", "False", "None"])
            break;

        case "categorie":
            const categories = await fetch("/api/categories").then(response => response.json());
            creerSelection(element, categories.map(c => c.nom).concat(["None"]))
            break;

        case "pays":
            const pays = await fetch("/api/pays").then(response => response.json());
            creerSelection(element, pays.concat(["None"]))
            break;

        case "langue":
            const langues = await fetch("/api/langues").then(response => response.json());
            creerSelection(element, langues.concat(["None"]))
            break;

        case "id_github":
        case "nom_github":
        case "nom_mumu":
        case "satellite":
        case "frequence":
            creerInput(element)
            break;

        case "chaine_par_defaut":
            const chaines = await fetch("/api/chaines").then(response => response.json());
            creerSelection(element, chaines.map(c => c.nom_mumu).concat(["None"]))
            break;
    }
}

// Gestion des formulaires
function ouvrir_formulaire(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    formulaire.style.display = "block";
}

function fermer_formulaire(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    formulaire.style.display = "none";
}

window.onclick = function (event) {
    if (event.target.classList.contains('formulaire')) fermer_formulaire(event.target.id);
}

// Fonctionnement du drag en drop pour le déplacement des chaînes
let selectedElement;
let referenceElement;

function dragStart(div) {
    selectedElement = div;

    div.classList.add("deplacement");
}

function dragEnter(div, id) {
    referenceElement = div;

    const zoneTri = document.getElementById(id);

    zoneTri.insertBefore(selectedElement, referenceElement);
}

function dragEnd(div, id) {
    div.classList.remove("deplacement");

    const zoneTri = document.getElementById(id);

    const elementsTri = zoneTri.querySelectorAll(".element-tri");

    let numero = 0;
    for (const element of elementsTri) {
        const elementNumero = element.querySelector("#numero");
        elementNumero.textContent = String(numero);
        numero++;
    }
}

// Gestion de la pagination des chaînes
let pageActuelle = 0;
let chainesParPage = 50;

function affichageChaines() {
    const debut = pageActuelle * chainesParPage;
    const rangees = document.querySelectorAll("#zone-tri tr");
    const fin = Math.min(debut + chainesParPage, rangees.length);

    rangees.forEach((row, index) => {
        if (index >= debut && index < fin) row.style.display = ""; else row.style.display = "none";
    });

    // Mise à jour du label du menu de sélection
    const label = document.querySelector("label[for='chaines-visibles']");
    label.textContent = `${debut}-${fin - 1}`;
}

function pageAvant() {
    if (pageActuelle > 0) {
        pageActuelle--;
        affichageChaines();
    }
}

function pageApres() {
    const nombreChaines = document.querySelectorAll("#zone-tri tr").length;
    if ((pageActuelle + 1) * chainesParPage < nombreChaines) {
        pageActuelle++;
        affichageChaines();
    }
}

function changerPage() {
    const select = document.getElementById("chaines-visibles");
    const option = parseInt(select.options[select.selectedIndex].value, 10);
    const debut = pageActuelle * chainesParPage;

    chainesParPage = option;
    pageActuelle = Math.floor(debut / chainesParPage);

    affichageChaines();
}

// Initialisation de l'affichage des chaînes
affichageChaines();