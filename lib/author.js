var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');

exports.page = function (request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            var title = 'Authors Management'
            var list = template.list(topics);
            var html = template.HTML(title, list,
                '<a href="/author_create">create author</a>',
                `${template.authorTable(authors)}
                <style> 
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>`
            );
            response.writeHead(200);
            response.end(html);
        })

    });
};

exports.create_author = function (request, response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            var title = 'Create Author'
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<form action="/create_author_process" method = "post">
                <p><input type = "text" name = "name" placeholder = "name"></p>
                <p>
                    <textarea name ="description" placeholder ="description"></textarea>
                </p>
                <p>
                    <input type = "submit">
                </p>
                </form>`,
                `${template.authorTable(authors)}
                <style> 
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>`);

            response.writeHead(200);
            response.end(html);
        })
    });
};

exports.create_author_process = function (request, response) {
    var body = '';
    request.on('data', function (data) {
        body = body + data;
    });

    request.on('end', function () {
        var post = qs.parse(body);

        db.query(`INSERT INTO author (name, profile) VALUES(?, ?);`,
            [post.name, post.description],
            function (error, result) {
                if (error) {
                    throw error;
                }
                response.writeHead(302, { Location: '/author_create' });
                response.end();
            })
    })

};

exports.update_author = function (request, response) {

    db.query(`SELECT * FROM topic`, function (error, topics) {
        if (error) {
            throw error;
        }
        db.query(`SELECT * FROM author`, function (error2, authors) {
            if (error2) {
                throw error2;
            }
            var _url = request.url;
            console.log(_url);
            var queryData = url.parse(_url, true).query;
            console.log(queryData);
            db.query(`SELECT * FROM author WHERE id = ?`, [queryData.id], function (error3, author) {
                if (error3) {
                    throw error3;
                }
                console.log(author[0]);
                var title = 'Update Author'
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<form action="/update_author_process" method = "post">
                <input type = "hidden" name = "id" value = "${queryData.id}">
                <p><input type = "text" name = "name" placeholder = "name" value = "${author[0].name}"></p>
                <p>
                    <textarea name ="description" placeholder ="description" >${author[0].profile}</textarea>
                </p>
                <p>
                    <input type = "submit" value="update">
                </p>
                </form>`,
                `${template.authorTable(authors)}
                <style> 
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border: 1px solid black;
                    }
                </style>`);

                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_author_process = function (request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);

        db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`,
        [post.name, post.description, post.id], function(error, results){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: '/author_page'});
            response.end();
        });
    });    
}

exports.delete_author_process = function (request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    })
    request.on('end', function(){
        var post = qs.parse(body);

        db.query(`DELETE FROM author WHERE id = ?`, [post.id], function(error, results){
            if(error){
                throw error;
            }
            response.writeHead(302, {Location: `/author_page`});
            response.end();
        });
    });
}