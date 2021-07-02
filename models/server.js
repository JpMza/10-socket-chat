const express = require('express')
var cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const socketController = require('../socket/controller');


class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            users: '/api/users',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads'
        }

        //Conectar a la base de datos
        this.conectarDb();
        //Middlewares
        this.middlewares()
        //Rutas de mi app
        this.routes();

        this.sockets();
    }

    async conectarDb() {
        await dbConnection();
    }

    middlewares() {
        this.app.use(cors())

        //Body Parse and reading
        this.app.use(express.json());

        //directorio Publico
        this.app.use(express.static('public'));

        this.app.use(fileUpload({
            useTempFiles: true,
            tempDirFile: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/user'));
        this.app.use(this.paths.categories, require('../routes/category'));
        this.app.use(this.paths.products, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.uploads, require('../routes/upload'));

    }

    sockets() {
        this.io.on('connection',(socket) => socketController(socket,this.io))
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor corriendo en puerto", this.port);
        })
    }
}

module.exports = Server