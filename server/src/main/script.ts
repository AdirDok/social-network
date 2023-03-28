import cors from 'cors';
import env from 'dotenv';
import colors from 'colors';
import express from 'express';
import session from 'express-session'
import conectToMongoDataBace from './conectionToMongoDB';

colors.enable();
env.config();
// @ts-ignore
// const token = jwt.sign(user, crypto.randomBytes(64).toString('hex'))

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'iDontHavealotoforiginalidiasfoasecret',
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

conectToMongoDataBace()     /* מאתחל DB */


import logs_route from '../routs/logs'

app.use('/logs', logs_route)




const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server ${PORT} is online`.rainbow))