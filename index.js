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
  const query = 'SELECT usuario, passw FROM Usuario;';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

app.get('/admin', (req, res) => {
  const query = 'select id_cliente,apellido,Cliente.nombreCliente,edad,dni,correo,telefono,pais,provincia,departamento,localidad,calle,numero,piso,dpto,Usuario.usuario,Usuario.passw,Usuario.fecha_inicio,Usuario.fecha_fin,Usuario.estado,Servicio.nombre,Servicio.precio from Cliente inner join Usuario on Usuario.id_usuario = Cliente.fk_usuario inner join Servicio on Usuario.fk_servicio_contratado = Servicio.id_servicio order by Cliente.id_cliente;';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

app.get('/alumno', (req, res) => {
  const query = 'select id_cliente, apellido, nombreCliente, telefono from Cliente';
  connection.query(query, (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }
    res.status(200).json(results);
  });
});

/*
app.post('/agregar_usuario', (req, res) => {
  const datos = req.body;
  const query = `INSERT INTO Usuario VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [datos.id, datos.usu, datos.pass, datos.fechaInicio, datos.fechaF, datos.estado, datos.plan], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Datos recibidos e insertados', id: results.insertId });
  });
});

app.post('/agregar_alumno', (req, res) => {
  const datos = req.body;
  const query = `INSERT INTO Cliente VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [datos.id, datos.ape, datos.nom, datos.ed, datos.dni, datos.mail, datos.tel, datos.pais, datos.prov, datos.dep, datos.loc, datos.calle, datos.num, datos.piso, datos.dpto], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Datos recibidos e insertados', id: results.insertId });
  });
});*/



app.listen(port, () => {
  console.log(`Servidor de desarrollo escuchando en port: ${port}`);
});

