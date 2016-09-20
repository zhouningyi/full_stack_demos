## Case study: Classfication of college admission
## Keyword:  Logit Regresion, Classfication

library(aod)
library(ggplot2)
library(Rcpp)

## Dataset description
# This dataset has a binary response (outcome, dependent) variable called admit. 
# There are three predictor variables: gre, gpa and rank. 
# We will treat the variables gre and gpa as continuous. 
# The variable rank takes on the values 1 through 4. 
# Institutions with a rank of 1 have the highest prestige, 
# while those with a rank of 4 have the lowest.

# read data
mydata <- read.csv("http://www.ats.ucla.edu/stat/data/binary.csv")

## view the first few rows of the data
head(mydata)
summary(mydata)
sapply(mydata, sd)
mydata$rank <- factor(mydata$rank)

## Model 1: logit regression
mylogit <- glm(admit ~ gre + gpa + rank, data = mydata, family = "binomial")

## model summary
# 1. call
# 2. Deviance Residuals
# 3. Coefficients
summary(mylogit)

## confint()函数：获取相关的区间的预测信息
## CIs using profiled log-likelihood
confint(mylogit)
## CIs using standard errors
confint.default(mylogit)

## odds ratios only
exp(coef(mylogit))

## odds ratios and 95% CI
exp(cbind(OR = coef(mylogit), confint(mylogit)))


## 模型预测1 - predict rank
newdata1 <- with(mydata, data.frame(gre = mean(gre), gpa = mean(gpa), rank = factor(1:4)))
newdata1$rankP <- predict(mylogit, newdata = newdata1, type = "response")
newdata1

## 模型预测2 
newdata2 <- with(mydata, data.frame(gre = rep(seq(from = 200, to = 800, length.out = 100), 4),
                            gpa = mean(gpa), rank = factor(rep(1:4, each = 100))))

newdata2
newdata3 <- cbind(newdata2, predict(mylogit, newdata = newdata2, type="link", se=TRUE))
newdata3

# 预测关联规模
newdata3 <- within(newdata3, {
  PredictedProb <- plogis(fit)
  LL <- plogis(fit - (1.96 * se.fit))
  UL <- plogis(fit + (1.96 * se.fit))})
newdata3
head(newdata3)

# 绘制预测概率 - Plot the predicted probablibity
ggplot(newdata3, aes(x = gre, y = PredictedProb)) +
  geom_ribbon(aes(ymin = LL, ymax = UL, fill = rank), alpha = .2) +
  geom_line(aes(colour = rank), size=1)

# 这两个模型的偏差（即，这个测试的统计量）
with(mylogit, null.deviance - deviance)

# 自由度之差：模型里预测变量的个数
with(mylogit, df.null - df.residual)

# 提取p值
with(mylogit, pchisq(null.deviance - deviance, df.null - df.residual, lower.tail = FALSE))

# 对数似然
logLik(mylogit)


# reference: http://www.ats.ucla.edu/stat/r/dae/logit.htm
