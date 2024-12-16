import express from "express";
import cors from "cors";
import session from "express-session";
import prisma from "./prisma/prismaClient.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour gérer les CORS
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// Middleware pour gérer les sessions
app.use(
  session({
    secret: "your-secret-key", // Changez ceci pour une clé plus complexe
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);

// Routes
app.use("/auth", userRoutes);

   // Se connecter à la base de données avec Prisma
   const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.log('Connexion à la base de données établie');
    } catch (error) {
        console.error('Erreur lors de la connexion à la base de donées:', error);
    }
}

connectToDatabase();

// Serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Le serveur tourne sur http://localhost:${PORT}`);
});
