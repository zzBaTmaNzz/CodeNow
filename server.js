const express = require('express');
const path = require('path');
const bcrypt=require('bcrypt');
require('./src/db/connection');
const Register = require('./src/model/register');
const app = express();
const static_path = path.join(__dirname, "/public");
app.set('view engine', 'hbs');
app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contactus', (req, res) => {
    res.render('contactus');
});
app.get('/contest', (req, res) => {
    res.render('contests');
});
app.get('/login', (req, res) => {
    res.render('login.hbs');
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const cpassword = req.body.cpassword;
        if (req.body.name === '' || req.body.email === '' || password === '') {
            res.send('Fields should not empty.');
        }else{
            if (password === cpassword) {
                const registerUser = new Register({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword
                });
                const registered = await registerUser.save();
                res.status(201).render('home');
            } else {
                res.send('password are not matched');
            }
        }

    } catch (err) {
        res.status(400).send(err);
    }
});
app.post('/login',async (req,res)=>{
    try{
        const email=req.body.email,password=req.body.password;
        const userDetail=await Register.findOne({email:email});
        const matched=await bcrypt.compare(req.body.password, userDetail.password);
        if(matched){
            res.send('You are logged in.');
        }else{
            res.send('Invalid credentials');
        }
    }catch(error){
        res.send('Invalid credentials');
    }
});
app.listen(3000, () => {
    console.log('server is running in http:localhost:3000');
});