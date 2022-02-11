const express = require('express');
const controllers = require('./controllers');

const HTTP_METHOD = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
}
const { REST_METHOD } = controllers;

const route_schema = {
    [HTTP_METHOD.GET]: {
        '/':    REST_METHOD.GET_ALL,
        '/:id': REST_METHOD.GET_BY_ID
    },
    [HTTP_METHOD.POST]: {
        '/':    REST_METHOD.CREATE_ONE,
    },
    [HTTP_METHOD.PUT]: {
        '/:id': REST_METHOD.UPDATE_ONE,
    },
    [HTTP_METHOD.DELETE]: {
        '/:id': REST_METHOD.DELETE_ONE
    }
}

module.exports = app => {
    Object.values(controllers).forEach(controller => {
        if(controller === REST_METHOD) return;
        const router = express.Router();
        Object.keys(route_schema).forEach(action => {
            Object.keys(route_schema[action]).forEach(path => {
                const method = route_schema[action][path];
                router[action](path, controller[method]);
            });
        });
        app.use(`/${controller.repo.table}`, router);
    });
};