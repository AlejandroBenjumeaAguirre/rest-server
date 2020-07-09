//===========================================
// Puerto
//===========================================

process.env.PORT = process.env.PORT || 3000;


//===========================================
// Entorno
//===========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================================
// Vencimiento del token
//===========================================
// 60 segundos
// 60 minutos
// 2 horas

process.env.VENCIMIENTO_TOKEN = 60 * 60 * 24 * 30;

//===========================================
// SEED de Authenticación
//===========================================

process.env.SEED = process.env.SEED || 'xxxxxx-xxxxxxx-xxxxxxxodhnoio';

//===========================================
// Base de datos
//===========================================   

let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//===========================================
// Google Client-ID
//===========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '1046677419081-i73kglfrlhvhmulevglqv2p6j753pm3h.apps.googleusercontent.com';
