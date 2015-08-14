var express = require('express');
var path = require('path');
var router = express.Router();
var http = require('http'),
    querystring = require('querystring'),
    fs = require('fs'),
    cheerio = require('cheerio');

router.post('/', function(req, res, next) {;
  var conteudoPOST = querystring.stringify({
        'edtIdUs': req.body.matricula,
        'edtIdSen': req.body.senha,
        'btnIdOk': 'submit'
  });

  var header = {
    host: 'academico.ufrrj.br',
    path: '/quiosque/aluno/quiosque.php',
    method: 'POST',
    Connection: 'keep-alive',
    headers: {
      'Content-Length': conteudoPOST.length,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  console.log('Iniciando requisição...');
  var html = '';
  var postReq = http.request(header, function(res2){
    res2.setEncoding('utf8');
    res2.on('data', function (data) {
      html += data;
    });
    res2.on('end', function(){
      fs.writeFile('quiosque.html', html, function (err) {
        if (err) throw err;
        //console.log('Salvo!');
      });
      var $ = cheerio.load(html);
      var nom = $('#info_us').text();
      nom = nom.substring(19,nom.indexOf(' '));
      inicial = nom.slice(0,1);
      nom = nom.substring(1).toLowerCase();
      res.render('login',{nome: inicial+nom})
      res.end();
    });
  });
  postReq.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });
  postReq.write(conteudoPOST);
  postReq.end();
});

module.exports = router;
