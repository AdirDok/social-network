import sanitizingUserInput from '../utilities/sanitizingUserInput';
import express, { Request, Response, Router } from 'express';
import {  getToken } from '../utilities/TokenHandelrs';
import users_T_model from '../T_models/users_T_model';
import Users from '../schemas/usersSchema';
import bcrypt from 'bcrypt'
// compile TypeScript error
// @ts-ignore

const router: Router = express.Router();

const password_Pattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const email_Pattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


router.post('/login', async (req: Request, res: Response) => {


    interface userInfo {
        email: string,
        password: string
    };

    try {

        const { email, password }: userInfo = req.body;

        if (!email) return res.status(400).send({ err_msg: 'Email is require' });
        if (!password) return res.status(400).send({ err_msg: 'Password is require' });


        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).send({ err_msg: "wrong Types" })
        };

        const sanitizing = await sanitizingUserInput(email, password)
        if (!sanitizing) return res.status(403).send({ err_msg_haker: 'somone is traing to hak ... kill him' })

        const vaid_email: boolean = email_Pattern.test(email);
        if (!vaid_email) return res.status(400).send({ err_msg: 'Invalid email , Please make sure there are no spaces or special characters' });

        const valid_password: boolean = password_Pattern.test(password);
        if (!valid_password) return res.status(400).send({ err_msg: 'Invalid password, Minimum eight characters, at least one uppercase letter, one lowercase letter and one number no spaces' });

        const [user]: users_T_model[] = await Users.find({ email }, {})
        if (!user) return res.status(400).send({ err_msg_redirect: 'No user has been identified with this email. Please go to register' })

        const is_Password_Corect: boolean = await bcrypt.compare(password, user.password);
        if (!is_Password_Corect) return res.status(400).send({ err_msg: 'Incorect Password' });

        user.password = '';     /*  do not send passwords online!*/


        // compile TypeScript error
        if (user.superAdmin === true) {
            // @ts-ignore
            req.session.superAdmin = true
            // @ts-ignore
            req.session.email = user.email
            return res.send({ msg: 'Welcom admin ' + user.name, data: { user } })
        }

        // -------------------------------------------------------------------------------------------------------

        // // compile TypeScript error
        // if (user.superAdmin === true) {
        //     // @ts-ignore
        //     req.session.superAdmin = true
        //     // @ts-ignore
        //     req.session.email = user.email
        //     return res.send({ msg: 'Welcom admin ' + user.name, data: { user } })
        // }

        // -------------------------------------------------------------------------------------------------------


        /* update online = true */
        await Users.findByIdAndUpdate(user._id, {
            $set: { online: true }
        });
        user.online = true;


        const tokens = await getToken(user.email, user);
        if (tokens.err_msg) return res.status(400).send(tokens.err_msg);
        // res.send({ user, tokens });
        res.send([user, tokens]);



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
        if (!password || !verify_password) return res.status(400).send({ err_msg: 'password and verify password is require' });
        if (!email) return res.status(400).send({ err_msg: 'email is require' });

        if (typeof name !== "string" || typeof lastname !== "string" || typeof gender !== "string" || typeof email !== "string" || typeof password !== "string" || typeof verify_password !== "string") {
            return res.status(400).send({ err_msg: 'wrong Types' })
        }

        if (gender !== 'male' && gender !== 'female') return res.status(400).send({ err_mag: `I just got here, I don't know how many there are` });

        const valid_password: boolean = password_Pattern.test(password);
        if (!valid_password) return res.status(400).send({ err_msg: 'invalid password, Minimum eight characters, at least one uppercase letter, one lowercase letter and one number no spaces' });
        if (password !== verify_password) return res.status(400).send({ err_msg: 'password dosn`t mach verify password' });

        const valid_email: boolean = email_Pattern.test(email);
        if (!valid_email) return res.status(400).send({ err_mag: 'invalid email' });

        const sanitizing = await sanitizingUserInput(name, lastname)
        if (!sanitizing) return res.status(403).send({ err_msg_haker: 'somone is traing to hak ... kill him' })

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
        res.send({ msg: 'register completed go to login' });

    } catch (error) {
        console.log("this is a chatch from register".bgRed)
        console.log(error)
        res.sendStatus(500)

    }

})

router.delete('/logout', async (req: Request, res: Response) => {


})



export default router