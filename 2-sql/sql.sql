

------=====SELECT====-------
SELECT 1;

--做计算
SELECT 1 * 2;

--运行函数
SELECT DATE('2012-09-17');

-- SELECT DATE('2012-09-17') AS 三年前的今天;


-- SELECT VERSION();
 


-- SELECT pg_database_size('study');
-- SELECT pg_size_pretty(pg_database_size('study'));

--AS



--通过默认表理解select

-- SELECT * FROM pg_stat_activity;

-- SELECT PID, USENAME FROM pg_stat_activity;

-- SELECT PID as 进程id, USENAME as 用户名 FROM pg_stat_activity;



------=====类型与转化====------

SELECT 1 / 3;
SELECT 1.0 / 3;
SELECT 1::FLOAT / 3;


SELECT TIMESTAMP '2012-02-03';
SELECT '2012-02-03'::TIMESTAMP;
SELECT '2012-02-03 10:00'::TIMESTAMP;
SELECT '2012-02-03 10:00:20'::TIMESTAMP;

--特殊的类型

--interval
SELECT TIMESTAMP '2012-02-03' - TIMESTAMP '2012-02-01 11:01';

--
-- SELECT POINT(2,3);


--JSON 的处理
SELECT '{"a":1, "b":2}'::JSON;
--javascript {"a":1}.a
SELECT '{"a":{"b": 1}}'::JSON -> 'a' -> 'b';



--=====建DATABASE======--
CREATE DATABASE study;

--建立表
DROP TABLE IF EXISTS "public"."house_lianjia_communities";
CREATE TABLE "public"."house_lianjia_communities" (
  "community_name" Character Varying(20) ,
  "plate" Character Varying(255) ,
  "site" Character Varying(100) ,
  "age" Integer,
  "building_density" Double Precision,
  "building_type" Character Varying(20) ,
  "house_count" Integer,
  "building_count" Integer,
  "green_rate" Double Precision,
  "avr_price" Double Precision,
  "develop_company" Character Varying(255) ,
  "community_id" Character Varying(255) UNIQUE,
  "lat" Double Precision,
  "lng" Double Precision,
  "growth" Double Precision,
  "address" Character Varying(255)[]
  );

--测试表， 看看执行两次会怎样
INSERT INTO "public"."house_lianjia_communities"(
 community_name,
 community_id
) VALUES('XX', 'XXXX');

INSERT INTO "public"."house_lianjia_communities"(
 community_name,
 community_id
) VALUES('YY', 'YYYY');


--查看刚才的操作
SELECT * FROM house_lianjia_communities;

--UPDATE 刚才的表
UPDATE house_lianjia_communities
SET community_name = 'x====x'
WHERE community_id = 'XXXX';

--删除所有没用用的行
DELETE FROM house_lianjia_communities;


--导入提供的数据
COPY house_lianjia_communities(
community_name,plate,site,age,building_density,building_type,house_count,building_count,green_rate,avr_price,develop_company,lat,lng,address,community_id,growth
)

from '/Users/zhouningyi/git/presentation/full_stack_demos/2-sql/data/house_lianjia_communities.csv'
WITH DELIMITER ','
NULL AS 'Null'
CSV HEADER;


--举一反三 如何导出
COPY house_lianjia_communities
TO '/Users/zhouningyi/git/presentation/full_stack_demos/2-sql/data/house_lianjia_communities.csv'
NULL AS 'Null'
CSV HEADER;




--=========如何清洗刚才的数据==========--

--检查刚才的数据
SELECT * FROM house_lianjia_communities
WHERE community_name is not null;

--把清洗的数据导出到csv
COPY
(
  --------------------sql------------------------
)
TO '/Users/zhouningyi/git/full_stack_demos/2-sql/data/house_lianjia_communities_small.csv'
NULL AS 'Null'
CSV HEADER;

--把清洗的数据导出到表
CREATE TABLE house_lianjia_community_cleans as (
);

-- 如何更简练，快一点，可读性好一点？ 视图 / 伪表
drop view if exists tbs;
create view tbs as (
SELECT * FROM house_lianjia_communities
WHERE community_name is not null
limit 10
);

COPY (select * from tbs) TO '/Users/zhouningyi/git/full_stack_demos/2-sql/data/house_lianjia_communities_small.csv'
NULL AS 'Null'
CSV HEADER;


