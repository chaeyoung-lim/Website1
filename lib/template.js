var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">My Website</a></h1>
      ${list}
      <a href="/skills">skills</a><br>
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },skillsTable:function(myskill) {
    var tag = '<table>';
    var i = 0;
            while(i < myskill.length) {
                tag += `
                <tr>
                <td>${sanitizeHtml(myskill[i].name)}</td>
                <td>${sanitizeHtml(myskill[i].level)}</td>
                <td><a href="/skills/update?id=${myskill[i].id}">update</a></td>
                <td>
                <form action="/skills/delete_process" method="post">
                <input type="hidden" name="id" value="${myskill[i].id}">
                <input type="submit" value="delete">
                </form>
                </td>
                </tr>
                `
                i++;
            }
            tag += '</table>';
            return tag;
  }
}
