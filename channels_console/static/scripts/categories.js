async function ouvrir_formulaire_equivalences(id_formulaire, categorie) {
    ouvrir_formulaire(id_formulaire);

    const elementCategorie = document.getElementById("formulaire-categorie-equivalences");
    elementCategorie.textContent = categorie;

    const elementListeCategories = document.getElementById("liste-categories");
    const selecteursCategories = elementListeCategories.querySelectorAll("input[type='checkbox']");

    const equivalencesCategorie = await fetch(`/api/categories/equivalences/${categorie}`).then(response => response.json());

    for (const selecteur of selecteursCategories) selecteur.checked = equivalencesCategorie.includes(selecteur.id);
}

async function modifier_equivalences(id_formulaire) {
    const formulaire = document.getElementById(id_formulaire);
    const categorie = document.getElementById("formulaire-categorie-equivalences").textContent;
    const elementListeCategories = document.getElementById("liste-categories");
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