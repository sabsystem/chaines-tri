async function ouvrir_formulaire_equivalences(id_formulaire, categorie) {
    ouvrir_formulaire(id_formulaire);

    const elementCategorie = document.getElementById("formulaire-categorie-equivalences");
    elementCategorie.textContent = categorie;

    const elementListeCategories = document.getElementById("liste-categories-modif");
    const selecteursCategories = elementListeCategories.querySelectorAll("input[type='checkbox']");

    const equivalencesCategorie = await fetch(`/api/categories/equivalences/${categorie}`).then(response => response.json());

    for (const selecteur of selecteursCategories) selecteur.checked = equivalencesCategorie.includes(selecteur.id);
}

async function modifier_equivalences(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    const categorie = document.getElementById("formulaire-categorie-equivalences").textContent;
    const elementListeCategories = document.getElementById("liste-categories-modif");
    const selecteursCategories = elementListeCategories.querySelectorAll("input[type='checkbox']");
    const equivalences = [];

    for (const selecteur of selecteursCategories) if (selecteur.checked) equivalences.push(selecteur.id);

    await fetch(`/api/categories/modifier/equivalences`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            'equivalences': equivalences, 'categorie': categorie
        })
    });

    formulaire.style.display = "none";

    window.location.reload();
}

async function supprimer_categorie(categorie) {
    await fetch(`/api/categories/supprimer`, {
        method: "DELETE", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            'categorie': categorie
        })
    });

    window.location.reload();
}

async function ajouter_categorie(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    const nom = document.querySelector("input[type='text'][id='nom-categorie']").value;
    const diffuser = document.querySelector("input[type='checkbox'][id='diffuser-categorie']").checked;
    const equivalence = [];

    const elementListeCategories = document.getElementById("liste-categories");
    const selecteursCategories = elementListeCategories.querySelectorAll("input[type='checkbox']");
    for (const selecteur of selecteursCategories) if (selecteur.checked) equivalence.push(selecteur.id);

    await fetch(`/api/categories/ajouter`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            'categorie': {nom, diffuser, equivalence}
        })
    });

    formulaire.style.display = "none";

    window.location.reload();
}