CREATE TABLE house_lianjia_community_cleans as (select * from tbs);
--检查一下
SELECT * from house_lianjia_community_cleans;

--=====基本操作 && 分析场景======--

--选择我要的房子
SELECT community_name AS NAME, lat, lng, growth AS VALUE
FROM  house_lianjia_communities
WHERE adcode LIKE '31%'
AND community_name IS NOT NULL
AND lat IS NOT NULL
AND lng IS NOT NULL
AND growth IS NOT NULL
AND avr_price IS NOT NULL
AND address IS NOT NULL
AND growth > 0.3

AND avr_price < 70000


AND address :: TEXT NOT LIKE '%4%'

AND plate IN ('徐泾', '华漕', '龙柏')
LIMIT 1000;



--上海市的平均房价是多少？
SELECT AVG(avr_price) from house_lianjia_communities;

--价格为null的会不会影响均价
SELECT AVG(avr_price)
from house_lianjia_communities
WHERE avr_price IS NOT NULL;


--是否要加权
--每幢楼的均价
SELECT SUM (building_count * avr_price) / SUM(building_count)
from house_lianjia_communities
where avr_price is not null;

--每户的均价
SELECT SUM (house_count * avr_price) / SUM(house_count)
from house_lianjia_communities
where avr_price is not null;


---？？？？？？？？？？？？？？？？？？？？---
--为什么细粒度的平均后，平均价格越来越低呢？
---？？？？？？？？？？？？？？？？？？？？---

--还有没有别的指标可以选择 percentile_cont: 百分位数， percentile_cont(0.5)中位数
SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY avr_price) AS avr_price
FROM house_lianjia_communities;

--为何 中位数 > 小区均价 > 楼均价 > 户均价
--排序后按照序号分组算均价

--一个笨办法
SELECT
percentile_cont(0.2) WITHIN GROUP (ORDER BY avr_price) AS avr_price,
percentile_cont(0.4) WITHIN GROUP (ORDER BY avr_price) AS avr_price,
percentile_cont(0.6) WITHIN GROUP (ORDER BY avr_price) AS avr_price,
percentile_cont(0.8) WITHIN GROUP (ORDER BY avr_price) AS avr_price
FROM house_lianjia_communities;


--校验下是否正确，特殊情况下的正确性
SELECT SUM (1 * avr_price) / SUM(1)
from house_lianjia_communities
where avr_price is not null;


--GROUP 操作是很重要的
--平均数 加权平均 中位数
SELECT count(1), round(avr_price / 2000) * 2000 as 价格
from (
  select *
  from house_lianjia_communities
  where avr_price is not null
  order by avr_price
  ) as t
group by round(avr_price / 2000) * 2000
order BY 价格;

--用with简化
WITH tbs as (
  select *
  from house_lianjia_communities
  where avr_price is not null
  order by avr_price
)

SELECT count(1), round(avr_price / 2000) * 2000 as 价格
from tbs
group by round(avr_price / 2000) * 2000
order BY 价格;

--价格和涨幅的关系
SELECT (CAST((round(avr_price / 5000) * 5000) AS INTEGER))  AS x, avg(growth) AS y, count(1) / 1000 AS z FROM house_lianjia_communities
WHERE avr_price IS NOT NULL
AND growth IS NOT NULL
AND avr_price < 100000
GROUP BY x
ORDER BY x;



--房屋大小的数量分布


--不同的地产公司的涨幅
WITH tmp AS (
SELECT SUBSTRING(develop_company FROM 0 FOR 5) AS dp, avg(growth) AS y1, count(1) AS y2
FROM house_lianjia_communities
WHERE develop_company IS NOT NULL
AND develop_company != '暂无信息'
AND growth IS NOT NULL
GROUP BY dp
ORDER BY y1 DESC
)

SELECT dp AS 开发商, (y1 * 100)::FLOAT AS 涨幅,  y2::FLOAT AS 数量
FROM tmp
WHERE y2 > 8
order by 涨幅 desc
LIMIT 15;


------------------------------------------
------连表查询 人口和房屋数量做比较【内含作业】
------------------------------------------

--新建地区表
CREATE TABLE areas(
 name Character Varying( 255 ) ,
 adcode Character Varying( 255 )
);

