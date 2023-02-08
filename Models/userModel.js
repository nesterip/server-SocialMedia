import mongoose from "mongoose";

//esquema o modelo del usuario
//aqui vamos a declarar todas las variables en forma de objetos donde almacenaremos los
//distintos tipos de datos del usuario
//ademas de que esta heredando de mongoose todos los metodos necesarios para
//trabajar la BBDD
const UserSchema = mongoose.Schema(
    {   
        //siempre hay que especificar el tipo de dato que almacenara
        //y en este caso required: true, porque seran obligatorias
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        },//en estas de aca solo declaramos que seran de tipo string, pero no son obligatorias
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesIn: String,
        workAt: String,
        relationship: String,
        followers: [],
        following:[],
    },
    {timestamps: true}//marcas de tiempo
)

//con esta linea estamos pandole al model, el nombre que recibira la lista en mongooseDB y
//UserSchema seria la estructura que tendra
const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;