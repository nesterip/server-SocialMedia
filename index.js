import express from "express";
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';
import ChatRoute from './Routes/chatRoute.js';
import MessageRoute from './Routes/MessageRoute.js';

//Routes

const app = express();

//para servidor de imagenes local carpeta public
//esto es necesario para poder jalar las imagenes de los posts
app.use(express.static('public'));
app.use('/images', express.static('images'));

//Middleware
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

/*cors es  necesario para que podamos hacer pruebas en local
    ya que estamos cruzando los datos del puerto 3000 al 5000
    y sin el cors nos daria error, pero esto no seria necesario para correr
    ya subida en internet de manera final */
app.use(cors());

//con esto conectamos con el .env donde tenemos 2 constantes
//necesarias par la coneccion con mongo
dotenv.config();

mongoose.set('strictQuery', false);

//-----------informacion usada en .env (MONGO_DB)----------//
//recordar que colocar la contraseña del cluster en mongodb= :(hola.123)@
//tambien poner el nombre del proyecto despues de .net/ y antes de ?
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(process.env.PORT, () => console.log(`listening at port ${5000}`)))
.catch((error) => console.log(error));



//aqui estamos conectando con el AuthRoute para hacer el manejo de las rutas
//de autentificacion
//cuando el front este en /auth se estara enrutando con AuthRoute.js

//------usage of routes-------\\
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);
