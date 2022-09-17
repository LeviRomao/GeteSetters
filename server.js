const bodyparser = require('body-parser');
const express= require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const bcrypt = require('bcrypt');
const user_login = require('./models/conexao');

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.get('/', async (req,res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
    
});

app.post('/', async (req,res)=>{
    
    const user = await user_login.findOne(
    {
        attributes: ['name','email','password'],
        where:
        {
            email: req.body.email,
            password: req.body.senha,
        }
    });
    console.log(user.password)
});

app.post('/registrar', async (req,res) =>{
    res.sendFile(path.join(__dirname, 'public', 'cadastro.html'));
    const dados = req.body
    dados.senha = await bcrypt.hash(dados.senha, 8);
    console.log(req.body);
    user_login.create(
        {
            name: dados.nome,
            password: dados.senha,
            email: dados.email
        })
    .then(() =>{
        res.sendFile(path.join(__dirname, "public", "chat.html"))
        console.log('Usuario cadastrado com sucesso')})
    .catch((err) => console.log(err))
});

app.get('/public/chat.html', (req,res)=>{
    console.log(req.query / req.body);
    res.render('index.html')
})

server.listen(8080, console.log('Server is running'));