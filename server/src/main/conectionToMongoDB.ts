import Users from '../schemas/usersSchema'
import mongoose, { connect } from 'mongoose'
import initDataBaceFunc from '../../initDataBace/initDataBaceFunc'

const conectToMongoDataBace = async (): Promise<void> => {
    try {
        // https://stackoverflow.com/questions/74747476/deprecationwarning-mongoose-the-strictquery-option-will-be-switched-back-to

        mongoose.set("strictQuery", false)   /* לבדוק את זה  */
        await connect('mongodb://localhost/social_network')
        console.log('conected to mongo DB'.bgBlue);

        const users = await Users.find();

        if (users.length) return console.log("data laredy exsisy👑😜");
        initDataBaceFunc();

    } catch (err) {
        console.log(err)
    }

};

export default conectToMongoDataBace;