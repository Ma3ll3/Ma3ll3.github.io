function toggleMode() {
    // Sélectionne le corps du document
    var body = document.body;
    // Bascule entre les classes pour changer le style
    body.classList.toggle("night-mode");
    // Vous pouvez également stocker l'état actuel dans localStorage
    var isNightMode = body.classList.contains("night-mode");
    localStorage.setItem("nightMode", isNightMode);
}

// Vérifie s'il y a un état de mode nuit stocké en local storage
var savedNightMode = localStorage.getItem("nightMode");
if (savedNightMode === "true") {
    // Si le mode nuit est activé, applique la classe correspondante
    document.body.classList.add("night-mode");
    // Coche le bouton de commutation
    document.getElementById("toggleSwitch").checked = true;
}