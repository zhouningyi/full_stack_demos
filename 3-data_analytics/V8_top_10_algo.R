## 十大经典数据挖掘算法R语言实践
## Top to classical Data mining algorithm - R Practice

# 数据集: 采用R语言内置的iris数据集。

# 查看数据集前六个观测
head(iris)

## K近邻算法R语言实践

# 第一步：数据集分为训练集和测试集
index <-sample(1:nrow(iris), 100)
iris.train <-iris[index, ]
iris.test <-iris[-index, ]

# 第二步：加载能够做k近邻的class包
library(class)

## Warning: package 'class'was built under R version 3.1.3
# 第三步：利用kNN算法对测试集进行分类
result.KNN <-knn(train=subset(iris.train,select=-Species), 
                 test=subset(iris.test,select=-Species), 
                 cl=iris.train$Species)

# 第四步：生成结果集的混淆矩阵
table(result.KNN, iris.test$Species)


###############################################################################
#
# （一）C4.5算法 
#
###############################################################################


# 在此，我们用R语言中的C50包所提供的C5.0函数实现C5.0算法。
# 
# 第一步：加载相应包

library(C50)
## Warning: package 'C50' was built under R version 3.1.3
library(printr)
# 温馨提示：若是没有安装上述包，请在加载前，先安装这些包。

# 第二步：把iris数据集分为训练集和测试集，按着2:1划分，即训练集100个，测试集50个
train.indeces <- sample(1:nrow(iris), 100)
iris.train <- iris[train.indeces, ]
iris.test <- iris[-train.indeces, ]

# 第三步：构建C5.0算法模型
model.C5.0 <- C5.0(Species ~ ., data = iris.train)

# 第四步：交叉验证，使用测试数据集测试模型
results.C5.0 <- predict(object = model.C5.0, newdata = iris.test, type = "class")

# 第五步：生成混淆矩阵
table(results.C5.0, iris.test$Species)

###############################################################################

# （二）支持向量机算法

###############################################################################

# 第一步：加载SVM算法的R包e1071

library(e1071)
## Warning: package 'e1071' was built under R version 3.1.3
library(printr)

# 第二步：把iris按着2:1的比例分为训练集和测试集
index <- sample(1:nrow(iris), 100)
iris.train <- iris[index, ]
iris.test <- iris[-index, ]

# 第三步：在训练集上用SVM构建模型
model.SVM <- svm(Species ~ ., data=iris.train)

# 第四步：在测试集上对模型做测试
results.SVM <- predict(object=model.SVM, newdata=iris.test, type="class")

# 第五步：生成混淆矩阵，理解测试结果
table(results.SVM, iris.test$Species)


###############################################################################

# （三） 朴素贝叶斯算法

###############################################################################

# 第一步：加载包e1071
library(e1071)
library(printr)
# 第二步：iris数据集分为训练集和测试集
index <-sample(1:nrow(iris), 100)
iris.train <-iris[index, ]
iris.test <-iris[-index, ]
# 第三步：利用朴素贝叶斯算法构建模型
model.NaiveBayes <-naiveBayes(x =subset(iris.train,select=-Species), y= iris.train$Species)
# 第四步：用模型对测试集做测试
results.NaiveBayes <-predict(object = model.NaiveBayes, newdata =iris.test, type="class")

# 第五步：混淆矩阵
table(results.NaiveBayes, iris.test$Species)

###############################################################################

# （四）K近邻算法

###############################################################################

# 第一步：数据集分为训练集和测试集
index <-sample(1:nrow(iris), 100)
iris.train <-iris[index, ]
iris.test <-iris[-index, ]

# 第二步：加载能够做k近邻的class包
library(class)
## Warning: package 'class'was built under R version 3.1.3

# 第三步：利用kNN算法对测试集进行分类
result.KNN <-knn(train=subset(iris.train,select=-Species), test=subset(iris.test,select=-Species), cl=iris.train$Species)

# 第四步：生成结果集的混淆矩阵
table(result.KNN, iris.test$Species)


###############################################################################

# （五）CART分类回归决策树 

###############################################################################


# 第一步：数据集划分训练集和测试，比例是2:1
set.seed(1234)
index <-sample(1:nrow(iris),100)
iris.train <-iris[index,]
iris.test <-iris[-index,]

# 第二步：加载包含CART算法的R包
library(rpart)

# 第三步：构建CART模型
model.CART <-rpart(Species~.,data=iris.train)

# 第四步：模型应用到测试集
results.CART <-predict(model.CART,newdata=iris.test, type="class")

# 第五步：生成混淆矩阵
table(results.CART, iris.test$Species)

###############################################################################

# （六）Adboost算法

###############################################################################

# 第一步：数据集划分训练集和测试集，比例2:1
index <-sample(1:nrow(iris), 100)
iris.train <-iris[index, ]
iris.test <-iris[-index, ]
# 第二步：加载实现Adboost算法的R包
library(adabag)
## Loading required package:rpart
## Loading required package: mlbench
## Loading required package: caret
## Loading required package: lattice
## Loading required package: ggplot2
# 第三步：构建Adboos算法模型
model.Adboost <-boosting(Species~., data=iris.train)
# 第四步：模型应用于测试集
results.Adboost <-predict(model.Adboost,newdata=iris.test, type="class")
# 第五步：查看混淆矩阵
results.Adboost$confusion



###############################################################################
#
# （七）K-means算法
#
###############################################################################


# K-means算法原理

# 输入：簇的数目k；包含n个对象的数据集D。
# 输出：k个簇的集合。
# 方法：
#   从D中任意选择k个对象作为初始簇中心；
# repeat;
#   根据簇中对象的均值，将每个对象指派到最相似的簇；
#   更新簇均值，即计算每个簇中对象的均值；
# 计算准则函数；
#   until准则函数不再发生变化。

# 第一步：加载R包
library(stats)#该包属于默认包，会自动加载

# 第二步：构建K-means聚类模型
model.Kmeans <-kmeans(x =subset(iris, select =-Species), centers=3)
# 第三步：生成混淆矩阵
table(model.Kmeans$cluster, iris$Species)




###############################################################################
#
# （八）EM算法最大期望
#
###############################################################################



# 第一步：加载实现EM算法的R包
library(mclust)

# 第二步：构建EM算法模型
model.EM <-Mclust(subset(iris, select= -Species))
# 第三步：生成混淆矩阵
table(model.EM$classification, iris$Species)


###############################################################################
#
# （九）Apriori算法
#
###############################################################################

# 第一步：加载实现Apriori算法的R包
library(arules)
data("Adult")
# 第二步：利用Apriori算法构建关联规则模型
rules.Apriori <-apriori(Adult,parameter =list(support=0.4,confidence=0.7), appearance=list(rhs=c("race=White", "sex=Male"), default="lhs"))
# 第三步：利用提升度对规则排序，获取前top-5项
rules.sorted <-sort(rules.Apriori,by="lift")
top5.rules <-head(rules.sorted, 5)
as(top5.rules,"data.frame")



###############################################################################
#
# （十）PageRank算法
#
###############################################################################

# 第一步：加载R包
library(igraph)

# 第二步：随机生成具有10个对象的有向图
g <-random.graph.game(n=10, p.or.m=1/4, directed =TRUE)

# 第三步：画有向图
plot(g)

# 第四步：计算PageRank
pr <-page.rank(g)$vector

# 第五步：显示每个对象的 PageRank
df <-data.frame(Object =1:10,PageRank = pr)
arrange(df,desc(PageRank))

# Reference: bigdata.ren