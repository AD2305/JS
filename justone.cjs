/*
question spécific -> mdn
module js -> npm
*/


const fs = require('fs').promises;

async function fichier(text) {
    try {
      await fs.appendFile('reponse.txt', text);
      
    } catch (err) {
      console.error('Erreur lors de l\'écriture du fichier :', err);
    }
  }

async function choix_carte(file) {
    try {
        const data = await fs.readFile(file, 'utf8'); // Lire le fichier de manière asynchrone
        const mots = data.split('\n').map(mot => mot.trim()); // Diviser les lignes et nettoyer les espaces
        return mots;
    } catch (err) {
        console.error('Erreur lors de la lecture du fichier:', err);
        return []; // Retourne un tableau vide en cas d'erreur
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
    const nb = await new Promise((resolve) => {
        rl.question('Nombre de joueur :', (answer) => {
            resolve(answer);
        });
    });
    for (let i = 1; i <= nb; i++) {
        let nom = await new Promise((resolve) => {
            rl.question(`Joueur ${i} :`, (answer) => {
                resolve(answer);
            });
        });
        joueur.push(nom);
    }
    
    return joueur
}


//Choix des cartes
var set={"cartes":[]}
var carte_a_jouer = []
for (let i=0 ;i<13 ;i++){
    carte_a_jouer=carte_a_jouer+[set.cartes[Math.floor(Math.random() * set.cartes.length)]]
}



//Indice

async function indice(joueur, joueur_actif){
    let indices=[]
    for (let i=0; i<joueur.length; i++){
        if (i!=joueur_actif){
            console.log(joueur[i])
            let ind=await new Promise((resolve) => {
                rl.question('Votre indice : ', (answer) => {
                    resolve(answer);
                });
            })
            indices.push(ind)
        }
    }
    
    return indices
}



async function validation_indice(mot1,mot2){

    //Homonyme
    const response2 = await fetch(`https://api.datamuse.com/words?rel_hom=${mot1}`);
    const data2 = await response2.json();
    const homonyme= data2.map(entry => entry.word);

    //Même famille
    const response3 = await fetch(`https://api.datamuse.com/words?sp=${mot1}`);
    const data3 = await response3.json();
    const famille= data3.map(entry => entry.word);

    return  homonyme.includes(mot2) || famille.includes(mot2);
}




//Affichage indice 
function affichage_indice(indice,mot_a_deviner){
    let indice_affiche=[]
    for (let i=0; i<indice.length; i++){
        let in_indice=1
        if (!validation_indice(indice[i],mot_a_deviner)){
            for (let j=0; j<indice.length; j++){
                if (validation_indice(indice[i],indice[j]) && indice[i]!=indice[j]){
                    in_indice=0
                }
            }
        }else{in_indice=0}
        if (in_indice==0){
            indice_affiche.push(indice[i])
        }
    }

    for(let i=0; i<40; i++){console.log("\n")}
    
    if (indice_affiche.length==0){
        console.log("Pas d'indice")
    } else {
        for (let i=0;i<indice_affiche.length;i++){
            console.log(`Indice ${i+1} : ${indice_affiche[i]}\n`)
        }
    }
}


async function reponses(mot_a_deviner,score,tour){
    let reponse= await new Promise((resolve) => {
        rl.question('Votre réponse : ', (answer) => {
            resolve(answer);
        });
    })
    mot_normalise=mot_a_deviner.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    reponse = reponse.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    fichier( reponse+'\n');
    if (reponse==mot_normalise){
        console.log("Bravo, vous avez trouvé(e) !!!!!!")
        score+=1
    }else{
        console.log(`Wrong!!!!!!!!!!!\nLe mot à deviner était ${mot_a_deviner}`)
        if(tour==13 && score!=0){score =score-1}
    }
    return score
}




function fin_jeu(score){
    if (score==13){
        console.log(`Score : ${score} \nScore parfait ! Y arriverez-vous encore ?`)
    }
    if (score==12){
        console.log(`Score : ${score} \nIncroyable ! Vos amis doivent être impressionnés !`)
    }
    if (score==11){
        console.log(`Score : ${score} \nGénial ! C'est un score qui se fête !`)
    }
    if (score==10 || score==9){
        console.log(`Score : ${score} \nWaouh, pas mal du tout !`)
    }
    if (score==8 || score==7){
        console.log(`Score : ${score} \nVous êtes dans la moyenne.Arriverez-vous à faire mieux ?`)
    }
    if (score > 3 && score <= 6){
        console.log(`Score : ${score} \nC'est un bon début. Réessayez !`)
    }else{
        console.log(`Score : ${score} \nEssayez encore.`)
    }
}

















async function main(){
    fs.writeFile('reponse.txt', '');
    let carte= await choix_carte('mots.txt')
    let joueur=await create_joueur()
    let score=0
    let mot_a_deviner=""
    let mot_deja_devine=[]

    let n=joueur.length
    let joueur_actif=Math.floor(Math.random() * n) + 1

    console.log(`Le premier joueur actif est le joueur ${joueur[joueur_actif]}`)

    for (i=0;i<3;i++){
        do{
            mot_a_deviner=carte[Math.floor(Math.random() *carte.length) + 1]
        }while (mot_a_deviner in mot_deja_devine)
        mot_deja_devine.push(mot_a_deviner)
        console.log(`Le mot à deviner est : ${mot_a_deviner}`)

        let ind=await indice(joueur,joueur_actif)
        affichage_indice(ind, mot_a_deviner)
        score=await reponses(mot_a_deviner,score,i)

    }

    fin_jeu()
    return
}


console.log(main())
