import os
import psycopg2
import psycopg2.extras
from flask import g

from core import utils

DB_HOST = os.environ['DB_HOST']
DB_NAME = os.environ['DB_NAME']
DB_USER = os.environ['DB_USER']
DB_PASS = os.environ['DB_PASS']

def get_conn():
    if 'conn' not in g:
        # get a connection, if a connect cannot be made an exception will be raised here
        g.conn = psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASS)
        g.conn.set_session(autocommit=True)
    return g.conn

def close_conn(e=None):
    conn = g.pop('conn', None)

    if conn is not None:
        conn.close()

def execute(query, vars=None):
    conn = get_conn()

    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor)

    # execute our Query
    cursor.execute(query, vars)

    return cursor

QUERY_OPS = ['=', '!=', '<', '>', '<=', '>=', 'like']

def resolve_predicate(value):
    # assume equality if value is not an object
    if type(value) is not dict: return ('=', value)

    op = list(value.keys())[0]
    if op not in QUERY_OPS: raise Exception('InvalidOperation: query op must be one of ' + ', '.join(QUERY_OPS))
    
    return (op, value[op])

def resolve_where(where_obj):
    expr = ''
    params = []
    for key in where_obj.keys():
        if expr: expr += ' and '
        op, value = resolve_predicate(where_obj[key])
        expr += f'{key} {op} %s'
        params.append(value)
    if expr: expr = f'where {expr}'
    return (expr, params)

def select(table, where=None, limit=None):
    where, vars = resolve_where(where) if where else ('', [])
    limit = f'limit {limit}' if limit is not None else ''
    return execute(f'select * from {table} {where} {limit}', vars=vars)
    
def find_one(table, where=None):
    return select(table, where, limit=1).fetchone()

def find_many(table, where=None, limit=None):
    return select(table, where, limit).fetchall()

def insert(table, model):
    formatted_model = utils.format_model(model)
    columns = formatted_model.keys()
    vars = list(formatted_model.values())
    values = ', '.join(['%s'] * len(vars))
    return execute(f'insert into {table} ({",".join(columns)}) values ({values}) returning *', vars=vars)

def create_one(table, model):
    return insert(table, model).fetchone()

def update(table, model, where=None):
    formatted_model = utils.format_model(model)
    values = ", ".join([f'{k}=%s' for k in formatted_model.keys()])
    vars = list(formatted_model.values())
    where, where_vars = resolve_where(where) if where else ('', [])
    vars += where_vars
    return execute(f'update {table} set {values} {where} returning *', vars=vars)

def update_one(table, model):
    return update(table, model, where={ 'id': model['id'] }).fetchone()

def delete(table, where=None):
    where, vars = resolve_where(where) if where else ('', [])
    return execute(f'delete from {table} {where} returning *', vars)

def delete_one(table, id):
    return delete(table, where={ 'id': id }).fetchone()