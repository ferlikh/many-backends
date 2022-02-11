import os
import flask

from core import (
    controllers, db, config
)

FRONTEND_DIR = os.environ['FRONTEND_DIR']

app = flask.Flask(__name__, static_url_path='/', static_folder=FRONTEND_DIR)

for module in config.modules:
    app.register_blueprint(getattr(controllers, module))

app.teardown_appcontext(db.close_conn)

@app.route("/")
def index():
    return flask.send_file(f'{FRONTEND_DIR}/index.html')

if __name__ == '__main__':
    app.run(host='localhost', port=os.environ['API_PORT'], debug=os.environ.get('DEBUG', False))