import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {type: String, require: true},
    username: {type: String, require: true},
    desc: String,
    likes: [],
    image: String
},
{
    timestamps: true
});

//con esta linea estamos pandole al model, el nombre que recibira la lista en mongooseDB y
//postSchema seria la estructura que tendra
var PostModel = mongoose.model("Posts", postSchema);
export default PostModel;