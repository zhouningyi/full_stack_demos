
var Pg = require('./pg');
var cheerio = require('cheerio');

function update(obj) {
  Pg.community_pg.upsert(obj).then(function(e, d){
    if(e) return console.log(e);
    console.log('更新成功...');
  });
}

function parser(e, res, body){
  var $ = cheerio.load(body);
  var listNode = $('.list-wrap');
  listNode.find('li').each(function(i, node){
    node = $(node);
    var infoNode = node.find('.actshowMap_list');
    var xiaoqu = infoNode.attr('xiaoqu');
    xiaoqu = xiaoqu.replace(/\'/g, '"');
    xiaoqu = JSON.parse(xiaoqu);
    var lat = xiaoqu[1], lng = xiaoqu[0], communityName = xiaoqu[2];
    var districtName = infoNode.attr('districtname');
    var plateName = infoNode.attr('platename');
    var communityId = node.find('.pic-panel').find('a').attr('key');
    var result = {
      community_id: communityId,
      lat: lat,
      lng: lng,
      plate: plateName,
      district_name: districtName,
      community_name: communityName
    };
    console.log(result);
    update(result);
  });
}

module.exports = parser;
