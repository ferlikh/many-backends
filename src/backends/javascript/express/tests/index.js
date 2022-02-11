const fs = require('fs');
const expect = require('chai').expect;
const request = require('supertest');

const createApp = require('../core/app');
const config = require('../core/config');
const Utils = require('../core/utils');
const ModuleTestSuite = require('./modules');


function testRecord(columns, value) {
    return columns.reduce((model, k) => {
        model[k] = value;
        return model;
    }, {});
}

describe('API Server', async function () {

    const app = createApp()
    let server;

    beforeEach(async () => server = app.listen());
    afterEach(async () => server.close());

    describe('index', function () {
        it('should return the index', async () => {
            request(app)
                .get('/')
                .expect('Content-Type', /text\/html/)
                .expect(200, function (err, res) {
                    if (err) throw new Error(err);

                    const source = fs.readFileSync(process.env.FRONTEND_DIR + '/index.html').toString();
                    expect(res.text).to.equal(source, 'expect response text to be index.html');

                });
        });
    });


    const { modules } = config;
    for (const module of modules) {

        let columns, id, model;

        const assert_id = () => expect(id, 'should have an id').to.not.be.undefined;
        const suite = new ModuleTestSuite(app, module);

        describe(`${module}: CRUD`, async () => {
            describe('get records', async () => {
                it('should get all records', async () => {
                    const records = await suite.getAll();
                    columns = Object.keys(Utils.formatModel(records[0]));
                });
            });
            describe('create record', async () => {
                it('should create a record', async () => {
                    expect(columns, 'should have columns').to.not.be.undefined;
                    model = testRecord(columns, 'test X');

                    const result = await suite.createOne(model);
                    id = result.id;
                });
            });
            describe('get record', async () => {
                it('should get a record', async () => {
                    assert_id();
                    await suite.getOne(id);
                });
            });
            describe('update record', async () => {
                it('should update a record', async () => {
                    assert_id();
                    model = testRecord(columns, 'test Y');
                    await suite.updateOne({ ...model, id });
                });
            });
            describe('delete record', async () => {
                it('should delete a record', async () => {
                    assert_id();
                    await suite.deleteOne(id);
                });
            });
        });
    }


});