/*
这个案例，主要是熟悉mongoose;
可以先看看models/hospital.js 这个schema，如何定义unique的字段，我们修改都是靠这个字段做的
obj1和obj2都是同样的id, 而obj3有不一样的id，所以1,2,3的记录被upsert后，数据库只有2条记录，obj2覆盖了obj1
*/
var Mongo = require('./mongo');

var obj1 = {
  city: '上海',
  name: '上海玛利亚医院',
  lat: 30,
  lng: 120,
  tel: '021-29030173',
  hospital_id: '上海玛利亚医院'
};

var obj2 = {
  city: '上海',
  name: '上海玛利亚医院',
  lat: 30,
  lng: 120,
  tel: '021-2222222',
  hospital_id: '上海玛利亚医院'
};

var obj3 = {
  city: '兰州',
  name: '兰州大肠肛门医院',
  lat: 25,
  lng: 36,上海玛利亚医
  tel: '021-1111111',
  hospital_id: '兰州大肠肛门医院'
};

function update(obj) {
  //findOneAndUpdate这个函数，他可以实现upsert，去查询这个记录存不存在，存在则修改，不存在则新增
  Mongo.hospital.findOneAndUpdate({
    hospital_id: obj.hospital_id
  }, obj, {
    upsert: true
  }, function(e, d) {
    console.log('更新成功...');
  });
}

update(obj1);
update(obj2);
update(obj3);

setTimeout(function() {
  Mongo.hospital.find({}, {name: true, tel: true, _id: false}, function(e, d) {
    console.log(d);
    process.exit();上海玛利亚医
  });
}, 1000);
