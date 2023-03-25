import { Schema, model } from 'mongoose'

const commentsSchema = new Schema({

    content: {
        type: String,
        required: true
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }, createdAt: {
        type: Date,
        default: Date.now  
    },

}, { versionKey: false })

const Comments = model('comment', commentsSchema)
export default Comments