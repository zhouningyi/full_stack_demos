//熟悉mongoose;
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
  lng: 36,
  tel: '021-1111111',
  hospital_id: '兰州大肠肛门医院'
};

function update(obj) {
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
    process.exit();
  });
}, 1000);
