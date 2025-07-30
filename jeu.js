"use strict";
const game = {
  level: 0,
  sequence: [],
  step: 0,
};

const zoneBoutons = document.getElementById("zone-boutons");

// Création dynamique du bouton "Niveau Suivant"
const bouton_suivant = document.createElement("button");
bouton_suivant.id = "suivant";
bouton_suivant.textContent = "Niveau Suivant";
bouton_suivant.classList.add("hidden"); // Caché au début
zoneBoutons.appendChild(bouton_suivant);
// Création dynamique du bouton "Recommencer"
const bouton_restart = document.createElement("button");
bouton_restart.id = "restart";
bouton_restart.textContent = "Recommencer";
bouton_restart.classList.add("hidden"); // Caché au début
zoneBoutons.appendChild(bouton_restart);
function shuffle(a) {
  // fonction qui va melanger les elements du tableau

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // va prendre un indice au hazard
    [a[i], a[j]] = [a[j], a[i]]; // Échange les éléments en position i et j
  }
  return a;
}

// creation des boutons avec les nbr dans l'ordre du tableau melangé + les ajouter dans la division sequence
function createButton() {
  let bouton_nombre = document.getElementById("sequence"); // Récupère la div où ajouter les boutons
  for (let i of game.sequence) {
    let bouton = document.createElement("button"); // pour cree un bouton
    bouton.textContent = i;
    bouton.dataset.value = i; //Stocke la valeur correcte dans dataset
    bouton.classList.add("bouton_jeu");
    bouton_nombre.appendChild(bouton);
  }
}

function startGame() {
  document.getElementById("sequence").innerHTML = ""; // Efface les anciens boutons

  // Seulement si le niveau est encore à 0 (premier démarrage)
  if (game.level === 0) {
    game.level = 1; // initialiser le niveau a 4
  }
  let niveau = document.getElementById("level");
  niveau.textContent = game.level; // pour mettre le niveau a 4

  document.getElementById("game").classList.remove("hidden"); // Affiche le niveau (on enleve le hidden)

  document.getElementById("demarrer").classList.add("hidden");
  document.getElementById("img1").classList.add("hidden");
  document.getElementById("img2").classList.add("hidden");
  document.getElementById("regles").classList.add("hidden");



  game.sequence = []; // Vide la séquence précédente

  // cree un tableau (game.sequence) de 1 a la taille du jeu , et le mélanger
  // avec une boucle for je vais cree un tableau
  for (let i = 1; i <= game.level; i++) {
    game.sequence.push(i);
  }
  shuffle(game.sequence);
  createButton();
  setTimeout(hideSequence, game.level * 500); // invique le 1e argument apres le delais (en milisecondes)
}

function init() {
  /*fonction qui fait tout ce qui doit etre fait au démarrage*/
  document.getElementById("demarrer").addEventListener("click", startGame);
}
init(); // appel de la fontion
// fonction qui va parcourir les boutons et remplacer le texte par une coix
function hideSequence() {
  let croix = document.querySelectorAll(".bouton_jeu"); // va prendre tt les elements qui ont la classe bouton_jeu

  //prend chaque element croix et le met dans element_liste
  // qu'on a cree temporairement pour representer 1 element de la liste a chaque tour
  croix.forEach((element_liste) => {
    element_liste.dataset.value = element_liste.textContent; // Stocke la valeur correcte

    // va prendre tt les elements qui ont la classe bouton_jeu
    element_liste.textContent = "X";
    element_liste.addEventListener("click", guess); // pour chaque element on appel la fonction quand on clique dessus
  });
  game.step = 1; // on initialise a 1 psq c'est le premier chiffre qu'on doit trouver
}

function guess(event) {
  // Récupérer l'élément cliqué.
  const cardElem = event.target;
  const value = parseInt(cardElem.dataset.value); // Récupère la valeur cachée du bouton
  // Récupérer dans la page, tous les boutons de la séquence.
  const cards = document.getElementById("sequence").children;
  // Mettre ces boutons dans un tableau et rechercher la position de celui qui a été cliqué.
  const i = Array.from(cards).indexOf(cardElem);

  if (value === game.step) {
    // si le num qu'on a cliqué dessus est le bon
    cardElem.classList.add("bouton_vert"); // on ajoute une class pour qu'on puisse mettre le bouton en vert
    cardElem.textContent = value; // reafficher la valeure de la carte
    if (game.step < game.sequence.length) {
      game.step++; // si on est pas au bout de la taille de la sequence, on incrémente
    } else {
      levelCompleted();
    }
  } else {
    cardElem.classList.add("bouton_rouge");
    gameOver();
  }
}

function levelCompleted() {
  bouton_suivant.classList.remove("hidden");

  // Ajoute l'événement qui s'exécute UNE SEULE FOIS
  bouton_suivant.onclick = function () {
    game.level++;
    console.log(game.level);
    game.sequence = []; // Réinitialiser la séquence
    game.step = 0; // Réinitialiser la progression du joueur

    //Supprimer les anciens boutons ,  donc supprimer tout le contenu de la div
    document.getElementById("sequence").innerHTML = "";

    // Cacher le bouton suivant
    bouton_suivant.classList.add("hidden");

    // Relancer le jeu avec le niveau mis à jour
    startGame();
  }; // L'événement ne s'exécutera qu'une seule fois
}

function gameOver() {
  // 1. Réinitialiser toutes les valeurs du jeu
  game.sequence = []; // Vide le tableau de la séquence
  game.step = 0; // Remettre step à 0

  // 2. Supprimer les boutons affichés dans #sequence
  document.getElementById("sequence").innerHTML = "";

  bouton_restart.classList.remove("hidden"); // Affiche le bouton "Recommencer"

  bouton_restart.onclick = function () {
    bouton_restart.classList.add("hidden"); // Cache le bouton après clic
    startGame(); // Redémarre le jeu
  };
}
