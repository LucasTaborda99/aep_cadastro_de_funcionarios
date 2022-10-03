const {MongoClient, ObjectId} = require('mongodb')
const express = require('express')

const multer = require('multer')
upload = multer()

const sanitizeHTML = require('sanitize-html')
const fse = require('fs-extra')
const sharp = require('sharp')

const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))
let db
const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const FuncionarioCard = require('./src/components/FuncionarioCard').default

fse.ensureDirSync(path.join("public", "uploaded-photos"))

const db_user = 'aep'
const db_password = encodeURIComponent('aep')
const uri = `mongodb+srv://${db_user}:${db_password}@aep.3myjgmm.mongodb.net/?retryWrites=true&w=majority`
const database = `mongodb+srv://${db_user}:${db_password}@aep.3myjgmm.mongodb.net/Aep`

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const passwordProtected = (req, res, next) => {
    res.set("WWW-Authenticate", "Basic realm='Aep")
    if (req.headers.authorization == 'Basic YWVwOmFlcA==') {
        next()
    } else {
        console.log(req.headers.authorization)
        res.status(401).send('Tente novamente')
    }
}

app.get('/', async (req, res) => {
    const allFuncionarios = await db.collection('funcionarios').find().toArray()
    const generatedHTML = ReactDOMServer.renderToString(
        <div className="container">
                {!allFuncionarios.length && <p>Não possui nenhum funcionário na lista ainda, o administrador precisa adicionar.</p>}
            <div className="funcionario-grid mb-3">
                {allFuncionarios.map(funcionario => <FuncionarioCard key={funcionario._id} name={funcionario.name} funcao={funcionario.funcao} photo={funcionario.photo} id={funcionario._id} readOnly={true} />)}
            </div>
            <p><a href="/admin">Login / Gerenciar a lista de funcionários.</a></p>
        </div>
    )
    res.render('home', { generatedHTML })
})

app.use(passwordProtected)

app.get('/admin', (req, res) => {
    res.render('admin')
})

app.get('/api/funcionarios', async (req, res) => {
    const allFuncionarios = await db.collection('funcionarios').find().toArray()
    res.json(allFuncionarios)
})

app.post('/create-funcionario', upload.single('photo'), limparData, async (req, res) => {
    if(req.file) {
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename
    }
    console.log(req.body)
    const info = await db.collection('funcionarios').insertOne(req.cleanData)
    const newFuncionario = await db.collection('funcionarios').findOne({_id: new ObjectId(info.insertedId)})
    res.send(newFuncionario)
})

app.delete('/funcionario/:id', async (req, res) => {
    if (typeof req.params.id != 'string') req.params.id = ""
    const doc = await db.collection('funcionarios').findOne({_id: new ObjectId(req.params.id)})
    if (doc.photo) {
        fse.remove(path.join('public', 'uploaded-photos', doc.photo))
    }
    db.collection('funcionarios').deleteOne({_id: new ObjectId(req.params.id)})
    res.send('Good job')
})

app.post('/update-funcionario', upload.single('photo'), limparData, async (req, res) => {
    if (req.file) {
        const photofilename = `${Date.now()}.jpg`
        await sharp(req.file.buffer).resize(844, 456).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photofilename))
        req.cleanData.photo = photofilename
        const info = await db.collection('funcionarios').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        if (info.value.photo) {
            fse.remove(path.join('public', 'uploaded-photos', info.value.photo))
        }
        res.send(photofilename)
    } else {
        db.collection('funcionarios').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
        res.send(false)
    }
})

function limparData(req, res, next) {
    if (typeof req.body.name != "string") req.body.name = ""
    if (typeof req.body.funcao != "string") req.body.funcao = ""
    if (typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        name: sanitizeHTML(req.body.name.trim(), {aloowedTags: [], allowedAttributes: {}}),
        funcao: sanitizeHTML(req.body.funcao.trim(), {aloowedTags: [], allowedAttributes: {}}),
    }

    next()
}

async function start() {
    const client = new MongoClient(database)
    try {
        await client.connect()
            db = client.db()
            console.log('Connected to MongoDB')
        } catch (error) {
            console.error(error)
        }
            app.listen(3000, () => {
                console.log('Server started on port 3000')
            })
}
start()