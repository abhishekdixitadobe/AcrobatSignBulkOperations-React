const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDocument = require('./swaggerDoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title:'Project Dragonfly APIs',
            version:'1.0.0'
        }
    },
    apis:['../server.js'],
}

const swaggerDocs = swaggerJSDoc(swaggerOptions);
swaggerDocs.paths = { ...swaggerDocs.paths, ...swaggerDocument };

module.exports = swaggerDocs;
