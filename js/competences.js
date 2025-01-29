// premier mads
let mads = document.querySelector(".mads");
let madsOther = document.querySelector(".competences-details");
let pbk = 970;



// pour avoir la largeur de la fenêtre, et donc vérifier si c'est une version Desktop ou Mobile même lorsque l'utilisateur change la largeur de la fenêtre
let screenWidth = window.innerWidth;
window.addEventListener("resize", (event) => {
    screenWidth = window.innerWidth;
})

// sur la version Mobile, permettre ou non de pouvoir ouvrir plusieurs onglets en même temps
let notCloseOther = document.getElementById("mads-notclosedother");
let yesCloseOther = document.getElementById("mads-closedother");
notCloseOther.addEventListener('click', function (){
    notCloseOther.checked = true;
})
yesCloseOther.addEventListener('click', function (){
    yesCloseOther.checked = true;
})
let mobileCloseOther = false;

// pour faire un mads (càd un onglet/accordéon)
class MADS {
    constructor(chemin, pointbreak) {
        //chemin qui renvoie à l'emplacement où chercher le button de l'accordéon
        this.chemin = chemin;
        this.pointbreak = pointbreak;
        this.button = this.chemin.querySelector('button[aria-expanded]');
        let controls = this.button.getAttribute('aria-controls');
        this.content = document.getElementById(controls);
        this.listLi = document.querySelectorAll('.mads li');
        this.containerContent = document.querySelector(".competences-details");
        // this.open permet de déterminer si un accordéon est ouvert ou non
        this.open = this.button.getAttribute('aria-expanded') === 'true';
        // Détermine quel onglet est ouvert en premier en version Desktop
        let madsopen = this.open;
    
        // sur desktop, il y a un onglet ouvert d'office, donc sur mobile, si au chargement de la page il y en a un, on le ferme
        addEventListener('load', (event) => {
            if (screenWidth < this.pointbreak && this.open)  {
                    this.closed();
            }
        });
        // idem si on change la taille de la fenêtre
        window.addEventListener("resize", (event) => {
            //ferme tous les onglets
            if(this.open){
                this.closed();
            }
            // ouvre l'onglet à ouvrir en version Desktop
            if(screenWidth >= this.pointbreak && madsopen === true){
                this.opened();
            }
        });
        

        this.button.addEventListener('click', this.onButtonClick.bind(this));
    }

    onButtonClick() {
        // on ne peut pas fermer un accordeon si on est sur desktop
        let divmads = this.chemin.parentElement;
        if (screenWidth >= this.pointbreak) {
            // si l'accordeon est déjà ouvert et que c'est le seul ouvert, on ne fait rien
            if (this.open && divmads.parentElement.querySelectorAll('button[aria-expanded="true"]').length === 1) {
                return;
            }
        } else {
            // si l'accordeon est déjà ouvert, on peut le fermer
            if (this.open) {
                this.closed();
                return;
            }
        }

        // si l'accordeon n'est pas ouvert, on l'ouvre
        if (!this.open) {
            this.opened();
            return;
        }

        //si l'accordeon est ouvert et qu'il y en a d'autres ouverts, on le ferme
        if (this.open && divmads.parentElement.querySelectorAll('button[aria-expanded="true"]').length > 1) {
            this.closed();
            return;
        }
    }

    // ouvre un accordeon
    opened() {
        this.content.removeAttribute('hidden');
        // partie importante pour l'accessibilité
        this.button.setAttribute('aria-expanded', true);
        this.open = true;

        // si on est sur mobile
        if (screenWidth < this.pointbreak) {
            // this.button.insertAdjacentElement("afterend", this.content);
            this.chemin.parentNode.insertBefore(this.content, this.chemin.nextSibling);
        }
    }

    // ferme un accordeon
    closed() {
        this.content.setAttribute('hidden', '');
        // partie importante pour l'accessibilité
        this.button.setAttribute('aria-expanded', false);
        this.open = false;

        // si on est sur mobile
        if (screenWidth < this.pointbreak) {
            this.containerContent.appendChild(this.content);
        }
    }

