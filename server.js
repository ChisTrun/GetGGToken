const cookieParser = require('cookie-parser');
const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path')
const jwt = require('jsonwebtoken');
const port = 3000



const app = express()
app.engine('hbs', engine({extname: ".hbs"}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,"views"));

const bodyParser = require("body-parser");
const { URLSearchParams } = require('url');
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser("trung"))
app.get("/",async (req,res) => {
    res.render('mainviews/index')
})


const urlGG = 'https://accounts.google.com/o/oauth2/v2/auth'
const client_id = '1058157169427-lfobns7gv3pp13md7adtc9g2c3jgg7qn.apps.googleusercontent.com'
const client_secret = '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'
const response_type = 'code'
const scopes = ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']
const redirect_uri ='http://localhost:3000/auth/cb'
const axios = require('axios');
app.get("/auth",async (req,res) => {
    const queries = new URLSearchParams({
        response_type,
        redirect_uri,
        client_id,
        scope: scopes.join(' ')
    })
    res.redirect(`${urlGG}?${queries.toString()}`);
})
const grant_type = 'authorization_code'
app.get("/auth/cb",async (req,res) => {
    let code = req.query.code
    console.log(code)
    const options = {
        code,
        grant_type,
        client_id,
        client_secret,
        redirect_uri
    }
    const rs = await fetch('https://accounts.google.com/o/oauth2/token',{
        method: 'post',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(options)
    })

    //test 
    
    const data = await rs.json();
    const userDataJson = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?al=json&access_token=${data.access_token}`,{
        headers: {
            Atuthoriaztion: `Bearer ${data.id_token}`
        }
    })
    
    const userData = await userDataJson.json();
    console.log(userData)
    
    console.log(data)
    console.log(jwt.decode(data.id_token))
    res.send("end")
})



app.listen(port,() => {
    console.log("Server is runing on port: " + port)
})