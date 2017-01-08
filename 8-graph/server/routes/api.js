var express = require('express');
var router = express.Router();
const sequelize = require('./../model')

const search = (sql, cb) => {
	try{
		sequelize.query(sql).then(ds => cb(ds))
	}catch(e){
		cb([])
	}
}

/* GET users listing. */
//搜索词云
const getCloudByNode = (o, cb) => {
	if(!o.email) return
	o.email = o.email.toLowerCase();
	let sql = `
	  SELECT * FROM ts_stat('SELECT content_tvector FROM ${o.table} WHERE lower("from") = ''${o.email}''')
    ORDER BY nentry DESC
    LIMIT ${o.limit};
	`;
	console.log(sql)
	search(sql, cb)
}


const pCloudDefault = {
	email: null, 
	table: 'dncs',
	searchType: 'node',
	limit: 50
}


const getRange = (ds, getV) => {
	let min = getV(ds[0])
	let max = min;
	ds.forEach(d => {
		let v = getV(d)
		min = Math.min(v, min)
		max = Math.max(v, max)
	})
	return {min, max}
}


//关键词过滤
const filter = d => {
	const word = d.word
	const obj = {mailto:1, javascript: 1, sent:1, would:1, '2016':1,}
	if(word in obj) return false
	if(word.indexOf('@') !== -1) return false
	if(word.indexOf('.png') !== -1) return false
	return true
}
//所有关键词过滤
const wordFilter = (ds) => {
	const result = []
	ds.forEach((d) => {
		 if(filter(d))result.push(d)
	})
	return result
}

const processing = (ds, getV) => {
	ds = wordFilter(ds)
	const range = getRange(ds, getV)
	const {min, max} = range
	const dv = max - min
	let v01
	ds.forEach((d) => {
		v = getV(d)
		if(!dv){
			v01 = 1
		} else {
			v01 = (v - min) / dv
		}
		d.v01 = v01
	})
	return ds
} 

router.get('/cloud', function(req, res, next) {
	const params = Object.assign(pCloudDefault, req.query)
	getCloudByNode(params, ds => {
		ds = ds[0]
		if(!ds || !ds.length) return res.json(null)
		ds = processing(ds, d => d.nentry)
		res.json(ds)
	})
});

module.exports = router;
