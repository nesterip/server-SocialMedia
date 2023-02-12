import express from "express";
import { deleteUser, followUser, getUser, unFollowUser, updateUser, getAllUsers } from "../Controllers/UserController.js";
//import authMiddleWare from "../MiddleWare/authMiddleWare.js";

const router = express.Router();

//para poder realizar alguns consultas es necesario
//que la verificacion del authMiddleWare sea correcta

//get all users
router.get('/', getAllUsers);

//llamada desde el front, recibimos el id por parametro
//y conectamos con getUser que se encarga de hacer la solicitud al servidor
router.get('/:id', getUser);

//Update de informacion del user
//router.put('/:id',authMiddleWare, updateUser);
router.put('/:id', updateUser);

//delete user
router.delete('/:id', deleteUser);

//follow user
router.put('/:id/follow', followUser);

//UnFollow user
router.put('/:id/unfollow', unFollowUser);

export default router;