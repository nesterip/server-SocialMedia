import mongoose from "mongoose";

const ChatSchema =mongoose.Schema(
    {
        members: {
            type: Array,
        }
    },
    {
        timestamps: true,
    }
);

//con esta linea estamos pandole al model, el nombre que recibira la lista en mongooseDB y
//ChatSchema seria la estructura que tendra
const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;