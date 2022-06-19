# https://ggplot2.tidyverse.org/reference/ggplot.html

# https://www.mathworks.com/help/stats/wilkinson-notation.html

# Generate some sample data, then compute mean and standard deviation
# in each group
df <- data.frame(
  x = rnorm(30, -1), # dummy for testing
  gp = factor(rep(letters[1:3], each = 10)),
  y = rnorm(30)
)

fn_d <- function(d) { # "d" is a partition of a data frame (based on factor)
  # last element gp=d$gp causes repetition, it is replaced by below
  #  data.frame(mean = mean(d$y), sd = sd(d$y), gp = d$gp)
  data.frame(mean = mean(d$y), sd=sd(d$y), gp=d$gp[1])

}

# split(df, df$gp) creates a list, as revealed by class(..), where the df is split out by the factors df$gp  

#> split(df, df$gp)
#$a
#            x gp          y
#1  -1.1751336  a  0.2617920
#2  -1.1513072  a -0.9020239
#3  -1.5460198  a  1.5430096
#4  -2.2167206  a -0.1655139
#5  -0.6862811  a  1.1638264
#6  -0.1888774  a -0.8507254
#7   0.1383657  a  1.0141726
#8  -2.5575385  a -0.8681451
#9  -1.2092960  a -0.6738107
#10 -1.7273108  a -0.5358799
#
#$b
#            x gp           y
#11  0.4214772  b -1.45509080
#12 -1.1947613  b -0.05172306
#13 -1.5009319  b  0.60259194
#14 -1.9279822  b -1.39747052
#15 -0.1700141  b -0.01579956
#16 -2.4467882  b  0.81699254
#17 -1.5402950  b  2.69505940
#18 -1.7425593  b -0.03300806
#19  0.1636331  b  0.33605298
#20 -0.2634703  b -1.08127283

# rbind is colate data.frames by row
# lapply is "list apply"
# split is split a data frame according to a factor
ds <- do.call(rbind, lapply(split(df, df$gp), fn_d ))

#          mean        sd gp
#a -0.001329834 0.9364278  a
#b  0.041633204 1.2307593  b
#c  0.046439794 1.0426476  c
ggplot() +
  geom_point(data = df, aes(gp, y)) +
  geom_point(data = ds, aes(gp, mean), colour = 'red', size = 3) +
  geom_errorbar(
    data = ds,
    aes(gp, mean, ymin = mean - sd, ymax = mean + sd),
    colour = 'red',
    width = 0.1
  )