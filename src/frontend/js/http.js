var BASE_URL = window.location.href
var http = {
    request: function(method, route, body) {
        return new Promise(function(resolve, reject) {
            var request = new XMLHttpRequest();
            request.responseType = 'json';
            request.onreadystatechange = function() {
                if(this.readyState == 4 && request.status == 200) {
                    // var json = JSON.parse(request.responseText);
                    resolve(request.response);
                }
                else if(this.readyState == 4) reject(request);
            }
            request.open(method, BASE_URL + route, true);
            
            var params = null;
            if(method == 'POST' || method == 'PUT') {
                request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                params = JSON.stringify(body);
                // params = http.parameterize(body);
            }
            
            request.send(params);
        });
    },
    parameterize: function(body) {
        return Object.keys(body || {})
            .reduce((acc, field) => acc += (acc? acc + '&':'') + `${encodeURIComponent(field)}=${encodeURIComponent(body[field])}`, '');
    },
    delete: function(route) {
        return this.request('DELETE', route);
    },
    get: function(route) {
        return this.request('GET', route);
    },
    post: function(route, body) {
        return this.request('POST', route, body);
    },
    put: function(route, body) {
        return this.request('PUT', route, body);
    }
}