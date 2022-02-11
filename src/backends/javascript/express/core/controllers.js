class RESTController {
    constructor(repo) {
        this.repo = repo;
    }

    createOne = async (req, res) => {
        return this.#json(res, await this.repo.createOne(req.body));
    }
    updateOne = async (req, res) => {
        const id = Number.parseInt(req.params.id);
        if(Number.isNaN(id)) {
            return res.status(400).send('Bad Request');
        }
        const model = { ...req.body, id };
        return this.#json(res, await this.repo.updateOne(model));
    }
    deleteOne = async (req, res) => {
        const id = this.#validateID(req, res);
        if(!id) return;
        return this.#json(res, await this.repo.deleteOne(id));
    }
    // get = async (req, res) => {
    //     return this.#json(res, await this.repo.get({ where: req.query }));
    // }
    getAll = async (req, res) => {
        return this.#json(res, await this.repo.get());
    }
    getByID = async (req, res) => {
        return this.#json(res, await this.repo.getByID(req.params.id));
    }
    
    #validateID(req, res) {
        const id = Number.parseInt(req.params.id);
        if(Number.isNaN(id)) {
            res.status(400).send('Bad Request');
            return false;
        }
        return id;
    }
    #json(res, value) {
        return res.json(value);
    }
}

const REST_METHOD = {
    // CREATE
    CREATE_ONE: 'createOne',
    // READ
    GET_ALL: 'getAll',
    GET_BY_ID: 'getByID',
    // UPDATE
    UPDATE_ONE: 'updateOne',
    // DELETE
    DELETE_ONE: 'deleteOne',
}

const controllers = {};
const repos = require('./repos');
for(const repo of Object.values(repos)) {
    controllers[repo.table] = new RESTController(repo);
}

module.exports = {
    REST_METHOD,
    ...controllers
}