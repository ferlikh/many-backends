from core import (
    config, repos, utils
)

from flask import (
    Blueprint, request, jsonify
)

def get_json():
    try:
        return request.get_json(force=True)
    except:
        return None

for module in config.modules:
    bp = Blueprint(module, module, url_prefix=f'/{module}')
    repo = getattr(repos, module)

    @bp.route('/', methods=['GET', 'POST'], strict_slashes=False)
    def base_route():
        data = get_json()
        if request.method ==  'GET':
            return jsonify(repo.find_many(data))
        elif request.method == 'POST':
            return jsonify(repo.create_one(data))

    @bp.route('/<id>', methods=['GET', 'PUT', 'DELETE'], strict_slashes=False)
    def route_by_id(id):
        if request.method ==  'GET':
            return jsonify(repo.find_one(where={ 'id': id }))
        elif request.method ==  'PUT':
            return jsonify(repo.update_one(dict(**utils.format_model(request.get_json()), id=id)))
        elif request.method == 'DELETE':
            return jsonify(repo.delete_one(id))

    globals()[module] = bp