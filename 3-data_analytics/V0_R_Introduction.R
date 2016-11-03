#####################################################
# R Introduction
#####################################################


# Set Working Directory
setwd("~/Desktop/data_analytics/data_analytics/")
getwd() # print the current working directory
ls() # list objects in the working environment

# Install Packages
install.packages("dplyr", "ggplot2")
library(dplyr)
library(ggplot2)


# Help
?mean
help(mean)


# Data Type
name <- "Alice"
age <- 18
gpa <- 3.99
grade <- 3
lst <- list(name=name, age=age, gpa=gpa, grade=grade)
lst
str(lst)
# print today's date
today <- Sys.Date()
format(today, format="%B %d %Y")

# 序列 Array
x <- c(1:12)
x

# 矩阵
m <- matrix(data=x, nrow=3, ncol=4)
m + 1
m * 2

# Data Frame
df <- data.frame(m)
df
df$X1[2]
df[2,2]
str(df)

# Data manipulation
1 + 1
a = 6.6666
a * 10

# Load data
df<-data(iris)
head(iris)
str(iris)
# list the variables in mydata
names(iris)
# list the structure of mydata
str(iris)
# list levels of factor v1 in mydata
levels(iris$Species)
# dimensions of an object
dim(iris)
# class of an object (numeric, matrix, data frame, etc)
class(iris)

# batch process
?lapply
# get max of each column
sapply(iris[,1:4], max)
lapply

# function
plus10 <- function(x) {
  if (is.numeric(x))
    x + 10
  else 
    warning(paste0(x, " is not a numberic value."))
}

plus10(1)
plus10(NA)
plus10("a")


# Import/export data
mydata <- read.table("~/Desktop/data_analytics/data_analytics/dataset/SH_house_pricing.csv", header=TRUE,  sep=",", row.names="t")
write.table(mydata, "~/Desktop/data_analytics/data_analytics/dataset/temp.txt", sep="\t")
