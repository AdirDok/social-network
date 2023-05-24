import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import sanitizingUserInput from '../utilities/sanitizingUserInput';


const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;


export default async function verifyToken(req: Request, res: Response, next: NextFunction) {

    try {

        const authHeader = req.headers['authorization'];      /* לוקח את ערך ההאדר */
        const token = authHeader && authHeader.split(' ')[1];     /* מחלץ את הטוקין */
        if (!token) return res.status(401).send({ err_msg: 'no token was found go to login' });   /* אם אין טוקין מחזיר שאין טוקין */
        /* מכאן בוודאות שיש לי טוקין */
        if (!ACCESS_TOKEN_SECRET) return res.status(500).send({ err_msg: 'no env file' });

        /* לצנזר את האינפוט של הטוקין */
        const sanitizing = await sanitizingUserInput(token);
        if (!sanitizing) return res.status(403).send({ err_msg_haker: 'somone is traing to hak ... kill him' })

        JWT.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
            if (err?.message === "invalid token") return res.send({ err_msg: 'invalid token', err })   /* חוסם אותו כי התעסקו לי עם הטוקין */

            if (err?.message === "jwt expired") return res.send({ err_msg_goToRefreshToken: "expirs token", err })   /* כאן אני ירצה לתת לו טוקין חדש */
          
            next()
        })

    } catch (error) {
        console.log("this is from verfiToken meiidelwer".bgRed)
        return res.sendStatus(500)
    }




}   /* authenticateToken */





