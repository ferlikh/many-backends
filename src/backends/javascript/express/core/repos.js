const { Pool } = require('pg');
const Query = require('./query');
const { modules } = require('./config');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}

class DbRepo {
    constructor(pool, table) {
        this.pool = pool;
        this.table = table;
    }
    // query = async stmt => await Query.query(this.client, stmt);
    #formatOpts = opts => ({ ...opts, table: this.table });
    findOne = async opts => await Query.findOne(this.pool, this.#formatOpts(opts));
    findMany = async opts => await Query.findMany(this.pool, this.#formatOpts(opts));
    createOne = async model => await Query.createOne(this.pool, this.#formatOpts({ model }));
    updateOne = async model => await Query.updateOne(this.pool, this.#formatOpts({ model }));
    deleteOne = async id => await Query.deleteOne(this.pool, this.#formatOpts({ where: { id } }));
    
    get = async opts => await this.findMany(opts);
    getByID = async id => await this.findOne({ where: { id } });
}

const pool = new Pool(config);

const repos = {};
for(const module of modules) {
    repos[module] = new DbRepo(pool, module);
}

module.exports = repos;