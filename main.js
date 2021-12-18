var http = require('http');
var url = require('url');
var lists = require('./lib/lists');
var myskills = require('./lib/myskills');
 
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        lists.home(request, response);
      } else {
        lists.page(request, response);
      }
    } else if(pathname === '/create'){
      lists. create(request, response);
    } else if(pathname === '/create_process'){
      lists.create_process(request, response);
    } else if(pathname === '/update'){
      lists.update(request, response);
    } else if(pathname === '/update_process'){
      lists.update_process(request, response);
    } else if(pathname === '/delete_process'){
      lists.delete_process(request, response);
    } else if(pathname === '/skills'){
      myskills.home(request, response);
    } else if(pathname === '/skills/create_process'){
      myskills.create_process(request, response);
    } else if(pathname === '/skills/update'){
      myskills.update(request, response);
    } else if(pathname === '/skills/update_process'){
      myskills.update_process(request, response);
    } else if(pathname === '/skills/delete_process'){
      myskills.delete_process(request, response);
    }else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);