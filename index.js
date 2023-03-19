const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const app = express();
const port = 3000; // Puerto en el que se ejecutará el servidor

// Configuración de Handlebars
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// Configuración de bodyParser
app.use(bodyParser.urlencoded({ extended: false }));

const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Anahata4',
    port: 5432,
    database: 'modulo_5_leccion_1_ejercicio_1'
});

// Endpoint para mostrar la página principal
app.get('/', (req, res) => {
  pool.query('SELECT * FROM clientes', (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      res.render('home', { clientes: results.rows });
    }
  });
});

// Endpoint para crear un nuevo registro
app.post('/clientes', (req, res) => {
  const { nombre, rut, edad } = req.body;

  if (!nombre || !rut || !edad) {
    res.status(400).send('Faltan datos obligatorios');
  } else {
    pool.query('INSERT INTO clientes (nombre, rut, edad) VALUES ($1, $2, $3)', [nombre, rut, edad], (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.redirect('/');
      }
    });
  }
});

// Endpoint para modificar un registro

app.post('/clientes/modificar', (req, res) => {
    const { rut, nombre, 'nombre-actual': nombreActual } = req.body;
  
    if (!rut || !nombre || !nombreActual) {
      res.status(400).send('Faltan datos obligatorios');
    } else {
      pool.query('UPDATE clientes SET nombre = $1 WHERE rut = $2 AND nombre = $3', [nombre, rut, nombreActual], (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.redirect('/');
        }
      });
    }
});

// Endpoint para eliminar un registro
app.post('/clientes/eliminar', (req, res) => {
    const rut = req.body.rut;
  
    if (!rut) {
      res.status(400).send('Falta el RUT del cliente a eliminar');
    } else {
      pool.query('DELETE FROM clientes WHERE rut = $1', [rut], (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.redirect('/');
        }
      });
    }
  });
  


// Inicialización del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
