# K-means实战：Flower Clustering
# Problem: 通过花的不同部位的大小,对花的品种进行聚类
install.packages("fpc")
library(fpc) 
data(iris)
head(iris)

# 0-1 正规化数据
# 此处对iris的4个feature做数据正规化,每个feature均是花的某个不为的尺寸。
min.max.norm <- function(x){
  (x-min(x))/(max(x)-min(x))
}
raw.data <- iris[,1:4]
norm.data <- data.frame(sl = min.max.norm(raw.data[,1]),
                        sw = min.max.norm(raw.data[,2]),
                        pl = min.max.norm(raw.data[,3]),
                        pw = min.max.norm(raw.data[,4]))
norm.data

# k取2到8,评估K
K <- 2:8
round <- 30 # 每次迭代30次,避免局部最优

# 计算轮廓系数：Silhouette Coefficient
rst <- sapply(K, function(i) {
  print(paste("K=", i))
  mean(sapply(1:round,function(r) {
    print(paste("Round", r))
    result <- kmeans(norm.data, i)
    stats <- cluster.stats(dist(norm.data), result$cluster)
    stats$avg.silwidth
  }))
})
plot(K,rst,type='l',main='Silhouette Coefficient vs K', ylab='Silhouette Coefficient')


# 降纬度观察
old.par <- par(mfrow = c(1,2))

k = 2 # 根据上面的评估 k=2最优
clu <- kmeans(norm.data,k)
mds = cmdscale(dist(norm.data,method="euclidean"))
plot(mds, col=clu$cluster, main='kmeans - k=2', pch = 19)
plot(mds, col=iris$Species, main='Original clusters', pch = 19)
par(old.par)