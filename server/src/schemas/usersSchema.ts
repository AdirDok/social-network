import { Schema, model } from 'mongoose'


const userSchema: Schema = new Schema({

    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/  
    },
    password: {
        type: String,
        required: true
        // validate: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/  /* Minimum eight characters, at least one uppercase letter, one lowercase letter and one number: */
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    online: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    superAdmin: {
        type: Boolean,
        default: false
    },
    baner: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: 'https://cdn3.vectorstock.com/i/1000x1000/30/97/flat-business-man-user-profile-avatar-icon-vector-4333097.jpg'
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "post"
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    closeFriends: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }],
    alboms: []

}, { versionKey: false })


const Users = model('user', userSchema)
export default Users