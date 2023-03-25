export default interface users_T_model  {
    _id: string
    name: string
    lastname: string
    gender: string
    email: string
    password: string
    createdAt ?: Date
    online ?: boolean
    admin ?: boolean
    superAdmin ?: boolean
    baner ?: number
    avatar ?: string
    posts ?: []
    following ?: []
    followers ?: []
    closeFriends ?: []
    alboms ?: []
}





