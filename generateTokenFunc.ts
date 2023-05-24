import token_T_model from '../T_models/token_T_model';
import users_T_model from '../T_models/users_T_model';
import CustomRequest from './customRequest';
import { Request, Response } from 'express';
import SQL from '../main/mysqlconfig';
import JWT from 'jsonwebtoken'




export default async function generateToken(
    req: CustomRequest,     /*  בתוכו צרין להיות כבר אובייקט יוזר*/
    res: Response,

): Promise<any> {

    /*  יכול לשלוח את יוזר גם כפרמטר*/
    const user: users_T_model | undefined = req.user;
    if (!user) return res.status(400).send({ err_msg: 'no user ... from generateToken func' })

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
    const TokeExpiresIn = process.env.TokeExpiresIn;


    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
        return res.status(500).send({ err_msg: 'no env file server err' })
    }

    // ================== מסיים לוודא פרמטרים ===================

    const access_Token_Info = {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        gender: user.gender,
        email: user.email
    };

    const refresh_Token_Info = {
        email: user.email
    };

    const refreshToken = JWT.sign(refresh_Token_Info, REFRESH_TOKEN_SECRET);

    const [currentToken]: token_T_model[] = await SQL(`
    SELECT * FROM tokens.tokens
    WHERE user_Email = ?
    and expired = false `, [user.email]);

    // -------------------------------------------------------------------------------
    if (currentToken) {

        try {
            let accessToken = JWT.verify(currentToken.token, ACCESS_TOKEN_SECRET);   /* מחזיר את המידע שבתוך הטוקין ולא הטוקין עצמו */
            accessToken = currentToken.token;
            return res.send({ msg: 'welcome ...(old token is ok )... ' + user.name, data: { accessToken, refreshToken, user } });

        } catch (err) {
            await SQL(`UPDATE tokens SET expired = true WHERE id = ?`, [currentToken.id]);

            const accessToken = JWT.sign(access_Token_Info, ACCESS_TOKEN_SECRET, { expiresIn: TokeExpiresIn });

            await SQL(`INSERT INTO tokens(token,user_Email)
            values( ? , ? )`, [accessToken, user.email]);

            return res.send({ msg: 'welcome ...(new token .. old one was expird)... ' + user.name, data: { accessToken, refreshToken, user } });

        }
    }

    /* אם אין טוקין  */
    const accessToken = JWT.sign(access_Token_Info, ACCESS_TOKEN_SECRET, { expiresIn: TokeExpiresIn });
    await SQL(`INSERT INTO tokens(token,user_Email)
    values( ? , ? )`, [accessToken, user.email])
    return res.send({ msg: 'welcome ...(new token..end of func)... ' + user.name, data: { accessToken, refreshToken, user } })

    // ----------------------------------------------------------------------

}    /* generateToken */
