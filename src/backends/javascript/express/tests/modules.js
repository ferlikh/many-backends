var expect = require('chai').expect;
var request = require('supertest');

class ModuleTestSuite {
    constructor(app, module) {
        this.app = app;
        this.module = module;
    }

    getOne(id) {
        const { app, module } = this;
        return new Promise(resolve => {
            request(app)
                .get(`/${module}/${id}`)
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const result = res.body;
                    expect(result.id).to.equal(id);

                    resolve(result);
                });
        });
    }
    getAll() {
        const { app, module } = this;
        return new Promise(resolve => {
            request(app)
                .get(`/${module}`)
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const result = res.body;
                    expect(result).to.be.an('array');
                    expect(result).to.not.have.lengthOf(0);

                    resolve(result);
                });
        });
    }
    createOne(model) {
        const { app, module } = this;
        return new Promise(resolve => {
            request(app)
                .post(`/${module}`)
                .send(model)
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const result = res.body;
                    for (const field of Object.keys(model)) {
                        expect(result[field]).to.equal(model[field]);
                    }

                    resolve(result);
                });
        });
    }
    updateOne(model) {
        const { app, module } = this;
        return new Promise(resolve => {
            request(app)
                .put(`/${module}/${model.id}`)
                .send(model)
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const result = res.body;
                    for (const field of Object.keys(model)) {
                        expect(result[field]).to.equal(model[field]);
                    }

                    resolve(result);
                });
        });
    }
    deleteOne(id) {
        const { app, module } = this;
        return new Promise(resolve => {
            request(app)
                .delete(`/${module}/${id}`)
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const result = res.body;
                    expect(result.id).to.equal(id);

                    resolve(result);
                });
        });
    }
}

module.exports = ModuleTestSuite