    // pour éviter d'avoir deux accordéons ouverts en même temps
    // si un accordeon est ouvert quand on ouvre un autre, on le ferme.
    closeOther() {
        if (this.open === true) {
            this.closed();
            return;
        }
    }
}

// pour faire l'ensemble des mads (càd le composant) 
class sectionMads {
    constructor(section, pointbreak) {
        this.section = section; //renvoie au conteneur du composant
        this.pointbreak = pointbreak; //point de rupture entre l'accordéon et le sommaire
        this.mads = this.section.querySelectorAll('li');
        this.instances = []; //contient tous les mads
        window.addEventListener("load", (event) => {
            if (screenWidth >= this.pointbreak){ //on remplace pbk par la variable de pointbreak
                this.HeightSummary(screenWidth); //on remplace test par le nom du nouveau sectionMads
            }
        })
        window.addEventListener("resize", (event) => {
            this.HeightSummary(screenWidth);
        })
        this.initMads();
    }

    // initialisation du composant MADS
    initMads(){
        let instancesAll = []; //contient tous les mads ET est lisible dans un addEventListener
        for (let i = 0; i < this.mads.length; i++) {
            // on crée les mads
            const instance = new MADS(this.mads[i], this.pointbreak);
            instancesAll.push(instance);
            this.instances.push(instance);
            let pointbreak = this.pointbreak; //pour être lu dans un addEventListener
            //on fait appel à closeOther() pour chaque clic sur un onglet (on ferme ceux qui ne sont pas l'onglet cliqué)
            instance.button.addEventListener('click', function () {
                if (notCloseOther.checked === true) {mobileCloseOther = false;}
                if (yesCloseOther.checked === true) {mobileCloseOther = true;}
                for (let j = 0; j < instancesAll.length; j++) {
                    if (j !== i && screenWidth >= pointbreak) {
                        instancesAll[j].closeOther();
                    }
                    // si mobileCloseOther === true, sur la version mobile, on ne peut ouvrir plusieurs onglets en même temps
                    if (j !== i && screenWidth < pointbreak && mobileCloseOther === true) {
                        instancesAll[j].closeOther();
                    }
                }
            });
        }
    }

    // Pour régler la hauteur du "sommaire"
    HeightSummary(tailleEcran){
        // Comme les button dans les h3 sont en position:absolute, si le contenu d'un accordéon est plus petit que la colonne avec les button, la section est alors plus petite que la colonne des button qui dépassent.
        let h3s = this.section.querySelectorAll('h3 button');
        // on initialise la hauteur totale à 0
        let totalHeight = 0;
        h3s.forEach((button) => {
            // pour que les h3 en position absolute se place bien mais seulement en Desktop
            if (tailleEcran >= this.pointbreak){
                let top = totalHeight;
                button.style.top = top + "px";
            } else{
                button.style.top = 0;
            }    
            // on calcule la hauteur de chaque élément button qu'on additionne et ajoute à la hauteur totale
            const h3Height = button.offsetHeight;
            totalHeight += h3Height;
        });
        // si il existe les flèches
        // on prend le même principe pour que les arrows soient en-dessous avec un même espacement
        if(this.madsArrow != null){this.madsArrow.style.top = totalHeight + "px";}
        // on rajoute cette hauteur au mads en mettant comme hauteur minimale, et la height en auto (en css), pour qu'elle puisse tout de même changer, sans être plus petit que ce que l'on veut
        // cet effet ne s'appliquera que pour la version desktop
        if (tailleEcran >= this.pointbreak) {
            // on rajoute un espace de 50px en plus pour l'aspect graphique
            totalHeight += 50;
            this.section.style.minHeight = `${totalHeight}px`;
        } else {
            this.section.style.minHeight = 'auto';
        }
    }
}

let test = new sectionMads(mads, pbk);
