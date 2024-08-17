const express = require('express')
const router = express.Router()

const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const bucket = require('../Firebase/config')

//multer configs para o firebase
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.get('/', async (req, res) => {
    let data = await User.find()
    res.send(data)
})

router.post('/signUp', async (req, res) => {

    const selected_user = await User.findOne({ email: req.body.email })
    if (selected_user) {
        return res.status(400).send('E-mail já cadastrado!')
    }

    let user = new User({
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    })

    try {
        await user.save()
        res.send('Usuário cadastrado!')
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async (req, res) => {
    const selected_user = await User.findOne({ email: req.body.email })
    if (!selected_user) {
        return res.status(404).send('Email ou Senha digitados incorretamente!')
    }

    const userAndPasswordMatch = bcrypt.compareSync(req.body.password, selected_user.password)
    if (!userAndPasswordMatch) {
        return res.status(404).send('Email ou Senha digitados incorretamente!')
    }

    const token = jwt.sign({ id: selected_user._id, }, process.env.TOKEN_SECRET, { expiresIn: '2h' })


    try {
        res.send({
            _id: selected_user._id,
            name: selected_user.name,
            address: selected_user.address,
            email: selected_user.email,
            cart: selected_user.cart,
            purchases: selected_user.purchases,
            profileImg: selected_user.profileImg,
            token
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/update', upload.single('profileImg'), async (req, res) => {
    const id = { _id: req.body.id };
    const file = req.file;

    try {
        if (file) {
            // Configurar nome para o arquivo file
            const filename = `users/${req.body.id}/${file.originalname}`;
            const blob = bucket.file(filename);
            const blobStream = blob.createWriteStream({ metadata: { contentType: file.mimetype } });

            // Tratativa de erro para o file
            blobStream.on('error', (error) => {
                return res.status(500).send('Erro ao fazer upload da imagem.');
            });

            // Update do usuário com a URL da foto no storage
            blobStream.on('finish', async () => {
                await blob.makePublic();
                const profileImg = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                await User.findByIdAndUpdate(id, {
                    name: req.body.name,
                    address: req.body.address,
                    profileImg
                });

                res.send('Usuário atualizado!');
            });

            blobStream.end(file.buffer);

        } else {
            await User.findByIdAndUpdate(id, {
                name: req.body.name,
                address: req.body.address
            });
            res.send('Usuário atualizado');
        }
    } catch (error) {
        res.status(400).send('Não foi possível atualizar');
    }
});

module.exports = router