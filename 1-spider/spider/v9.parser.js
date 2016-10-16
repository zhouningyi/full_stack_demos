/*
  请求返回后，所有的处理都在这里。
  因为这个内容也比较多，所以专门分了这个文件
*/

var Mongo = require('./mongo');
var cheerio = require('cheerio');

function update(obj) {
  Mongo.community.findOneAndUpdate({
    community_id: obj.community_id
  }, obj, {
    upsert: true
  }, function(e, d) {
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
    xiaoqu = xiaoqu.replace(/\'/g, '"');//展示的数据不是标准的json, 处理成标准的json，json要双引号 ['aa'] => ["aa"]
    console.log(typeof(xiaoqu));
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
      community_id: communityId,
      district_name: districtName,
      community_name: communityName
    };
    console.log(result)
    update(result);
  });
}

module.exports = parser;
