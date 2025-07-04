import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    onVideo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    { timestamps: true }
)

export const Comment = mongoose.model("Comment", commentSchema)