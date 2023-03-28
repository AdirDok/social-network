import bcrypt from 'bcrypt'
import fs from 'fs/promises'
import Posts from '../src/schemas/postsSchema'
import { Document as M_Document } from 'mongoose'
import Users from '../src/schemas/usersSchema'
import Comments from '../src/schemas/commentsSchema'
import users_T_model from '../src/T_models/users_T_model'
import posts_T_model from '../src/T_models/posts_T_model'
import comments_T_model from '../src/T_models/comments_T_model'
import SQL from '../src/main/mysqlconfig'


const initDataBaceFunc = async () => {
    /* add users to DB  */

    let addUsersToDbFromJsonFile: string | users_T_model[] = await fs.readFile('./initDataBace/users.json', "utf-8");

    addUsersToDbFromJsonFile = await JSON.parse(addUsersToDbFromJsonFile);
    for (const user of addUsersToDbFromJsonFile) {
        // @ts-ignore
        user['password'] = await bcrypt.hash(user['password'], 10)
    };
    await Users.insertMany(addUsersToDbFromJsonFile);
    const usersArr: users_T_model[] | null = await Users.find();

    await SQL(`use tokens`)

    // =====================מכניס עוקבים=================================

    const [Adir, Moran, Aurelia, Hays,
        Count_Noctilus,
        High_Queen_Khalida,
        Markus_Wulfhart,
        Ikit_Claw,
        Deathmaster_Snikch,
        Queek_Headtaker,
        Gor_Rok, Kroq_Gar,
        king_Malekith, Morathi,
        Crone_Hellebron, Karl_Franz,
        Mannfred_von_Carstein,
        Noam_D, Billie_eilish,
        Ofir_P, Lior_n
    ] = usersArr


    await Users.findOneAndUpdate({
        email: Karl_Franz.email
    }, {
        $addToSet: {
            following: {
                $each: [
                    Adir._id, Markus_Wulfhart._id, Kroq_Gar._id, Gor_Rok._id
                ]
            }
        }
    })

    await Users.findOneAndUpdate({
        email: Queek_Headtaker.email
    }, {
        $addToSet: {
            following: {
                $each: [
                    Adir._id, Ikit_Claw._id, Deathmaster_Snikch._id
                ]
            }
        }
    },)

    await Users.findOneAndUpdate({
        email: king_Malekith.email
    }, {
        $addToSet: {
            following: {
                $each: [
                    Morathi._id, Crone_Hellebron._id, Mannfred_von_Carstein._id
                ]
            }
        }
    })

    await Users.findOneAndUpdate({
        email: Noam_D.email
    }, {
        $addToSet: {
            following: {
                $each: [
                    Adir._id, Billie_eilish._id, Ofir_P._id, Moran._id
                ]
            }
        }
    })

    await Users.findOneAndUpdate({
        email: Moran.email
    }, {
        $addToSet: {
            following: {
                $each: [
                    Adir._id, Billie_eilish._id, Ofir_P._id
                ]
            }
        }
    })

    // =======================מכניס פוסטים ותגובות =========================

    const addPosts = async () => {

        (async () => {                     /* post1 */


            const Malekith_post: posts_T_model = {
                content: 'olf one will me mine',
                autor: king_Malekith._id
            }

            const post: M_Document = new Posts(Malekith_post)
            await post.save()

            const Karl_Franz_com: comments_T_model = {
                autor: Karl_Franz._id,
                content: 'not as long as i live'
            }

            const com1 = new Comments(Karl_Franz_com)
            await com1.save()

            const Morathi_com: comments_T_model = {
                autor: Morathi._id,
                content: 'ill join you yes yes'
            }

            const com2 = new Comments(Morathi_com)
            await com2.save()

            const Malekith_com: comments_T_model = {
                autor: king_Malekith._id,
                content: 'stop it mom i can do it by myselfe'
            }

            const com3 = new Comments(Malekith_com)
            await com3.save()

            await Posts.findByIdAndUpdate(post._id, {
                $push: { comments: { $each: [com1, com2, com3] } }
            })

        })();

        (async () => {                     /* post 2 */
            const Ikit_Claw_Post: posts_T_model = {
                content: 'i am the smartest of all rets',
                autor: Ikit_Claw._id
            }

            const post = new Posts(Ikit_Claw_Post)
            await post.save()


            const Deathmaster_Snikch_comment: comments_T_model = {
                autor: Deathmaster_Snikch._id,
                content: "And I sneak the most"
            }

            const com1 = new Comments(Deathmaster_Snikch_comment)
            await com1.save()

            await Posts.findByIdAndUpdate(post._id, {
                $push: { comments: com1._id }
            })


        })();

        (async () => {                     /* post3 report */

            const Mannfred_von_Carstein_Post: posts_T_model = {
                autor: Mannfred_von_Carstein._id,
                content: 'im gonna kill all heumens and inslave them',
                image: 'https://i.ytimg.com/vi/IgtF1H0JUCQ/maxresdefault.jpg',

                reports: [

                    { user: Karl_Franz._id },
                    // @ts-ignore
                    { user: Adir._id },
                    // @ts-ignore
                    { user: Aurelia._id },
                    // @ts-ignore
                    { user: Hays._id },
                    // @ts-ignore
                    { user: Noam_D._id }
                ]

            }

            const post: M_Document = new Posts(Mannfred_von_Carstein_Post)
            await post.save()

        })();

        (async () => {                     /*post 4 */

            const Ofir_P_Post: posts_T_model = {
                autor: Ofir_P._id,
                content: ' Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem non velit voluptatem! Perferendis officiis fuga eos quos animi suscipit dolore enim neque corrupti vel quisquam, iusto et natus ipsa maiores adipisci tempora mollitia nesciunt minima nulla. Ad commodi voluptatem laborum laboriosam incidunt minus? Quod itaque reiciendis at, unde alias consequatur, quam doloremque nihil exercitationem dolor commodi quasi dolore dolorem provident tempora nesciunt assumenda optio ab in asperiores expedita voluptates quisquam debitis. Rerum laudantium numquam ipsum eveniet deleniti corrupti, labore vero debitis officiis, tenetur ad cumque ab? Commodi, laborum accusantium? Similique vero laboriosam nobis ipsam minima molestiae consectetur, reiciendis et delectus? Ullam itaque distinctio aliquid, necessitatibus, assumenda quam minima hic cumque aspernatur nulla porro molestiae quisquam ipsa, veritatis numquam. Dolorum deleniti culpa eligendi quaerat placeat. Quia in magnam alias soluta! Tempore quidem corrupti consequuntur blanditiis alias voluptatem minus ullam dolore nemo, dolor quo cum perspiciatis ipsa in! Rem, dolor placeat accusamus veritatis nostrum velit cumque labore nam deserunt dicta temporibus iure eligendi quam ab earum hic harum, debitis minus aut numquam expedita distinctio necessitatibus. Officiis, perferendis voluptate. Enim consectetur officia aperiam, aliquid magni distinctio, beatae commodi voluptatibus nam recusandae mollitia ipsum repudiandae! Enim molestias, praesentium voluptas veritatis quaerat iure eligendi excepturi voluptate velit temporibus sit possimus consequuntur, rerum beatae numquam officiis ab veniam est? Magnam id porro dolores commodi nam! Porro, nemo reprehenderit ipsa ab doloribus delectus nisi blanditiis recusandae facere corrupti libero sed saepe sunt ipsum voluptatibus ea doloremque animi illum eligendi. Dolore eos fugiat expedita, nulla distinctio beatae repellat laudantium sapiente repudiandae alias assumenda repellendus molestiae dolores voluptatem quibusdam, nostrum numquam molestias facilis quaerat corporis animi iusto eligendi necessitatibus voluptates. Sit quam quasi veritatis quibusdam nesciunt esse voluptatum eligendi? Sequi quaerat aliquid perspiciatis maxime deserunt rem. Voluptates in accusamus at nobis vel ipsum ipsa hic eum, error saepe commodi labore officiis. Repudiandae quasi repellendus amet cupiditate laboriosam, error fugiat ex eveniet doloremque omnis vero aliquid perferendis voluptates accusamus nihil molestias? Odit, fuga quas sint quia ex doloremque amet dolorem minima, optio reprehenderit consequuntur aperiam harum quisquam vel excepturi aut cumque, deleniti ipsam. Delectus quod minima cumque et, neque facere laboriosam nesciunt aperiam tempore optio reiciendis iure est dolorum doloribus quaerat vero, doloremque dolor molestias minus. In nostrum quos, placeat non quidem voluptates. Ab quasi porro quidem eaque exercitationem quod deserunt, optio ex architecto eius. Fugit vero, perspiciatis corporis accusamus consequatur quidem dolores minima dignissimos quis amet corrupti iure ratione earum odit aut soluta reprehenderit eius illum. Blanditiis quidem facere fugit, iste animi veniam, consectetur quo tempore eum ipsam accusantium harum, excepturi laudantium eligendi repellat neque repellendus cum consequuntur nam eveniet. Qui adipisci vitae explicabo deleniti enim possimus dolores aliquam cum iure, libero numquam vero culpa autem dicta quod consequuntur quis ea quo error voluptate? Cumque ipsum quibusdam autem voluptas. Rerum optio voluptates nisi fugit? Aut inventore dolores, sint in saepe debitis qui non voluptatem dolore eligendi blanditiis. Voluptatem nihil mollitia laborum! Iure illum aspernatur officiis quidem laudantium quam, perferendis unde repellat delectus molestiae assumenda quibusdam animi voluptatum consectetur voluptates',
                image: 'https://ynet-pic1.yit.co.il/picserver5/crop_images/2020/07/26/10128554/10128554_0_0_980_653_0_x-large.jpg',
                likes: [Adir._id, Moran._id, Aurelia._id, Hays._id, Noam_D._id]

            }

            const post = new Posts(Ofir_P_Post)
            await post.save()

            const Lior_n_comment = new Comments({
                content: 'hi very good',
                autor: Lior_n._id
            })

            await Lior_n_comment.save()

            await Posts.findByIdAndUpdate(post._id, {
                $push: { comments: Lior_n_comment._id }
            })


        })();

        (async () => {                     /* post 5  */
            const Queek_Headtaker_post: posts_T_model = {
                autor: Queek_Headtaker._id,
                content: 'Everything will be mine, mine!!!!'
            }

            const post = new Posts(Queek_Headtaker_post)
            await post.save()

            const Gor_Rok_comment = new Comments({
                content: 'reaaa arrrr',
                autor: Gor_Rok._id
            })

            await Gor_Rok_comment.save()

            await Posts.findOneAndUpdate({
                _id: post._id
            }, {
                $push: { comments: { $each: [Gor_Rok_comment._id] } }
            })


        })();

        (async () => {                     /*  post 6 */

            const Noam_D_post: M_Document | posts_T_model = new Posts({
                content: 'i love anima and perpal',
                autor: Noam_D._id,
                image: 'https://i.pinimg.com/474x/74/56/fe/7456febbfe951f0f4be784d4429475d6.jpg'
            })

            await Noam_D_post.save()

            const com1: M_Document = new Comments({
                content: 'love you sis',
                autor: Adir._id
            })
            await com1.save()

            const com2: M_Document = new Comments({
                content: 'love you sis',
                autor: Moran._id
            })
            await com2.save()


            const com3: M_Document = new Comments({
                content: 'Hi Noam yes yes',
                autor: Queek_Headtaker._id
            })
            await com3.save()

            await Posts.findByIdAndUpdate(Noam_D_post._id, {
                $push: {
                    comments: { $each: [com1._id, com2._id, com3._id] }
                }
            })
        })();

        (async () => {                    /* post 7 */

            const Morathi_post = new Posts({
                content: 'Who sexy and up ? ',
                autor: Morathi._id,
                image: 'https://preview.redd.it/j4u6g6e7n6y41.png?width=640&crop=smart&auto=webp&s=b3836c7e2f9b7883b8b6b26fabaf5fe9315b9847'
            })
            await Morathi_post.save()

            const com1 = new Comments({
                content: "omg mom stop it !",
                autor: king_Malekith._id
            })
            await com1.save()

            const com2 = new Comments({
                content: 'Hi how about ill show u my galMarez ? ',
                autor: Karl_Franz._id
            })
            await com2.save()

            const com3 = new Comments({
                content: "sound good to me DM me",
                autor: Morathi._id

            })
            await com3.save()

            await Posts.findByIdAndUpdate(Morathi_post._id, {
                $push: {
                    comments: {
                        $each: [com1._id, com2._id, com3._id]
                    }
                }
            })
        })();

        (async () => {                     /* post 8  */
            const Moran_Post = new Posts({
                autor: Moran._id,
                content: '?למה כולם מדברים פה אנגלית לא הבנתי'
            })
            await Moran_Post.save()

            const com1 = new Comments({
                autor: Adir._id,
                content: "ככה זה פה חיים"
            })
            await com1.save()

            const com2 = new Comments({
                autor: Noam_D._id,
                content: "בא לך לאכל משהו אחרכך ? "
            })
            await com2.save()

            await Posts.findByIdAndUpdate(Moran_Post._id, {
                $push: {
                    comments: {
                        $each: [com1._id, com2._id]
                    }
                }
            })




        })();

        (async () => {                     /* post 9  */

            const Noam_D_post = new Posts({
                content: "עד מתי !!!!!",
                autor: Noam_D._id,
                imge: 'https://miluimnik.co.il/wp-content/uploads/2013/03/%D7%A2%D7%93-%D7%9E%D7%AA%D7%99-1024x585.jpg'
            })
            await Noam_D_post.save()

            const com1 = new Comments({
                autor: Adir._id,
                content: "שקט יצעירה מתה"
            })
            await com1.save()

            const com2 = new Comments({
                autor: Moran._id,
                content: "שקט יצעירה מתה"
            })
            await com2.save()

            await Posts.findByIdAndUpdate(Noam_D_post._id, {
                $push: {
                    comments: {
                        $each: [com1._id, com2._id]
                    }
                }
            })

        })();

        (async () => {                     /* post 10 */
            const post = new Posts({
                autor: Ofir_P._id,
                content: `גגדקכדק
                דדקכדןםחדקכדקכ
                פקןחדלךקכדקכדק
                דקככקכק'םן,קחכדקכ דקכדקכ דקדחלךחערג ולחגר`,
                image: 'https://images1.calcalist.co.il/PicServer2/20122005/127675/shutterstock_13578151_l.jpg'
            })
            await post.save()

        })();

        (async () => {                     /*  post11*/
            const post = new Posts({
                autor: Billie_eilish._id,
                content: 'Come to my show',
                imge: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Billie_Eilish_at_Pukkelpop_Festival_-_18_AUGUST_2019_%2801%29_%28cropped%29.jpg/1200px-Billie_Eilish_at_Pukkelpop_Festival_-_18_AUGUST_2019_%2801%29_%28cropped%29.jpg'
            })
            await post.save()

        })()

    }

    addPosts()

}


export default initDataBaceFunc 
