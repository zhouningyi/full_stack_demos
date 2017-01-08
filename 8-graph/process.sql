--建立一个专门用来分析的 schema
CREATE SCHEMA IF NOT EXISTS analysis;

--建立所有的邮件表
DROP TABLE IF EXISTS analysis.dncs_alltbs;
CREATE TABLE analysis.dncs_alltbs AS (
  SELECT lower("from") AS "from", lower(unnest("to")) AS "to", "content", "title", "time", "mailid"
  FROM dncs
);

--建立查询索引
CREATE INDEX IF NOT EXISTS from_ct_index ON analysis.dncs_alltbs USING hash("from");
CREATE INDEX IF NOT EXISTS to_ct_index   ON analysis.dncs_alltbs USING hash("to");

--建立email计数表
DROP TABLE IF EXISTS analysis.dncs_email_count;
CREATE TABLE analysis.dncs_email_count AS (
  SELECT count(1) AS from_count, "from" AS email, 0 AS to_count,  null as site
  FROM analysis.dncs_alltbs
  WHERE char_length("from") < 35
  GROUP BY "from"
);

ALTER TABLE analysis.dncs_email_count
ALTER COLUMN site type CHARACTER(255);

ALTER TABLE analysis.dncs_email_count ADD UNIQUE(email);

WITH tbs AS (
  SELECT count(1) AS to_count, "to" AS email
  FROM analysis.dncs_alltbs
  WHERE char_length("to") < 35
  GROUP BY "to"
)

INSERT INTO analysis.dncs_email_count(email, to_count)
SELECT email, to_count 
FROM tbs
ON CONFLICT(email) DO UPDATE
SET to_count = excluded.to_count;

--邮件分类分析
DROP TABLE IF EXISTS analysis.dncs_site_count;
CREATE TABLE analysis.dncs_site_count AS (
SELECT 
(
  regexp_split_to_array("email", '@'))['2'] as site, 
  sum(from_count + to_count) AS "count", 
  sum(from_count) AS "from_count",
  sum(to_count) AS "to_count"
  FROM analysis.dncs_email_count
  WHERE from_count != 0 --排除邮件组和备份邮件
  AND to_count != 0
  GROUP BY (regexp_split_to_array("email", '@'))['2']
  ORDER BY count DESC
);

UPDATE analysis.dncs_email_count
SET site = tb.site
FROM analysis.dncs_site_count AS tb
WHERE email LIKE ('%@' || tb.site)
AND tb.count > 431; 



--建立搜索和词云需要的tsvector

ALTER TABLE dncs
  ADD COLUMN content_tvector tsvector;

  SET SESSION client_min_messages TO WARNING;

  UPDATE dncs 
  SET content_tvector = to_tsvector('english', "content")
  WHERE  LENGTH("content") < 800000;

  CREATE INDEX IF NOT EXISTS dncs_ct_index ON dncs USING gin(content_tvector);



  --查询某个邮箱的词云

