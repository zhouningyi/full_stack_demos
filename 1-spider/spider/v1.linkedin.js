var request = require('request');

var url = 'https://www.linkedin.com/vsearch/f?type=all&keywords=jun+hou&orig=GLHD&rsid=2008938481473492845485&pageKey=voltron_federated_search_internal_jsp&trkInfo=tarId%3A1473492889401&trk=global_header&search=Search';

var data, list, d, result;
request.get(url, function(e, res, body) {
  if (!e && res.statusCode == 200) {
    console.log(body.indexOf('投资银行'));
  }
});


