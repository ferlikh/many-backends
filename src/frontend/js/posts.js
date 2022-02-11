var Posts = (function() {
    function init(board) {
        // get all posts and render them on the grid
        http.get('posts').then(posts => {
            var grid = document.createElement('div');
            grid.className = 'grid';
            posts.forEach(post => {
                // create a row for each post
                var row = document.createElement('div');
                row.className = 'row';
                row.style.marginBottom = '1.25em';
                ['id', 'content'].forEach(field => {
                    var col = document.createElement('div');
                    col.className = 'col';
                    col.textContent = post[field];
                    
                    if(field != 'id') {
                        col.onclick = field_onclick.bind(null, post.id);
                        col.classList.add('clickable');
                    }
                    row.appendChild(col);
                });
                row.appendChild(create_delete_btn(post.id));
                grid.appendChild(row);
            });
            board.appendChild(grid);
        });

        function form_setup() {
            var form = document.querySelector('form');
            var submitBtn = form.querySelector('#submit');
            submitBtn.onclick = function() {
                var content = document.querySelector('#post_content_control').value;
                var model = { content };
                http.post('posts', model).then(() => window.location.reload())
            }
        }

        form_setup();
    }    

    function field_onclick(id, e) {
        var target = e.target;
        var textContent = e.target.textContent;
        var input = document.createElement('input');
        input.className = 'col';
        input.value = textContent;
        input.onblur = function(e) {
            target = e.target;
            col = document.createElement('div');
            col.className = 'col clickable';
            var content =  target.value;
            col.textContent = content;
            if(target.nextSibling) {
                target.parentNode.insertBefore(col, target.nextSibling);
            }
            else {
                target.parentElement.appendChild(col);
            }
            col.onclick = field_onclick.bind(null, id);
            target.remove();
            http.put('posts/' + id, { content });
        }
        if(target.nextSibling) {
            target.parentNode.insertBefore(input, target.nextSibling);
        }
        else {
            target.parentElement.appendChild(input);
        }
        target.remove();
        input.focus();
    }
    
    function delete_btn_onclick(id, e) {
        var confirmDelete = confirm('Are you sure you want to delete this post?');
        if(!confirmDelete) return;
        
        e.target.parentElement.remove();
        http.delete('posts/' + id);
    }
    
    function create_delete_btn(id) {
        var deleteBtn = document.createElement('button');
        deleteBtn.style.textAlign = 'center';
        deleteBtn.style.width = '1.83em';
        deleteBtn.textContent = 'x';
        deleteBtn.onclick = delete_btn_onclick.bind(null, id);
        return deleteBtn;
    }

    return { 
        create_delete_btn,
        delete_btn_onclick,
        field_onclick,
        init
    }
})();