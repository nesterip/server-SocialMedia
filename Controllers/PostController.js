import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

//Create a Post (POST a Post)
export const createPost = async(req, res) => {
    const newPost = new PostModel(req.body);

    try {
        await newPost.save();
        res.status(200).json(newPost);
    } catch (error) {
        res.status(500).json(error);
    }
}

//Get a Post
export const getPost = async(req, res) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
}

//Update a Post
export const updatePost = async(req, res) => {
    //id del post a modificar
    const postId = req.params.id;

    //id del user a quien pertenece el post
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        if(post.userId === userId){
            await post.updateOne({$set: req.body});
            res.status(200).json("Post actualizado");
        }
        else{
            res.status(403).json("Acceso denegado");
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

//DELETE a Post
export const deletePost = async(req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        if(post.userId === userId){
            await post.deleteOne();
            
            res.status(200).json("post eliminado");
        }else{
            res.status(403).json("Acceso denegado");
        }

    } catch (error) {
        res.status(500).json(error);
    }
}

//likes y deslike a post
export const likesPost = async(req, res) => {
    const postId = req.params.id;
    const {userId} = req.body;

    try {
        const post = await PostModel.findById(postId);
        //una vez encontrado el post comprobamos si ya el userId
        //esta en el array de los me gusta de no estar lo agregamos
        //y de ya estar pues lo quitamos
        if(!post.likes.includes(userId)){//-----like-----\\
            await post.updateOne({$push: {likes: userId}});
            res.status(200).json("has dado like al post");
        }
        else{                           //-----unlike-----\\
            await post.updateOne({$pull: {likes: userId}});
            res.status(200).json("has dado deslike al post");
        }


    } catch (error) {
        res.status(500).json(error);
    }
}

//GET timeline Post
//aqui vamos a gestionar todos lospost que el usuario vera
//incluyendo los de el y los usuarios que sigue
//tambien vamos a ordenar por orden de publicacion
export const getTimelinePost = async(req, res) => {
    const userId = req.params.id;
    try {
        //buscaremos todos los post del userId
        const currentUserPosts = await PostModel.find({userId: userId});

        //buscaremos todos los post de los usarios que seguimos
        const followingPosts = await UserModel.aggregate([
            {
                //con este match lo que hacemos es que vamos a buscar en la BBDD de userModel
                //el que tenga este userId que estamos pasando
                $match: {
                    _id : new mongoose.Types.ObjectId(userId)
                }
            },
            {
                /*esta es la parte mas compleja de toda la BBDD y todo lo hace mongoose.

                le estamos pidiendo que busque todos los id que estan en la propiedad following(todos los usuarios que siguen al currentUser)
                y una vez que los tiene busca todos los posts que tengan en la BBDD posts y los devuelva como followingPosts
                */
                $lookup: {
                    from : "posts",
                    localField : "following",
                    foreignField : "userId",
                    as : "followingPosts"
                }
            },
            {
                //aqui completamos el ultimo paso
                //que seria el tipo de devolucion que tendra
                //devolvera un con una propiedad llamada followingPosts
                // que dentro tendra todos los datos de los posts
                $project: {
                    followingPosts : 1,
                    _id: 0
                }
            }
        ])
        //aqui devolvemos todos los posts juntos
        //los del currentUser y los users que sigue
        //debido a que followingPosts de vuelve un objeto con una propiedad
        //y dentro de esa porpiedad es donde esta el arrau con los posts
        //tenemos que pasarlo de esa manera, adicional a esto estamos re-ordenando
        //todo el resultado para que se ordene por el mas reciente
        //en este caso tomamos la propiedad createAt(fecha de creacion) de cada post
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts).sort((a,b) => b.createdAt - a.createdAt));

    } catch (error) {
        res.status(500).json(error);
    }
}