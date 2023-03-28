import mysql from 'mysql';


const connectionToMySQL: mysql.Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tokens'
})

connectionToMySQL.connect(err => {
    if (err) return console.log("this is MYSQL connection Error".bgRed, err);
    console.log("connected to MYSQL 😁".bgBlue)
})

/* q == query */
const SQL = (Q: string, valusArr: any[] = []) => {
    return new Promise<any>((resolve, reject) => {
        connectionToMySQL.query(Q, valusArr, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}


export default SQL