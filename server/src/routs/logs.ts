import express, { Request, Response, Router } from 'express';
import Users from '../schemas/usersSchema';
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import SQL from '../main/mysqlconfig';
import token_T_model from '../T_models/token_T_model';
// compile TypeScript error
// @ts-ignore


const router: Router = express.Router();

const password_Pattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const email_Pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
let passseord_Attempts: number = 0;

// router.get('/', async (req: Request, res: Response) => {
// })


router.post('/login', async (req: Request, res: Response) => {

    interface userInfo {
        email: string,
        password: string
    };

    try {

        const { email, password }: userInfo = req.body;

        if (!email) return res.status(400).send({ err_msg: 'Email is require' });
        if (!password) return res.status(400).send({ err_msg: 'Password is require' });

        const vaid_email: boolean = email_Pattern.test(email);
        if (!vaid_email) return res.status(400).send({ err_mag: 'Invalid email , Please make sure there are no spaces or special characters' });

        const valid_password: boolean = password_Pattern.test(password);
        if (!valid_password) return res.status(400).send({ err_mag: 'Invalid password, Minimum eight characters, at least one uppercase letter, one lowercase letter and one number no spaces' });

        /* if i give user a Type users_T_model or M_Document its an error if its type users_T_model[] its ok but then i canot do distrucchring  */
        const [user] = await Users.find({ email }, {})
        if (!user) return res.status(400).send({ err_msg: 'No user has been identified with this email. Please go to register' })

        const is_Password_Corect: boolean = await bcrypt.compare(password, user.password)

        if (!is_Password_Corect) {
            passseord_Attempts++

            if (passseord_Attempts >= 3) {
                return res.status(400).send({ err_msg: 'Forgot your password?' })
            }

            return res.status(400).send({ err_msg: 'Incorect Password' })
        };
        /* אפשר להטמיע שכחתה סיסמא? */


        // compile TypeScript error
        if (user.superAdmin === true) {
            // @ts-ignore
            req.session.superAdmin = true
            // @ts-ignore
            req.session.email = user.email
            return res.send({ msg: 'Welcom admin ' + user.name, data: [user] })
        }

        /* update online = true */
        await Users.findByIdAndUpdate(user._id, {
            $set: { online: true }
        });
        user.online = true;


        const access_Token_Info = {
            _id: user._id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            gender: user.gender
        };

        const refresh_Token_Info = {
            email: user.email
        };

        const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
        const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

        // @ts-ignore
        const refreshToken = JWT.sign(refresh_Token_Info, REFRESH_TOKEN_SECRET);

        // ----------------------------------
        const [currentToken]: token_T_model[] = await SQL(`
        SELECT * FROM tokens.tokens
        WHERE user = ?
        and expired = false `, [user.email]);

        if (currentToken) {

            // @ts-ignore
            JWT.verify(currentToken.token, ACCESS_TOKEN_SECRET, async (err, tokenData) => {

                if (err?.name == "TokenExpiredError") {

                    await SQL(`UPDATE tokens SET expired = true WHERE id = ?`, [currentToken.id])

                    // @ts-ignore
                    JWT.sign(access_Token_Info, ACCESS_TOKEN_SECRET, { expiresIn: '10s' }, async (err, accessToken) => {
                        if (err) return res.status(400).send({ err_msg: err })

                        await SQL(`INSERT INTO tokens(token,user)
                        values( ? , ? )`, [accessToken, user.email])

                        return res.send({ msg: 'welcome ...(new token .. from if)... ' + user.name, data: { accessToken, refreshToken, user } })
                    })

                } else {
                    const accessToken = currentToken.token
                    return res.send({ msg: 'welcome ...(old token end of if)... ' + user.name, data: { accessToken, refreshToken, user } })
                }
            })



        } else {

            /* אם אין טוקין  */
            // compile TypeScript error
            // @ts-ignore
            JWT.sign(access_Token_Info, ACCESS_TOKEN_SECRET, { expiresIn: '10s' }, async (err, accessToken) => {
                if (err) return res.status(400).send({ err_msg: err })

                await SQL(`INSERT INTO tokens(token,user)
                values( ? , ? )`, [accessToken, user.email])

                return res.send({ msg: 'welcome ...(new token..end)... ' + user.name, data: { accessToken, refreshToken, user } })
            })
        }




    } catch (error) {
        console.log("this is a chatch from login".bgRed)
        console.log(error)
        res.sendStatus(500)
    }


})


router.post('/register', async (req: Request, res: Response) => {

    interface userInfo {
        name: string,
        lastname: string,
        gender: string,
        email: string,
        password: string,
        verify_password: string
    };

    try {

        const { name, lastname, gender, email, password, verify_password }: userInfo = req.body;

        if (!name || !lastname) return res.status(400).send({ err_msg: 'name and last name are require' });
        if (!gender) return res.status(400).send({ err_mag: 'please enter your gender' });
        if (gender !== 'male' && gender !== 'female') return res.status(400).send({ err_mag: `I just got here, I don't know how many there are` });

        if (!password || !verify_password) return res.status(400).send({ err_msg: 'password and verify password is require' });
        const valid_password: boolean = password_Pattern.test(password);
        if (!valid_password) return res.status(400).send({ err_msg: 'invalid password, Minimum eight characters, at least one uppercase letter, one lowercase letter and one number no spaces' });
        if (password !== verify_password) return res.status(400).send({ err_msg: 'password dosn`t mach verify password' });

        if (!email) return res.status(400).send({ err_msg: 'email is require' });
        const valid_email: boolean = email_Pattern.test(email);
        if (!valid_email) return res.status(400).send({ err_mag: 'invalid email' });

        const exsistUser = await Users.find({ email }, { email: 1 });
        if (exsistUser.length) return res.status(400).send({ err_msg: 'this email is already in use' })

        // ================saves user ===================================

        const hasdPassword = await bcrypt.hash(password, 10)
        const userToBeSaved = new Users({
            name: name.trim(),
            lastname: lastname.trim(),
            gender,
            email,
            password: hasdPassword
        });

        const user = await userToBeSaved.save();
        res.send({ msg: 'register completed go to login', user });   /*להוריד את היוזר */

    } catch (error) {
        console.log("this is a chatch from register".bgRed)
        console.log(error)
        res.sendStatus(500)

    }

})

router.delete('/logout', async (req: Request, res: Response) => {


})


export default router