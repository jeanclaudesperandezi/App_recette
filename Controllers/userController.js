import bcrypt from "bcrypt"; // Import pour hachage des mots de passe
import prisma from "../prisma/prismaClient.js"; // Import du client Prisma

// Contrôleur pour enregistrer un utilisateur
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log(`Utilisateur ${user.username} enregistré avec succès`);
    res.status(201).json({ message: "Utilisateur enregistré", user });
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err.message);
    res.status(400).json({ error: "Utilisateur déjà existant ou données invalides" });
  }
};

// Contrôleur pour connecter un utilisateur
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Utilisateur introuvable pour l'email : ${email}`);
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Mot de passe incorrect pour l'email : ${email}`);
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Stockage de l'utilisateur dans la session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    console.log(`Connexion réussie pour : ${user.username}`);
    res.json({ message: "Connexion réussie", user: req.session.user });
  } catch (err) {
    console.error("Erreur interne :", err.message);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Contrôleur pour déconnecter un utilisateur
export const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err.message);
      return res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }

    res.clearCookie("connect.sid"); // Suppression du cookie
    console.log("Utilisateur déconnecté avec succès");
    res.json({ message: "Déconnexion réussie" });
  });
};

// Contrôleur pour récupérer l'utilisateur actuellement connecté
export const getCurrentUser = (req, res) => {
  if (!req.session.user) {
    console.log("Aucun utilisateur connecté");
    return res.status(401).json({ error: "Utilisateur non authentifié" });
  }

  console.log(`Utilisateur connecté : ${req.session.user.username}`);
  res.json(req.session.user);
};
