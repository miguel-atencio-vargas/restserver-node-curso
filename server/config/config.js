//===========================
// Puerto
//===========================
process.env.PORT = process.env.PORT || 3000;

//===========================
// Entorno  para saber si estoy en desarrollo o en produccion
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// Vencimiento del token
//===========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
//===========================
// SEED de autenticacion
//===========================

process.env.SEED = process.env.SEED || 'este es el SEED de desarrollo';
//===========================
// Base de datos
//===========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafeDB';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = urlDB;

//===========================
// Google client ID
//===========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '471918711005-o6bto2qts4l0bcqqb2d952vj0ab9kvk2.apps.googleusercontent.com';