--导入地区表
COPY
areas(
name,
adcode
)
FROM '/Users/zhouningyi/git/full_stack_demos/2-sql/data/areas.csv'
NULL AS 'Null'
CSV HEADER;

--新建板块表
DROP TABLE IF EXISTS house_lianjia_plates;
CREATE TABLE house_lianjia_plates(
name Character Varying( 255 ) ,
adcode Character Varying( 255 )
);

--导入板块表
COPY
house_lianjia_plates(
name,
adcode
)
FROM '/Users/zhouningyi/git/full_stack_demos/2-sql/data/house_lianjia_plates.csv'
NULL AS 'Null'
CSV HEADER;


--【作业】如何连接三张表进行分析
-- 如，如何通过一个sql连接三张表，求上海每个区有多少小区、多少幢楼、多少户人



--=============一个较为复杂的例子================---
DROP TABLE IF EXISTS "public"."card_info";
CREATE TABLE "public"."card_info" (
  "id" Character Varying( 2044 ),
  "date" Text,
  "time" Text,
  "site" Text,
  "type"  Text,
  "cost" Double Precision,
  "is_cheaper" Character Varying( 2044 )
  );

--导入地铁刷卡数据
COPY
card_info(
id,
date,
time,
site,
type,
cost,
is_cheaper
)
FROM '/Users/zhouningyi/git/full_stack_demos/2-sql/data/card_info.csv'
NULL AS 'Null'
CSV HEADER;

----=====开始分析=====---------

DROP TABLE IF EXISTS shanghai_od_subway;
CREATE TABLE shanghai_od_subway AS
(SELECT * FROM (
SELECT
id,
TIME AS to_t, site AS to_p,
row_number() OVER (PARTITION BY id ORDER BY TIME) AS idx,
lag(TIME) OVER (PARTITION BY id ORDER BY TIME) AS from_t,
lag(site) OVER (PARTITION BY id ORDER BY TIME) AS from_p
FROM card_info
WHERE TYPE = '地铁'
ORDER BY id, TIME DESC
) AS tbs
WHERE idx % 2 = 0);

--检验
SELECT * FROM shanghai_od_subway LIMIT 1000;


--精细统计坐地铁的时间
SELECT count(1), substr(from_t, 1,2) || substr(from_t, 3,2) || '0' AS from_hour
FROM shanghai_od_subway
GROUP BY substr(from_t, 1,2) || substr(from_t, 3,2) || '0'
ORDER BY from_hour;


--出发地和到达地的分析
SELECT * FROM (
SELECT count(1), substr(from_t, 1,2) AS from_hour, from_p, to_p
FROM shanghai_od_subway
GROUP BY substr(from_t, 1,2) , from_p, to_p
ORDER BY from_hour, count DESC
) AS tb
WHERE count > 1
ORDER BY from_hour, count DESC;






--＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝插件＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝－－

create extension if not exists pg_jieba;

--== 认识unnest
SELECT '{"a", "b", "c"}'::text[];
select unnest('{"a", "b", "c"}'::text[]);

select to_tsvector('jiebacfg','上海交通大学闵行园区32号楼');
select UNNEST(regexp_split_to_array(regexp_replace(to_tsvector('jiebacfg','上海交通大学闵行园区32号楼')::text,'(:\d+)', '', 'g'), ' '));

--看词频最高的小区
with tbs as (
select UNNEST(regexp_split_to_array(regexp_replace(to_tsvector('jiebacfg', community_name)::text,'(:\d+)', '', 'g'), ' ')) as chr
from house_lianjia_communities
)

select chr, count(1) as cnt
from tbs
group by chr
order by cnt desc;



--看哪些词最贵气
with tbs as (
select UNNEST(regexp_split_to_array(regexp_replace(to_tsvector('jiebacfg', community_name)::text,'(:\d+)', '', 'g'), ' ')) as chr,
avr_price
from house_lianjia_communities
)

select * from (
select chr, count(1) as cnt, avg(avr_price) as avr_price
from tbs
where avr_price is not null
group by chr
order by avr_price desc
) as tb
where cnt > 2;



--建立索引
create index pt_index on house_lianjia_communities using btree (community_name);

--中间表



select * from house_lianjia_community_spiders;



