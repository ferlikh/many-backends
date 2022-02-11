const Utils = require('./utils');
const QUERY_OPS = ['=', '!=', '<', '>', '<=', '>=', 'like']

class Query {
    static async query(pool, stmt, params = []) {
        let result;
        const client = await pool.connect();
        
        // console.debug({ stmt });
        try {
            result = await client.query(stmt, params);
        }
        catch(err) { return [err, undefined] }
        finally {
            client.release();
        }
        
        return [undefined, result];
    }
    static async findOne(pool, opts) {
        const result = await this.#select(pool, { ...opts, limit: 1 }); 
        return result?.rows?.at(0);
    }
    static async findMany(pool, opts) {
        const result = await this.#select(pool, opts);
        return result?.rows;
    }
    static async createOne(pool, opts) {
        const result = await this.#insert(pool, opts);
        return result?.rows?.at(0);
    }
    static async updateOne(pool, opts) {
        const where = { id: opts.model.id };
        const result = await this.#update(pool, { ...opts, where });
        return result?.rows?.at(0);
    }
    static async deleteOne(pool, opts) {
        const result = await this.#delete(pool, opts);
        return result?.rows?.at(0);
    }

    static #resolve_predicate_value(value) {
        // assume equality is the op as shorthand
        if(typeof value !== 'object') return { op: '=', value };

        const keys = Object.keys(value);
        if(keys.length > 1) throw new Error('Field-level predicate should have one key');
        else if(!QUERY_OPS.includes(keys[0])) throw new Error('Unsupported query op in predicate');

        const op = keys[0];
        return { op, value: value[op] };
    }
    static #where(pred = {}, params = []) {
        let expr = '';
        Object.keys(pred).forEach(key => {
            if (expr) expr += ` and `
            const { op, value } = this.#resolve_predicate_value(pred[key]);
            const param =  `$${params.length + 1}`;
            expr += `${key} ${op} ${param}`;
            params.push(value);
        });
        if(expr) expr = `where ${expr}`;
        return { expr, params }
    }
    static #limit(limit, params) {
        if(limit && limit > 0) {
            params.push(limit.toString());
            return `limit $${params.length}`
        }
        else {
            return ''
        }
    }
    static #param_expr(obj, columns, key_transform) {
        const params = [];
        let expr = '';
        columns.forEach(key => {
            const value = obj[key];
            const param = key_transform(key, params.length, params);
            if(params.length > 0) expr += ', ';
            expr += param;
            params.push(value);
        })
        return { expr, params };
    }

    static async #select(pool, opts) {
        const { table } = opts;
        const { expr: where, params } = this.#where(opts.where);
        const limit = this.#limit(opts.limit, params);
      
        const sql = `select * from ${table} ${where} ${limit}`;
        const [err, result] = await this.query(pool, sql, params);

        if(err) throw Error(err);
        return result;
    }
    static async #insert(pool, opts) {
        const { table, model } = opts;
        const formatted_model = Utils.formatModel(model);
        const columns = Object.keys(formatted_model);
        const { expr, params } = this.#param_expr(formatted_model, columns, (key, i) => `$${i + 1}`);

        const sql = `insert into ${table} (${columns.join(', ')}) values (${expr}) returning *`;
        const [err, result] = await this.query(pool, sql, params);

        if(err) throw new Error(err);
        return result;
    }
    static async #update(pool, opts) {
        const { table, model } = opts;
        const formatted_model = Utils.formatModel(model);
        const columns = Object.keys(formatted_model);
        const { expr: set, params } = this.#param_expr(formatted_model, columns, (key, i) => `${key}=$${i + 1}`);
        const { expr: where } = this.#where(opts.where, params);

        const sql = `update ${table} set ${set} ${where} returning *`;
        const [err, result] = await this.query(pool, sql, params);

        if(err) throw new Error(err);
        return result;
    }
    static async #delete(pool, opts) {
        const { table } = opts;
        const { expr: where, params } = this.#where(opts.where);

        const sql = `delete from ${table} ${where} returning *`;
        const [err, result] = await this.query(pool, sql, params);

        if(err) throw new Error(err);
        return result;
    }
}

module.exports = Query;