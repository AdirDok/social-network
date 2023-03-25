import { Schema, model } from 'mongoose'

const postsSchema: Schema = new Schema({

    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    autor: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    image: {
        type: String
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: "user"
    }],
    comments: [{
        type: Schema.Types.ObjectId,    
        ref: "comment"
    }],
    reports: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        time: {
            type: Date,
            default: Date.now
        }
    }],
    edit: {
        edit_by: {
            type: Schema.Types.ObjectId
        },
        edit_time: {
            type: Date   /* לכאן אני יכניס Date.now  */
        }
    }

}, { versionKey: false })

const Posts = model('post', postsSchema)
export default Posts