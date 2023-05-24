import { Request } from 'express'
import users_T_model from '../T_models/users_T_model';

export default interface CustomRequest extends Request {
    user?: users_T_model
}  