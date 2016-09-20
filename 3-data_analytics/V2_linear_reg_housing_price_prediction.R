# 房价预测

## Dataset description
# 
# y：上海商品房房产均价； 
# 
# t：年份
# x1：人均生产总值； 
# x2：人均可支配收入； 
# x3：商品零售价格指数； 
# x4：常住人口； 
# x5：住房竣工面积；
# x6：住宅投资总额； 
# x7：居民居住消费价格指数   
# 
# 数据来源：1998-2011年的《上海统计年鉴》和国家统计局

# read data
data_SH<-read.csv("~/Desktop/data_analytics/data_analytics/dataset/SH_house_pricing.csv")

# extraxt training dataset and test dataset
train_ds<-data_SH[1:12,]
test_ds<-data_SH[13:14,]
attach(train_ds)

# plot the data
plot(t,y)


##########################################
## Model1: 时间指数模型
##########################################


# 1. Map Y to log coordinate and plot
y1=log(y)  
plot(t,y1)
subplot()

# 2. Run Linear Regression
reg=lm(y1~t)

# 3. Print the model result
summary(reg)

# 4. Model Interpret

# 推导过程
# ym=exp(y1)
#   =exp(a1+b1*t)
#   =exp(a1)*exp(b1*t)
#   =a*exp(b*t)

# output
ym=y

# intercept
a1 = coefficients(reg)[1] # -3.281e+02
a = exp(a1)

# slope
b1 = coefficients(reg)[2] #1.681e-01 
b = b1

y1=a1+b1*t
y1=log(ym)

## 时间指数模型
yy=a*exp(b*t)

# 绘图
plot(t,ym)
lines(t,yy)

# 5. Prediction - 指数方程预测房价
tt=2011:2012
y_rs=a*exp(b*tt)

# 绘图
plot(c(t,tt), c(ym,y_rs))
lines(c(t,tt), c(yy,y_rs))

# Model accurancy
error1<-mean((test_ds$y - y_rs)/test_ds$y)



##########################################
## Model2: 多元线性回归
##########################################

plot(train_ds)
attach(train_ds)

# 1. calculate the correlation
cor(train_ds)
cor.test(ym,x1)  
cor.test(ym,x2)  
cor.test(ym,x3)  
cor.test(ym,x4)  
cor.test(ym,x5) 
cor.test(ym,x6)    
cor.test(ym,x7) 

# 2. Multi-var linear regression
# Model 1: 7 vars
reg1=lm(ym~x1+x2+x3+x4+x5+x6+x7)
summary(reg1)
# Model 2: 6 vars
reg2=lm(ym~x1+x2+x3+x4+x6+x7)
summary(reg2)
# Model 3: 5 vars
reg3=lm(ym~x1+x2+x3+x6+x7)
summary(reg3)

# 3. Model Interpretation
bb=coefficients(reg3)
b0=bb[[1]]
b1=bb[[2]]
b2=bb[[3]]
b3=bb[[4]]
b6=bb[[5]]
b7=bb[[6]]

attach(test_ds)
# model prediction for 2010:2011
yy2=b0+b1*x1+b2*x2+b3*x3+b6*x6+b7*x7



# 4. Prediction
# predict year: 2011:2012
# result: 19254 24534
y2_rs=b0+b1*x1+b2*x2+b3*x3+b6*x6+b7*x7


# 5. Model accurancy
error2<-mean((test_ds$y - y2_rs)/test_ds$y)