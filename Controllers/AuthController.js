import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
//import jwt from 'jsonwebtoken';

/*  
    este controler se encargra de procesar los regitros e inicios de 
    sesion de cada usuario, y se regira por el modelo de usurio ya 
    determinado en el userModel
*/


//----------------Regitering a new user------------\\

export const registerUser = async(req, res) =>{

    //aqui vamos a encriptar el password con bcrypt
    //salt es algo asi como la cantidad de capas hash con la que se envolver el password
    //en este caso un 10 esta bien
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass
    //creando un nuevo usuario que extiende de la clase UserModel
    const newUser = new UserModel(req.body);
    const{username} = req.body;

    //200 y 500 son status predefinidos
    //por lo demas un tipico try catch donde si la consulta no sale bien
    //se catchea el error
    try {

        //verificando que ese nombre de usuario no este registrado
        const oldUser = await UserModel.findOne({username});
        if(oldUser){
            return res.status(400).json("El nombre de usuario ya esta registrado");
        }
        //guardando al user en la BBDD(mongodb) - si todo sale bien devuelve el json con el user
        const user = await newUser.save();

        //aqui estamos generando un token para el user que se acaba de registrar
        // const token = jwt.sign({
        //     username: user.username, id: user._id
        // }, process.env.JWT_KEY, {expiresIn: '1h'});

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
;}

//--------------LOGIN USER-----------------\\

export const loginUser = async(req, res) => {

    const {username, password} = req.body;

    try {
        //buscando por username, si encuentra al usuario
        //se alamacena en user toda la informacion del user
        const user = await UserModel.findOne({username: username});

        if(user){
            //compara que la password que introdujo el user es igual a la
            //de la BBDD y devuelve un boolean
            const validity = await bcrypt.compare(password, user.password);

            if(!validity){
                res.status(400).json("Contraseña incorrecta");
            }
            else{
                // const token = jwt.sign({
                //     username: user.username, id: user._id
                // }, process.env.JWT_KEY, {expiresIn: '1h'});

                res.status(200).json({user});
            }
        }else{
            res.status(404).json("El usuario no existe");
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
