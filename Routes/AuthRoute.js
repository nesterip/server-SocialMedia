import express from "express";
import { loginUser, registerUser } from "../Controllers/AuthController.js";

const router = express.Router();

//conectando el controller con la ruta indicada para hacer 
//el post del nuevo usuario
//esto quiere decir que todos losparametros que obtenga de /register se los pasara
//al controller
router.post('/register', registerUser);

//enrutando con la logica del /login
router.post('/login', loginUser);

export default router;
