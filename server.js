// configurar server
const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true}))

// configurar a conexão com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'P@ssw0rd',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

// configurando a template engine
const nunjucks = require ("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// configurar pagina
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro de Banco de Dados")
        // if (err) console.log (err)

        const donors = result.rows
        return res.render("index.html", { donors } )
    })

    
})

server.post("/", function(req,res) {
    
    // PEGAR DADOS DO FORMULARIO
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {

        return res.send("Todos os campos são obrigatórios")
    }

    // COLOCO VALORES DENTRO DO BD
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`
    
    db.query(query, [name, email, blood], function(err) {
        if (err) return res.send ("Erro no banco de dados")

        return res.redirect("/")
    })


})


// ligar server e acesso via porta 3000
server.listen(3000, function() {
    console.log("iniciei o server")
})