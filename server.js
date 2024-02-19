import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js';
import signin from './controllers/signin.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';
import password from './controllers/password.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

//Live Site
const db = knex({
  client: 'pg',
     connection: {
       connectionString : process.env.DATABASE_URL,
       ssl: true
     }
   });

//Dev
// const db = knex({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     port : 5432,
//     user : 'adamazizi',
//     database : 'face-detector'
//   }
// });

const app = express();
 
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.get('/', (req, res) =>res.json('it is working'))
app.post('/signin' , (req, res)  => signin.handleSignIn(req, res, db, bcrypt))
app.post('/register' , (req, res) => register.handleRegister(req, res, db, bcrypt))
app.put('/profile/:id', (req, res) => profile.handleProfile(req, res, db, bcrypt))
app.put('/image', (req, res) => image.handleImage(req, res, db))
app.post('/imageurl', (req, res) => image.handleApiCall(req, res))
app.put('/profile/password/:id', (req, res) => password.handlePassword(req, res, db, bcrypt))
app.listen(process.env.PORT, () => console.log(`app is running on port 3002 ${process.env.PORT}`))
// app.listen(3003, () => console.log(`app is running on port 3003`))