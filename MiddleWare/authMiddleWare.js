//import jwt from 'jsonwebtoken';

//en el lado del server para poder usar el procces.env es necesario importarlo
//import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_KEY;

//logica para controlar los toens y la autenticacion del usuario
//para controla cuendo termina la sesion del user
//ademas de que para poder hacer ciertas peticiones al server es necesario
//pasar la verificacion de que estamos logueados
const authMiddleWare = async(req, res, next) => {

    try {

        //tomamos el token desde el encbezado de nuestra solicitud
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        if(token){
            //aca estamos verificando el token, de que coincidan los datos del frond con el back
            //si es asi codificara al user para mas seguridad
            const decoded = jwt.verify(token, secret);
            console.log(decoded);
            //el _id del body lo cambiaremos por el id codificado
            req.body._id = decoded?.id;
        }

        //necesario
        next();
    } catch (error) {
        console.log(error);
    }
}

//export default authMiddleWare;