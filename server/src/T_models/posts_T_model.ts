import comments_T_model from "./comments_T_model"
import users_T_model from "./users_T_model"

export default interface posts_T_model {
    _id?: string
    content: string
    createdAt?: Date
    autor: users_T_model | string
    image?: string
    likes?: users_T_model[] | string[]
    comments?: comments_T_model[] | string[]   /* לשנות זאת אחרי שאני עושה אינטרפייס לתגובות */
    reports?: [{ user: users_T_model | string, time?: Date }]
    edit?: { edit_by: users_T_model | string, edit_time?: Date }

}

