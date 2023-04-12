const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const conn = require('./database/mysql');

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/login",(req,res)=>{
    res.sendFile(__dirname+"/login.html");
})

app.get("/register",(req,res)=>{
    res.sendFile(__dirname+"/register.html");
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
} )

app.get("/welcome", (req, res) => {

    let user = req.cookies.name;

    if (user) {
        res.sendFile(__dirname + "/welcome.html"); 
    }
    else {
        res.redirect('/login');
    }

})

app.post('/register',(req,res)=>{
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;

    const myquery = `insert into class values("${name}","${password}","${email}")`;
     
    conn.query(myquery, (err,result)=>{
        if(err)
        {
            console.log(err);
            res.end();
        }
        else{
            res.redirect('/login');
            console.log(result);
        }
    })
})

app.post('/login',(req,res)=>{
    let name = req.body.name;
    let password = req.body.password;

    let myquery = `select * from class where name = "${name}" and password = "${password}"`;
    conn.query(myquery , (err,result)=>{
        if(err)
        {
            console.log(err);
            res.end();
        }

        else{
            if(result.length == 1)
            {
                res.cookie("name",name,
                {
                    maxage: 60*60*1000,
                    samesite: 'lax',
                    httpOnly:true
                })
                res.redirect("/welcome");
            }
            else{
                res.send(`<p>Invalid login credentials</p>
                <form action="/register" method="GET">
            <button type="submit">Register</button>
        </form>
        <form action="/login" method="GET">
            <button type="submit">Login</button>
        </form>`)
            }
        }
    })
})
app.post("/clear", (req, res) => {
    res.clearCookie('name');
    res.redirect("/");
})
app.get("*",(req,res)=>{
    res.send("error 404")
})
app.listen(8080, function(err){
    if(err)
        console.log(err);
    else
        console.log("Server started on port 8080");
})