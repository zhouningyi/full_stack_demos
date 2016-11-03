## 数据预处理

## Agenda
## - 数据汇总统计
## - 数据清洗
## - 数据填充
# install.packages("DMwR")
# install.packages("readxl")
library(readxl)
library(DMwR)

## 读取数据
file <- "~/Desktop/data_analytics/data_analytics/dataset/lianjia_community_shanghai.xls"
ds0 <- read_excel(file, sheet = 1, na = "NA")
ds <- ds0

################################################
## 数据汇总统计
################################################

# 数据查看
names(ds)
head(ds)
tail(ds)
str(ds)

# 数据观测
# 函数：平均值(mean())、求和(sum())、连乘(prod())、最值(min()、max())、方差(var())、标准差(sd())
min(ds$avr_price, na.rm=T)
max(ds$avr_price, na.rm=T)
mean(ds$avr_price, na.rm=T)
median(ds$avr_price, na.rm=T)
sd(ds$avr_price, na.rm=T)
hist(ds$avr_price, breaks=50)

sapply(ds, mean, na.rm=TRUE)
summary(ds)



# 频率表
hist(ds$age, breaks=20, col="red")
age_tbl <- table(ds$age) # A will be rows, B will be columns 
age_tbl # print table 
df <- data.frame(age_tbl)
freq <- df[order(-df$Freq),]
head(freq)
tail()

################################################
## 数据清洗 （缺失值）
################################################

# 数据观测 - 查看每行缺失值
apply(ds,1,function(x) sum(is.na(x)))
head(ds)

# 查看缺失部分
ds[!complete.cases(ds),]
nrow(ds[!complete.cases(ds),])
nrow(ds)

# nrow(ds)
# 剔除缺失部分
ds1<-na.omit(ds)
head(ds1)
nrow(ds)
nrow(ds1)

# 忽略“building_type”列，剔除缺失部分
colnames(ds)
colnames(ds[-5])

ds2<-na.omit(ds[-5])
head(ds2)
nrow(ds2)
nrow(ds2)/nrow(ds)

# 剔除缺失值超过20%的行
# 函数manyNAs()：可以找出缺失值个数大于列数20%的行，第二个参数默认值是0.2
ds3<-ds[-manyNAs(ds, 0.2),]
nrow(ds3)/nrow(ds)


################################################
## 数据填充
################################################

colnames(ds)

head(ds$avr_price)

# 1. 用平均值填补
ds[1,"avr_price"]<-mean(ds$avr_price,na.rm=T)

# 2. 用中位数填补：
ds<-ds0
med<-median(ds$avr_price,na.rm=T)
head(ds[,c("community_name", "avr_price")])
ds[is.na(ds$avr_price),"avr_price"]<-med
head(ds[,c("community_name", "avr_price")])


# 函数centralImputation()：可以用数据的中心趋势值来填补缺失值。
# Tips：对数值型变量使用中位数，对名义变量使用众数：
ds<-ds0
ds1<-ds[-manyNAs(ds),]
ds2<-centralImputation(ds1)
head(ds1,20)
head(ds2,20)


# 3. 通过变量的相关关系来填补缺失值
symnum(cor(ds[,c("age", "building_density", "house_count", "building_count", "green_rate", "avr_price")],use="complete.obs"))
head(ds)
ds$avr_price

# 4. 利用线性相关变量进行填补：
ds<-ds0
ds<-ds[-manyNAs(ds),]
lm_model<-lm(avr_price~house_count,data=ds)
lm_model

# 构造一个填充函数
fill_avr_price<-function(x){
  if(is.na(x))
    return(NA)
  else return(48195.108-5.987*x)
}
ds[is.na(ds$avr_price),"avr_price"]<-sapply(ds[is.na(ds$avr_price),"house_count"],fill_avr_price)
head(ds0[, c("building_count", "avr_price")])
head(ds[, c("building_count", "avr_price")])

# 5. 探索案例之间的相似性来填补缺失值
ds<-ds0
# extract numeric columns
ds_num <- ds[c("age", "building_density", "house_count", "building_count", "green_rate", "avr_price")]
ds1<-knnImputation(ds_num,k=10)
head(ds_num)
head(ds1)
ds_num[11657,]
# 用中位数来填补：
ds2<-knnImputation(ds_num,k=10,meth="median")
?knnImputation
