async function ouvrir_formulaire_adapteurs(id_formulaire, serveur) {
    const elementServeur = document.querySelector(`tr[id='${serveur}']`);
    console.log(elementServeur);
    const adapteurs = elementServeur.querySelector("td[id='adapteurs']").querySelectorAll("span");

    const elementListeAdapteurs = document.getElementById("liste-adapteurs");
    elementListeAdapteurs.innerHTML = "";

    for (const adapteur of adapteurs) {
        const elementAdapteur = document.createElement("tr");
        elementAdapteur.classList.add("element-tri");
        elementAdapteur.draggable = true;
        elementAdapteur.ondragstart = () => dragStart(elementAdapteur);
        elementAdapteur.ondragenter = () => dragEnter(elementAdapteur, "liste-adapteurs");
        elementAdapteur.ondragend = () => dragEnd(elementAdapteur, "liste-adapteurs");
        elementAdapteur.textContent = adapteur.textContent;

        elementAdapteur.innerHTML = `<td id="numero">${adapteur.textContent}</td>
                                     <td id="satellite" ondblclick="activerModification(this)">${adapteur.getAttribute("satellite")}</td>
                                     <td id="frequence" ondblclick="activerModification(this)">${adapteur.getAttribute("frequence")}</td>`;

        elementListeAdapteurs.appendChild(elementAdapteur);
    }

    const elementNomServeur = document.getElementById("serveur-a-modifier");
    elementNomServeur.textContent = serveur;

    ouvrir_formulaire(id_formulaire);
}