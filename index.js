const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const mongoose = require('mongoose');
const Product = require('./dao/models/product');
const Cart = require('./dao/models/cart');
const productsRouter = require('./rutas/products');
const cartsRouter = require('./rutas/carts');
const port = 3000;

// Configurar vistas
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const viewsRouter = require('./routes/views');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


// Configuración de Mongoose y conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/tu_basededatos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conexión a MongoDB exitosa');
}).catch(error => {
  console.error('Error al conectar a MongoDB:', error);
});

// Configuración de Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configuración de vistas con Handlebars
app.set('view engine', 'handlebars');
app.engine('handlebars', require('express-handlebars')());

// Configuración de Socket.io
io.on('connection', socket => {
  console.log('Usuario conectado');

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Rutas
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);

// Inicio del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
