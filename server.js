import express from 'express';

const app = express();

app.get('/', (req, res) =>{
    res.send ("bienvenu a l'application de recette en ligne.")
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port http://localhost:${PORT}`);
});
