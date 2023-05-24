import cors from 'cors';
import env from 'dotenv';
import colors from 'colors';
import express from 'express';
import session from 'express-session';
import conectToMongoDataBace from './conectionToMongoDB';
import cookieParser from 'cookie-parser';

colors.enable();
env.config();
const PORT = process.env.PORT;

// @ts-ignore
// const token = jwt.sign(user, crypto.randomBytes(64).toString('hex'))

const app = express();
app.use(express.json());
app.use(cookieParser());    /* נותן לי גישה לקוקי */
app.use(express.static('public'));     /* אין צורך לרשם פבליק פשוט תרשום את מה שאתה מחפש ישירות */

let SESSION_SECRET = "defult_Secret";
if (process.env.SESSION_SECRET) SESSION_SECRET = process.env.SESSION_SECRET;



app.use(session({
    secret: SESSION_SECRET,
    name: "sessionName",
    saveUninitialized: true,
    resave: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    }
}));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

/* to prevent xss */
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", `script-src http://localhost:${PORT}`);  /* סקריפטים באים רק מ לוקאלהוסט8080 */
    // res.setHeader("Content-Security-Policy", "script-src 'none'")    /* שום סקריפט לא ירוץ */
    next();
})


conectToMongoDataBace()     /* מאתחל DB */


import logs_route from '../routs/logs'
import refresh_route from '../routs/refresh'
import verifyToken from '../middlewares/verifyToken';


app.use('/logs', logs_route)
app.use('/refresh', refresh_route)


app.get('/asd', verifyToken, async (req, res) => {

    res.send('hi')

})


// app.get('/coo', async (req, res) => {
//     res.cookie("this is a cookie", "asdasd", {
//         // maxAge : 5000
//         // expires : new Date('26 july 2023')
//         // httpOnly: true   /*   אי אפשר לגשת אליו מהקליינט טוב נגד מתקפות XSS*/
//         // secure: true   /* רק דרך HTTPS */


//     })
//     res.cookie("foo", "asdasd", {})

//     console.log(req.socket.remoteAddress)
//     console.log(req.ip)



//     res.send("hi")
// })

// app.get('/asd', async (req, res) => {
//     console.log(req.cookies)
//     // res.clearCookie('foo')
//     res.send(req.cookies)
// })




app.listen(PORT, () => console.log(`server ${PORT} is online`.rainbow))