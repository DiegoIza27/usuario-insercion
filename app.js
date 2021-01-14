const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const User = require('./public/user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect('mongodb://localhost:27017/practica', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.post('/registrar', (req, res) => {
    const { username, pasword } = req.body
    const user = new User({ username, pasword })
    user.save(err => {
        if (err) {
            res.status(500).send('ERROR AL REGISTRAR AL USUARIO')
        } else {
            res.status(200).send('Usuario Registrado')
        }
    })
})
app.post('/auteticacion', (req, res) => {
    const { username, pasword } = req.body
    User.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).send('ERROR AL AUTENTICAR AL USUARIO ')
        } else if (!user) {
            res.status(500).send('El usuario no existe  ')
        } else {
            user.isCorrectoPasword(pasword, (err, resol) => {
                if (err) {
                    res.status(500).send('ERROR AL AUTENTICAR')
                } else if (resol) {
                    res.status(200).send('Usuario autenticado correctamento   ')
                } else {
                    res.status(500).send('Usuario Y/O contraseña incorrecta  ')
                }
            });
        }
    })
})


app.listen(3000, () => {
    console.log('escuchando en el puerto 3000')
})
module.exports = {
    app
}