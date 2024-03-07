import dotenv from 'dotenv';
dotenv.config();

export default {
    dbURL:  process.env.DB_URL,
    dbName: 'stay_db',

    // dbURL: 'mongodb://127.0.0.1:27017',
    // dbName : 'stay_db'
}
