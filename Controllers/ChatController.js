import ChatModel from '../Models/chatModel.js';

// creando un nuevo chat que extiende de chatModel que en este caso es la clase que
//tiene la estructura, por lo general van haber dos propiedades en members
// el que envia y el que recibe
export const createChat = async(req, res) => {
    const newChat = new ChatModel({
        members: [req.body.senderId, req.body.receiverId]
    });

    try {


        const chat = await ChatModel.findOne({
            members: {$all: [req.body.senderId, req.body.receiverId]}
        });

        if(chat){
            res.status(200).json(chat);
        }
        else{
            const result = await newChat.save();
            res.status(200).json(result);
        }

        //subiendo esa informacion a mongooseDB
        
    } catch (error) {
        res.status(500).json(error);
    }
};

//chat de cada usuario, esto puede incluir cualquier cantidad de chats ya que un user puede
//hablar con varios usuarios
export const userChat = async(req, res) => {
    
    try {
        const chat = await ChatModel.find({
            members: {$in: [req.params.userId]}
        });
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
};


//chat en especifico, ya que user que envia y el que recibe
export const findChat = async(req,res) => {

    try {
        const chat = await ChatModel.findOne({
            members: {$all: [req.params.firstId, req.params.secondId]}
        })
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const removeChat = async(req, res) => {
    const chatId = req.params.id;

    try {
        await ChatModel.findByIdAndDelete(chatId);
        res.status(200).json("chat eliminado");
    } catch (error) {
        res.status(500).json(error);
    }
    
}