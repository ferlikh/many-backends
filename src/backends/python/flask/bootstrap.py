import os

BASE_DIR = os.path.realpath(os.path.dirname(__file__) + '/../../../..')
FRONTEND_DIR = os.path.realpath(BASE_DIR + '/src/frontend')

FLASK_APP = 'index'
FLASK_ENV = 'dev'
FLASK_RUN_HOST = '127.0.0.1'
FLASK_RUN_PORT = os.environ['API_PORT']

os.putenv('FLASK_APP', 'index2')

with open(os.path.realpath(BASE_DIR + '/.env'), 'r+') as env:
    data = env.read()

    env.seek(0)
    data = data \
        .replace('BASE_DIR=.', f'BASE_DIR={BASE_DIR}') \
        .replace('FRONTEND_DIR=src/frontend', f'FRONTEND_DIR={FRONTEND_DIR}')

    if('FLASK_' not in data):
        data += '\n\n'
        data += f'FLASK_APP={FLASK_APP}\n'
        data += f'FLASK_ENV={FLASK_ENV}\n'
        data += f'FLASK_RUN_HOST={FLASK_RUN_HOST}\n'
        data += f'FLASK_RUN_PORT={FLASK_RUN_PORT}\n'

    env.write(data)
    env.truncate()