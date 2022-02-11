import os
import pytest

from core import utils
from core.config import modules
from index import *

@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client

def index_test(client):
    res = client.get('/')
    with open(os.environ['FRONTEND_DIR'] + '/index.html', 'r', newline='') as index_file:
        source = index_file.read()
        assert source == res.get_data(as_text=True)

@pytest.mark.parametrize('module', modules)
def get_all_test(client, module):
    """Gets an array of records."""

    res = client.get(f'/{module}')

    # it should return a list
    assert isinstance(res.json, list)

def get_columns(client, module):
    if module not in globals():
        res = client.get(f'/{module}')
        items = res.json
        globals()[module] = { 'columns': items[0].keys() }
    return globals()[module]['columns']


@pytest.mark.parametrize('module', modules)
def get_columns_test(client, module):
    """Gets columns."""
    columns = get_columns(client, module)
    assert len(columns) > 0

def get_test_model(columns, value):
    return utils.format_model({ key: value for key in columns })

def get_test_id(module):
    return globals()[module]['id']

def set_test_id(module, value):
    globals()[module]['id'] = value

def assert_models_eq(a, b):
    for key in a.keys():
        assert a[key] == b[key]

@pytest.mark.parametrize('module', modules)
def create_one_test(client, module):
    """Posts a record."""
    columns = get_columns(client, module)
    model = get_test_model(columns, 'test X')
    res = client.post(f'/{module}', json=model)
    result = res.json
    set_test_id(module, result['id'])
    assert_models_eq(model, result)

@pytest.mark.parametrize('module', modules)
def update_one_test(client, module):
    """Puts a record."""
    columns = get_columns(client, module)
    model = dict(**get_test_model(columns, 'test Y'), id=get_test_id(module))
    res = client.put(f"/{module}/{model['id']}", json=model)
    assert_models_eq(model, res.json)
    
@pytest.mark.parametrize('module', modules)
def delete_one_test(client, module):
    """Deletes a record."""
    id = get_test_id(module)
    res = client.delete(f"/{module}/{id}")
    assert res.json['id'] == id
    