import users_T_model from "../T_models/users_T_model";
import token_T_model from "../T_models/token_T_model";
import Users from "../schemas/usersSchema";
import SQL from "../main/mysqlconfig";
import JWT from "jsonwebtoken";

const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET: string | undefined = process.env.REFRESH_TOKEN_SECRET;
const ACCSESS_TOKEN_EXPIRES_IN: string | undefined = process.env.ACCSESS_TOKEN_EXPIRES_IN;


async function generateToken(email: string, user?: users_T_model): Promise<any> {

    try {

        if (!user) {  /*to avoid unnecessary calls to the DB*/
            [user] = await Users.find({ email }, { password: 0 })
            console.log("i am going to the DB ".bgRed)

        };

        // const ACCESS_TOKEN_SECRET: string | undefined = process.env.ACCESS_TOKEN_SECRET;
        // const REFRESH_TOKEN_SECRET: string | undefined = process.env.REFRESH_TOKEN_SECRET;
        // const ACCSESS_TOKEN_EXPIRES_IN: string | undefined = process.env.ACCSESS_TOKEN_EXPIRES_IN;

        if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) return { err_msg: "no env file" };

        const access_Token_Info = {
            _id: user?._id,
            name: user?.name,
            lastname: user?.lastname,
            gender: user?.gender,
            email: user?.email
        };

        const refresh_Token_Info = { email: user?.email };

        const refreshToken = JWT.sign(refresh_Token_Info, REFRESH_TOKEN_SECRET);
        const accessToken = JWT.sign(access_Token_Info, ACCESS_TOKEN_SECRET, { expiresIn: ACCSESS_TOKEN_EXPIRES_IN });

        await SQL(`INSERT INTO tokens(token,user_Email)
        values( ? , ? )`, [accessToken, email]);

        // console.log("generateToken2".bgCyan);
        return { accessToken, refreshToken };

    } catch (error) {
        console.log("this is the catch".bgRed, error)
    }
}


async function getToken(email: string, user?: users_T_model): Promise<any> {

    /* Gets a token from the DB ,if there is one */
    const [currentToken]: token_T_model[] = await SQL(`
    SELECT * FROM tokens.tokens
    WHERE user_Email = ?
    and expired = false `, [email]);


    /* If there is no token, create one  */
    if (!currentToken) return generateToken(email, user);

    /* If I have a token, I will check its validity and reliability and generate a new one if necessary */
    try {

        if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) return { err_msg: "no env file" };

        let accessToken = JWT.verify(currentToken.token, ACCESS_TOKEN_SECRET);
        accessToken = currentToken.token;
        /*  עתיד להיות אותו הדבר גם לריפרש ואז אני ישלח את ריפרש */
        const refresh_Token_Info = { email };

        const refreshToken = JWT.sign(refresh_Token_Info, REFRESH_TOKEN_SECRET);

        // console.log("this is from getToken if thre is alredy a token".bgYellow)
        return { accessToken, refreshToken }

    } catch (error) {
        await SQL(`UPDATE tokens SET expired = true WHERE id = ?`, [currentToken.id]);
        console.log("token was expird ".bgYellow)
        return generateToken(email, user);
    }

}


export { generateToken, getToken }