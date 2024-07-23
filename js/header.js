let nav = document.querySelector('nav');
let allLi = nav.querySelectorAll('li a');

// Sélectionnez les sections et les liens à modifier
const sections = [
    document.querySelector('#accueil'),
    document.querySelector('#a-propos'),
    document.querySelector('#realisations'),
    document.querySelector('#contact')
];

window.addEventListener('scroll', () => {
    // Obtenez les coordonnées de la fenêtre
    const scrollPosition = window.scrollY;

    // Parcourez les sections pour trouver la première section visible
    let visibleSectionIndex = 0;
    for (let i = 0; i < sections.length; i++) {
        const rect = sections[i].getBoundingClientRect();
        if (rect.top <= 300) {
            visibleSectionIndex = i;
        }
    }

    // Supprimez la classe "onscreen" de tous les liens
    for (let i = 0; i < allLi.length; i++) {
        allLi[i].classList.remove('onscreen');
    }

    // Ajoutez la classe "onscreen" au lien correspondant à la section visible
    allLi[visibleSectionIndex].classList.add('onscreen');
});

// En version mobile, fait apparaître le menu burger
function toggleMenu() {
    var nav = document.querySelector('header');
    nav.classList.toggle('active');
}