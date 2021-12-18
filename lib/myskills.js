var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
    db.query(`SELECT * FROM lists`, function(error,topics){
        db.query(`SELECT * FROM myskills`, function(error2, myskill){
            var title = 'myskills';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              ${template.skillsTable(myskill)}
              <style>
              table {
                  border-collapse: collapse;
              }
              td{
                  border:1px solid black;
              }
              </style>
              <form action="/skills/create_process" method="post">
              <p>
              <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="level" placeholder="level"></textarea>
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
            </form>
            `,
            ``
            );
            response.writeHead(200);
            response.end(html);
        });
        
      });
}

exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            INSERT INTO myskills (name, level) 
              VALUES(?, ?)`,
            [post.name, post.level], 
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/skills`});
              response.end();
            }
          )
      });
}

exports.update = function(request, response) {
    db.query(`SELECT * FROM lists`, function(error,topics){
        db.query(`SELECT * FROM myskills`, function(error2, myskill){
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM myskills WHERE id=?`,[queryData.id], function(error3, myskills){
            var title = 'myskills';
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              ${template.skillsTable(myskill)}
              <style>
              table {
                  border-collapse: collapse;
              }
              td{
                  border:1px solid black;
              }
              </style>
              <form action="/skills/update_process" method="post">
              <p>
              <input type="hidden" name="id" value"${queryData.id}">
              </p>
              <p>
              <input type="text" name="name" value="${sanitizeHtml(myskills[0].name)}" placeholder="name">
                </p>
                <p>
                    <textarea name="level" placeholder="description">${sanitizeHtml(myskills[0].level)}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
            </form>
            `,
            ``
            );
            response.writeHead(200);
            response.end(html);
        });
        
      });
    });
}

exports.update_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            UPDATE myskills SET name=?, level=? WHERE id=?`,
            [post.name, post.level, post.id], 
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/skills`});
              response.end();
            }
          )
      });
    }

    exports.delete_process = function(request, response){
        var body = '';
          request.on('data', function(data){
              body = body + data;
          });
          request.on('end', function(){
              var post = qs.parse(body);
                    db.query(`
                        DELETE FROM myskills WHERE id=?`,
                        [post.id], 
                        function(error, result){
                            if(error){
                                throw error;
                            }
                            response.writeHead(302, {Location: `/skills`});
                            response.end();
                        }
                    )
          });
    }