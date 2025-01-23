const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3306;

app.use(cors());

app.use(express.json());

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

app.post('/agregar_alumno', (req,res)=>{
  const datos = req.body;
  const query = "insert into Cliente values()";

  connection.query(query, datos, (error, results) => {
    if (error){
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Datos recibidos e insertados', id: results.insertId });
  });
});

app.listen(port, () => {
  console.log(`Servidor de desarrollo escuchando en port: ${port}`);
});

