const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Importa el paquete cors
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3306;

app.use(cors()); // Permite CORS en todas las rutas

const connection = mysql.createConnection({
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
});

connection.connect();

app.get('/', (req, res) => {
  const query = 'SELECT id_usuario, usuario, passw, fk_servicio_contratado, fk_tipo_usuario FROM Usuario';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

app.get('/admin', (req, res) => {
  const query = 'select Cliente.apellido,Cliente.nombreCliente,Cliente.telefono,PaqueteServicio.nombre,EstadoServicio.estado from Cliente inner join Usuario on Usuario.id_usuario = Cliente.fk_usuario inner join Servicio on Usuario.fk_servicio_contratado = Servicio.id_servicio inner join PaqueteServicio on PaqueteServicio.id_paquete = Servicio.fk_paquete inner join EstadoServicio on EstadoServicio.id_estado_servicio = Servicio.fk_estado_servicio;';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

app.get('/alumno', (req, res) => {
  const query = 'select Cliente.id_cliente, Cliente.apellido,Cliente.nombreCliente,Cliente.telefono from Cliente';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

app.listen(port, () => {
  console.log(`Servidor de desarrollo escuchando en port: ${port}`);
});

