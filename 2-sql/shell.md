

------=====SELECT====-------
SELECT 1;

--sql里不区分大小写
SeLeCt 1;

--做计算
SELECT 1 * 2;

--运行函数
SELECT DATE('2012-09-17');

SELECT VERSION();

SELECT pg_database_size('study');
SELECT pg_size_pretty(pg_database_size('study'));

--AS
SELECT DATE('2012-09-17') AS 三年前的今天;


--通过默认表理解select

SELECT * FROM pg_stat_activity;

SELECT PID, USENAME FROM pg_stat_activity;




------=====类型与转化====------

SELECT 1 / 3;
SELECT 1.0 / 3;
SELECT 1::FLOAT / 3;


SELECT TIMESTAMP '2012-02-03';
SELECT '2012-02-03'::TIMESTAMP;
SELECT '2012-02-03 10:00'::TIMESTAMP;
SELECT '2012-02-03 10:00:20'::TIMESTAMP;

--特殊的类型
SELECT TIMESTAMP '2012-02-03' - TIMESTAMP '2012-02-01 11:01';

--JSON的处理
SELECT '{"a":1, "b":2}'::JSON;
--javascript {"a":1}.a
SELECT '{"a":{"b": 1}}'::JSON -> 'a' -> 'b';




--=====建表======--
CREATE TABLE house_lianjia_communities(
community_name xx
);

--寻找错误的行

CREATE tb2 as (
SELECT XX
);



--=====商业场景======--

--平均数 加权平均 中位数
SELECT AVG(pri)

--为什么出现中位数比平均数高

--价格和涨幅的关系

--房屋大小的数量分布

--涨幅和建造公司的关系

--连表查询 人口和房屋数量做比较


