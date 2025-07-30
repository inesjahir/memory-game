"use strict";

const game = {
  level: 0, //: le niveau courant, initialisé à 0
  sequence: [], //le tableau mélangé des nombres de la séquence,
  step: 0, //le bon nombre qui doit être choisi à ce stade du jeu par le joueur
};

const bouton = document.getElementById("btn"); //  Je récupère le bouton pour démarrer la partie
const div = document.getElementById("game"); // Je récupère la div
const span = document.getElementById("level");
const bouton_restart = document.getElementById("btn-restart");
const bouton_suivant = document.getElementById("btn-suivant");
const div1 = document.getElementById("sequence");

function init() {
  bouton.addEventListener("click", startGame);
}

function startGame() {
  bouton.classList.add("hidden");
  /* je veux ajouter la classe hidden a mon bouton en recuperant la classe grace a classlist*/

  if (game.level === 0) {
    game.level = 4; // ✅ Ne réinitialise le niveau qu'au premier démarrage
  }

  div.classList.remove("hidden");
  span.textContent = game.level;

  for (let i = 1; i <= game.level; i++) {
    game.sequence.push(i);
  }
  //pour chaque element en partant de 0 jusque la taille de mon jeux(level) je rajoute tout dans mon tableau

  //étape ou il faut melanger le tableau
  //(() => ) : fonction fléchée
  game.sequence.sort(() => Math.random() - 0.5); // On va m"langer cette liste

  game.sequence.forEach((bouton) => {
    const bouton1 = document.createElement("button"); // Je crée un bouton
    bouton1.classList.add("style");
    bouton1.textContent = bouton; // Je met comme texte au ce bouton que je viens de créer  le numéro dans la liste

    div1.append(bouton1); // Je rajoute le bouton dans la div
  });

  setTimeout(hideSequence, game.level * 1000);
  //executer la fonction hideSequence après 1000 millisecondes donc 1 secondes
  //set timout permet d'éxecuter une fonction après un laps de temps .
  // setTimeout(nomDeLaFonction, délaiEnMillisecondes);
}

function hideSequence() {
  const btns = document.querySelectorAll("#sequence button"); //selectionner tout les boutons qui se trouve dans la balise div et qui a comme id sequence
  // Voici le résultat : [bouton1 , bouton2 , bouton 3 , bouton 4 ]

  btns.forEach((bouton) => {
    // Pour chaque bouton dans ma liste je  :
    //je vais assigner le contenu texte de mon bouton donc le nombre  à la valeur dataset (varaible temporaire pour stocker des trucs) de mon bouton actuel afin qu'il puisse stocker son numéro
    bouton.dataset.value = bouton.textContent;

    bouton.textContent = "X"; // Je remplace chaque texte du bouton par X
    game.step = 1; //c’est le nombre 1 que le joueur doit trouver en premier.

    bouton.addEventListener("click", function guess(event) {
      //event = enregistre tout ce que je fait afin que la fonction sache sur quel bouton on a cliqué
      //.target est un propriété de l'event

      // Récupérer l'élément cliqué.
      const cardElem = event.target;

      const value = parseInt(cardElem.dataset.value);
      //ennregistrer la valeur du dataset dans une varaible value que l'on convertis en int car de base en string

      // Récupérer dans la page, tous les boutons de la séquence. donc les enfants de la div
      const cards = document.getElementById("sequence").children;
      // Mettre ces boutons dans un tableau et rechercher la position de celui qui a été cliqué.
      const i = Array.from(cards).indexOf(cardElem);
      /*
    <button>1</button>
    <button>2</button>
    <button>3</button>


    Array.from(cards) d'abord on Transforme tout en liste → [button1, button2, button3]
    .indexOf(cardElem) Ensuite on Trouve l'indexw du bouton sur lequel on a cliquer  → 1 (car button2 est à l'index 1 dans le tableau)
    indew of ( ..) veut dire je veux trouver l'index de l'élément entre parenthèses

    */
      if (value === game.step) {
        cardElem.classList.add("vert");
        cardElem.textContent = value;
        game.step++;
        cardElem.disabled = true;

        if (game.step > cards.length) {
          levelCompleted();
        }
      } else {
        cardElem.classList.add("rouge");
        cardElem.textContent = value;

        cardElem.disabled = true;

        // ✅ Afficher le bouton restart immédiatement après une erreur
        bouton_restart.classList.remove("hidden");
        bouton_restart.addEventListener("click", gameOver);
      }
    });
  });
}

function levelCompleted() {
  bouton_suivant.classList.remove("hidden");

  // ✅ Ajoute l'événement qui s'exécute UNE SEULE FOIS
  bouton_suivant.onmouseover = function () {
    game.level++;
    console.log(game.level);
    game.sequence = []; // Réinitialiser la séquence
    game.step = 0; // Réinitialiser la progression du joueur

    // ✅ Supprimer les anciens boutons ,  donc supprimer tout le contenu de la div
    document.getElementById("sequence").innerHTML = "";

    // ✅ Cacher le bouton suivant
    bouton_suivant.classList.add("hidden");

    // ✅ Relancer le jeu avec le niveau mis à jour
    startGame();
  }; // ✅ L'événement ne s'exécutera qu'une seule fois
}

function gameOver() {
  // ✅ 1. Réinitialiser toutes les valeurs du jeu
  game.sequence = []; // Vide le tableau de la séquence
  game.step = 0; // Remettre step à 0

  // ✅ 2. Supprimer les boutons affichés dans #sequence
  document.getElementById("sequence").innerHTML = "";

  // ✅ 3. Cacher le bouton restart
  bouton_restart.classList.add("hidden");

  // ✅ 4. Relancer le jeu
  startGame();
}

hideSequence();
init(); 