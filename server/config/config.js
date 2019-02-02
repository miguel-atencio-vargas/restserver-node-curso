//===========================
// Puerto
//===========================
process.env.PORT = process.env.PORT || 3000;

//===========================
// Entorno  para saber si estoy en desarrollo o en produccion
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Base de datos
//===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeDB';
} else {
    urlDB = 'mongodb://cafe-usuario:skyfall947@ds219055.mlab.com:19055/cafedb';
}

process.env.URL_DB = urlDB;