const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3306;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_ADDON_HOST,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  database: process.env.MYSQL_ADDON_DB,
  port: process.env.MYSQL_ADDON_PORT,
});

app.get('/', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json(err);
    }
    const query = 'SELECT id_usuario, usuario, passw, conectado FROM Usuario;';
    connection.query(query, (error, results) => {
      connection.release();
      if (error) {
        return res.status(500).json(error);
      }
      res.status(200).json(results);
    });
  });
});

app.get('/admin', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json(err);
    }
    const query = 'select id_cliente,apellido,Cliente.nombreCliente,edad,dni,correo,telefono,pais,provincia,departamento,localidad,calle,numero,piso,dpto,Usuario.usuario,Usuario.passw,Usuario.fecha_inicio,Usuario.fecha_fin,Usuario.estado,Servicio.nombre,Servicio.precio from Cliente inner join Usuario on Usuario.id_usuario = Cliente.fk_usuario inner join Servicio on Usuario.fk_servicio_contratado = Servicio.id_servicio order by Cliente.id_cliente;';
    connection.query(query, (error, results) => {
      connection.release();
      if (error) {
        return res.status(500).json(error);
      }
      res.status(200).json(results);
    });
  });
});

app.post('/agregar_usuario_cliente', (req, res) => {
  const datos = req.body;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión:', err);
      return res.status(500).json(err);
    }

    connection.beginTransaction(error => {
      if (error) {
        connection.release();
        console.error('Error al iniciar la transacción:', error);
        return res.status(500).json({ error: error.message });
      }

      const queryUsuario = `INSERT INTO Usuario VALUES (${parseInt(datos.id)}, "${datos.usu}", "${datos.pass}", "${datos.fechaInicio}", "${datos.fechaFin}", "${datos.estado}", ${parseInt(datos.plan)}, 0);`;

      connection.query(queryUsuario, (error, results) => {
        if (error) {
          return connection.rollback(() => {
            connection.release();
            console.error('Error en la consulta de Usuario:', error);
            return res.status(500).json({ error: error.message });
          });
        }

        const queryCliente = `INSERT INTO Cliente VALUES (${parseInt(datos.id)}, "${datos.ape}", "${datos.nom}", ${parseInt(datos.ed)}, ${parseInt(datos.dni)}, "${datos.mail}", ${parseInt(datos.tel)}, "${datos.pais}", "${datos.prov}", "${datos.dep}", "${datos.loc}", "${datos.calle}", ${parseInt(datos.num)}, ${parseInt(datos.piso)}, "${datos.dpto}", ${parseInt(datos.id)});`;

        connection.query(queryCliente, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error en la consulta de Cliente:', error);
              return res.status(500).json({ error: error.message });
            });
          }

          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error al hacer commit:', error);
                return res.status(500).json({ error: error.message });
              });
            }

            connection.release();
            res.status(200).json({ message: 'Datos de Usuario y Cliente insertados exitosamente' });
          });
        });
      });
    });
  });
});

app.put('/actualizar_usuario_cliente', (req, res) => {
  const datos = req.body;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión:', err);
      return res.status(500).json(err);
    }

    connection.beginTransaction(error => {
      if (error) {
        connection.release();
        console.error('Error al iniciar la transacción:', error);
        return res.status(500).json({ error: error.message });
      }

      const queryUsuario = `
        UPDATE Usuario
        SET usuario = "${datos.usu}", passw = "${datos.pass}", fecha_inicio = "${datos.fechaInicio}", fecha_fin = "${datos.fechaFin}", estado = "${datos.estado}", fk_servicio_contratado = ${parseInt(datos.plan)}
        WHERE id_usuario = ${parseInt(datos.id)};
      `;

      connection.query(queryUsuario, (error, results) => {
        if (error) {
          return connection.rollback(() => {
            connection.release();
            console.error('Error en la consulta de Usuario:', error);
            return res.status(500).json({ error: error.message });
          });
        }

        const queryCliente = `
          UPDATE Cliente
          SET apellido = "${datos.ape}", nombreCliente = "${datos.nom}", edad = ${parseInt(datos.ed)}, dni = ${parseInt(datos.dni)}, correo = "${datos.mail}", telefono = ${parseInt(datos.tel)}, pais = "${datos.pais}", provincia = "${datos.prov}", departamento = "${datos.dep}", localidad = "${datos.loc}", calle = "${datos.calle}", numero = ${parseInt(datos.num)}, piso = ${parseInt(datos.piso)}, dpto = "${datos.dpto}"
          WHERE fk_usuario = ${parseInt(datos.id)};
        `;

        connection.query(queryCliente, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error en la consulta de Cliente:', error);
              return res.status(500).json({ error: error.message });
            });
          }

          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error al hacer commit:', error);
                return res.status(500).json({ error: error.message });
              });
            }

            connection.release();
            res.status(200).json({ message: 'Datos de Usuario y Cliente actualizados exitosamente' });
          });
        });
      });
    });
  });
});

app.delete('/eliminar_usuario_cliente', (req, res) => {
  const { id_cliente } = req.body;
  console.log(id_cliente)

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión:', err);
      return res.status(500).json(err);
    }

    connection.beginTransaction(error => {
      if (error) {
        connection.release();
        console.error('Error al iniciar la transacción:', error);
        return res.status(500).json({ error: error.message });
      }

      const queryEliminarCliente = `delete from Cliente where id_cliente = ${parseInt(id_cliente)};`;
      const queryEliminarUsuario = `delete from Usuario where id_usuario = ${parseInt(id_cliente)};`;

      connection.query(queryEliminarCliente, (error, results) => {
        if (error) {
          return connection.rollback(() => {
            connection.release();
            console.error('Error en la consulta de Cliente:', error);
            return res.status(500).json({ error: error.message });
          });
        }

        connection.query(queryEliminarUsuario, (error, results) => {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error en la consulta de Usuario:', error);
              return res.status(500).json({ error: error.message });
            });
          }

          connection.commit(error => {
            if (error) {
              return connection.rollback(() => {
                connection.release();
                console.error('Error al hacer commit:', error);
                return res.status(500).json({ error: error.message });
              });
            }

            connection.release();
            res.status(200).json({ message: 'Usuario y Cliente eliminados exitosamente' });
          });
        });
      });
    });
  });
});

app.put('/actualizar_login', (req, res) => {
  const datos = req.body;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión:', err);
      return res.status(500).json(err);
    }

    connection.beginTransaction(error => {
      if (error) {
        connection.release();
        console.error('Error al iniciar la transacción:', error);
        return res.status(500).json({ error: error.message });
      }

      const queryUsuario = `
        UPDATE Usuario
        SET conectado = "${parseInt(datos.conectado)}"
        WHERE id_usuario = ${parseInt(datos.id)};
      `;

      connection.query(queryUsuario, (error, results) => {
        if (error) {
          return connection.rollback(() => {
            connection.release();
            console.error('Error en la consulta de Usuario:', error);
            return res.status(500).json({ error: error.message });
          });
        }

        connection.commit(error => {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              console.error('Error al hacer commit:', error);
              return res.status(500).json({ error: error.message });
            });
          }

          connection.release();
          res.status(200).json({ message: 'Datos de Usuario y Cliente actualizados exitosamente' });
        });
      });
    });
  });
});


app.listen(port, () => {
  console.log(`Servidor de desarrollo escuchando en port: ${port}`);
});