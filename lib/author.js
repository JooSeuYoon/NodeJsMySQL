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
                template.authorTable(authors)
            );
            response.writeHead(200);
            response.end(html);
        })

    })
}