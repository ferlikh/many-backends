const express = require('express');
const bodyParser = require('body-parser');

function appFactory() {
    const app = express();

    // allows for extended predicates in query param
    // ex: /table?id[>]=1&text[like]=xyz%
    // const extended = true;
    // app.use(bodyParser.urlencoded({ extended }));
    app.use(bodyParser.json());

    // frontend assets
    app.use(express.static(process.env.FRONTEND_DIR));

    // api routes
    require('./router')(app);

    if(process.env.DEBUG) {
        console.log(`Running on http://127.0.0.1:${process.env.API_PORT}/`, '\n')
        require('../debug').printAllRoutes(app);
    }

    return app;
}

module.exports = appFactory;