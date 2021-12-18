var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');


exports.home = function(request, response) {
db.query(`SELECT * FROM lists`, function(error,topics){
    var title = 'Welcome to my website';
    var description = '아직 미완성입니다.';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM lists`, function(error,topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM lists WHERE id=?`,[queryData.id], function(error2, lists){
          if(error2){
            throw error2;
          }
         var title = lists[0].title;
         var description = lists[0].description;
         var list = template.list(topics);
         var html = template.HTML(title, list,
           `
           <h2>${title}</h2>${description}`,
           ` <a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
               <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${queryData.id}">
                 <input type="submit" value="delete">
               </form>`
         );
         response.writeHead(200);
         response.end(html);
        })
     });
}

exports.create = function(request, response) {
    db.query(`SELECT * FROM lists`, function(error, topics){
        var title = 'create';
        var list = template.list(topics);
        var html = template.HTML(title, list, `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit" value="create">
            </p>
          </form>
        `, 
        '<a href="/create">create</a>');
        response.writeHead(200);
        response.end(html);
      });
}

exports.create_process = function(request, response) {
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            INSERT INTO lists (title, description) 
              VALUES(?, ?)`,
            [post.title, post.description, 1], 
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          )
      });
}

exports.update = function(request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM lists', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM lists WHERE id=?`,[queryData.id], function(error2, lists){
          if(error2){
            throw error2;
          }

          var list = template.list(topics);
          var html = template.HTML(lists[0].title, list,
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${lists[0].id}">
          <p><input type="text" name="title" placeholder="title" value="${lists[0].title}"></p>
            <p>
              <textarea name="description" placeholder="description">${lists[0].description}</textarea>
            </p>
            <p>
              <input type="submit" value="update">
            </p>
          </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${lists[0].id}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
}

exports.update_process = function(request, response) {
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('UPDATE lists SET title=?, description=? WHERE id=?', [post.title, post.description, post.id], function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      });
}

exports.delete_process = function(request, response) {
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query('DELETE FROM lists WHERE id = ?', [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
      });
}