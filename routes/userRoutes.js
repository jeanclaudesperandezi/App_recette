import express from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser } from "../Controllers/userController.js";

const router = express.Router();

// Enregistrement d'un utilisateur
router.post("/register", registerUser);

// Connexion d'un utilisateur
router.post("/login", loginUser);

// Déconnexion d'un utilisateur
router.post("/logout", logoutUser);

// Récupération de l'utilisateur connecté
router.get("/me", getCurrentUser);

export default router;
