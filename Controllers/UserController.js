import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//get all users
//el find() no dara todos los usuarios sino solo los primeros 20
export const getAllUsers = async (req, res) => {
    try {
        let users = await UserModel.find();

        users =  users.map((user) => {
            const {password, ...otherDetails} = user._doc;
            return otherDetails;
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}


//req = solicitud o consulta - res = respuesta (en este caso desde el front)
export const getUser = async (req, res) => {
    //obteniendo el id del usuario para buscarlo en la BBDD
    //estos parametros vienen del front
    const id = req.params.id;
    
    try { //buscando en la BBDD al user por su id
        const user = await UserModel.findById(id);

        if(user){

            /*debido a que en esta respuesta estamos pasando el password
                y por razones de seguridad eso no esta bien, antes de
                pasar los datos del usuario, eliminamos la prodiedad password
                y luego si pasamos al informacion restante*/
            const {password, ...otherDetails} = user._doc;

            //al encontrar al user enviamos como respuesta el status 200 y
            //la informacion del user en formato json
            res.status(200).json(otherDetails);
        }
        else{
            res.status(404).json("El usuario no existe");
        }
    } catch (error) {
        res.status(500).json(error);
    }

}

export const updateUser = async (req, res) => {
    const id = req.params.id;
    
    
    //vamos a solicitar estos datos del usurio para hacer la actualizacion
    //las dos primeras variables pueden contener la misma informacion
    //la diferencia es que si porvienen del
    // UserId = el usuario es quien esta haciendo el update
    // UserAdmin = el administrador es quien esta haciendo el update
    //y el password para poder cifrarlo antes de enviarlo
    const { _id, currentUserAdmin, password } = req.body;
    
    if (id === _id) {
        try {
             //validando si se cambiara el password
            if (password) {
                //encriptando el password recibido antes de enviarlo
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            //findByIdAndUpdate: 
            //busca un user por su id
            //recibe los datos que se van a modificar(req.body)
            //new: true hace que las respuesta que devolvera sera el user con las modificaciones
            //new: false hace que la respuesta sean los datos anteriores, pero de igual
            //manera hara el update, solo que devolvera los datos antiguos
            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true,});

        const token = jwt.sign(
            { username: user.username, id: user._id }, process.env.JWT_KEY, { expiresIn: "1h" }
        );
    
        res.status(200).json({user, token});
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(403).json("Access Denied! You can update only your own Account.");
    }
};

//Delete User
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const {currentUserId, isAdmin} = req.body;
    
    //siempre hemos comparado que el id del params sea el mismo que el del current
    //porque sino entonces el current user podria pasar otro id y
    //en ese caso eliminar otro usuario
    if(currentUserId === id || isAdmin){
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("Usuario eliminado exitosmente");
        } catch (error) {
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Acceso denegado");
    }
}

//Follow a User
export const followUser = async (req, res) => {
    //id del user a quien queremos seguir
    const id = req.params.id;

    //id del current user
    const {_id} = req.body;

    //en este caso es distinto a los demos porque si bien en las otras
    //funciones el current user podia accionar solo sobre si mismo
    //aca es distinto ya que el mismo no puede seguirse
    if(_id === id){
        res.status(403).json("Accion restringida");
    }else{
        try {
            //user to follow
            const followUser = await UserModel.findById(id);
            //current user
            const followingUser = await UserModel.findById(_id);

            //verificamos que el current user no esta siguiendo a ese usuario
            if(!followUser.followers.includes(_id)){
                //agregamos al current user a la lista de seguidores del usuario a seguir
                await followUser.updateOne({$push: {followers: _id}});

                //agregamos en la lista de siguiendo del current user al nuevo user 
                await followingUser.updateOne({$push: {following: id}});
                res.status(200).json("Usuario seguido");
            }
            else{
                res.status(403).json("Ya sigues a este usuario");
            }


        } catch (error) {
            res.status(500).json(error);
        }
    }
}

//unFollow a User
export const unFollowUser = async (req, res) => {
    //id del user a quien queremos seguir
    const id = req.params.id;

    //id del current user
    const {_id} = req.body;

    //en este caso es distinto a los demos porque si bien en las otras
    //funciones el current user podia accionar solo sobre si mismo
    //aca es distinto ya que el mismo no puede seguirse
    if(_id === id){
        res.status(403).json("Accion restringida");
    }else{
        try {
            //user to follow
            const followUser = await UserModel.findById(id);
            //current user
            const followingUser = await UserModel.findById(_id);

            //verificamos que el current user esta siguiendo a ese usuario
            if(followUser.followers.includes(_id)){
                //agregamos al current user a la lista de seguidores del usuario a seguir
                await followUser.updateOne({$pull: {followers: _id}});

                //agregamos en la lista de siguiendo del current user al nuevo user 
                await followingUser.updateOne({$pull: {following: id}});
                res.status(200).json("Usuario deseguido");
            }
            else{
                res.status(403).json("No sigues a este usuario");
            }


        } catch (error) {
            res.status(500).json(error);
        }
    }
}