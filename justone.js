const fs = require('fs').promises;

async function fichier(text) {
    try {
      await fs.writeFile('reponse.txt', text);
      console.log('Fichier écrit avec succès !');
    } catch (err) {
      console.error('Erreur lors de l\'écriture du fichier :', err);
    }
  }


const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});










// Joueurs
async function create_joueur(){
    let joueur=[]
    const nb = await rl.question("Nombre de joueur : ")
    for(let i=1; i<nb;i++){
        joueur=joueur+[await rl.question("Joueur ${i} : ")]
    }
    rl.close()
    return joueur
}

//Choix 1er joueur

let n=joueur.lenght
let joueur_actif=Math.floor(Math.random() * n) + 1
let mot_a_deviner=Math.floor(Math.random() * 7) + 1

//Choix des cartes
var set={"cartes":[]}
var carte_a_jouer = []
for (let i=0 ;i<13 ;i++){
    carte_a_jouer=carte_a_jouer+[set.cartes[Math.floor(Math.random() * set.cartes.length)]]
}



//Indice

async function indice(joueur, joueur_actif){
    let indices=[]
    for (let i=0; i<joueur.lenght; i++){
        if (i!=joueur_actif){
            console.log(joueur[i])
            indices=indices+[await rl.question("Indice :")]
        }
    }
    rl.close()
    return indices
}



async function validation_indice(mot1,mot2){
    //Synonyme
    const response = await fetch(`https://api.datamuse.com/words?rel_syn=${mot1}`);
    const data = await response.json();
    const synonyms = data.map(entry => entry.word);

    //Homonyme
    const response2 = await fetch(`https://api.datamuse.com/words?rel_hom=${mot1}`);
    const data2 = await response2.json();
    const homonyme= data2.map(entry => entry.word);

    //Même famille
    const response3 = await fetch(`https://api.datamuse.com/words?sp=${mot1}`);
    const data3 = await response3.json();
    const famille= data3.map(entry => entry.word);

    return synonyms.includes(mot2) && homonyme.includes(mot2) && famille.include(mot2);
}




//Affichage indice ++++++++++++++++++++++++++++++ modifier pour enlever synonyme
function affichage_indice(indice){
    let indice_affiche=[]
    for (let i of indice){
        let in_indice=True
        if (!validation_indice(i,mot_a_deviner)){
            for (let j of indice){
                if (validation_indice(i,mot_a_deviner)){
                    in_indice=False
                }
            }
        }else{in_indice=False}
        if (in_indice){
            indice_affiche+=[i]
        }
    }
    if (indice_affiche.length==0){
        console.log("Pas d'indice")
    } else {
        for (let i=0;i<indice_affiche.length;i++){
            console.log('Indice ${i} : ${indice_affiche[i]}\n')
        }
    }
}


async function reponses(mot_a_deviner,score,tour){
    let reponse= await rl.question("Votre réponse : ")
    fichier( reponse+'\n');
    if (reponse==mot_a_deviner){
        console.log("Bravo, vous avez trouvé(e) !!!!!!")
        score+=1
    }else{
        console.log("Wrong!!!!!!!!!!!")
        if(tour==13){score =score-1}
    }
    return score
}




function fin_jeu(score){
    if (score==13){
        console.log("Score parfait ! Y arriverez-vous encore ?")
    }
    if (score==12){
        console.log("Incroyable ! Vos amis doivent être impressionnés !")
    }
    if (score==11){
        console.log("Génial ! C'est un score qui se fête !")
    }
    if (score==10 || score==9){
        console.log("Waouh, pas mal du tout !")
    }
    if (score==8 || score==7){
        console.log("Vous êtes dans la moyenne.Arriverez-vous à faire mieux ?")
    }
    if (3<score<=6){
        console.log("C'est un bon début. Réessayez !")
    }
    if (score<=3){
        console.log("Essayer encore.")
    }
}

















function main(){
    joueur=create_joueur()

    let n=joueur.lenght
    let joueur_actif=Math.floor(Math.random() * n) + 1

    console.log("Le premier joueur actif est le joueur ${joueur[joueur_actif]}")

    for (i=0;i<13;i++){
        let mot_a_deviner=Math.floor(Math.random() * 7) + 1
        console.log("Le mot à deviner est : ${mot_a_deviner}")

        let indice=indice(joueur,joueur_actif)
        affichage_indice(indice)
    }


    fin_jeu()
}
