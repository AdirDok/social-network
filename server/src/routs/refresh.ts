import sanitizingUserInput from '../utilities/sanitizingUserInput';
import { getToken } from '../utilities/TokenHandelrs';
import { Router, Request, Response } from 'express';
import JWT from 'jsonwebtoken';

const router: Router = Router();
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;


router.post('/', async (req: Request, res: Response) => {

    interface refresh_token_interface {
        refreshToken: string
    };


    const { refreshToken }: refresh_token_interface = req.body;

    try {

        if (!REFRESH_TOKEN_SECRET) return res.status(500).send({ err_msg: 'no env file' });
        if (!refreshToken) return res.status(400).send({ err_msg: "no refresh token was found" });
        if (typeof refreshToken !== 'string') res.status(400).send({ err_msg: 'refresh token must be a string' });

        const sanitizing = await sanitizingUserInput(refreshToken);
        if (!sanitizing) return res.status(403).send({ err_msg_hacker: 'somone is traing to hack ... kill him' });

        JWT.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, data) => {  

            if (err) return res.status(403).send({ err_msg: err })    /* אני עוד לא תופס את הטעות פה אני ירצה לנתק את המשתמש ולגרום לו לעשות שוב לוגאין  */

            // @ts-ignore
            const tokens = await getToken(data?.email)
            return res.send(tokens)
        })

    } catch (error) {
        console.log("this is err from refresh : ".bgRed, error)
        res.sendStatus(500)
    }

})




export default router