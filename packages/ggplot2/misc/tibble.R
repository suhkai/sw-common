# https://tibble.tidyverse.org/

Sys.Date (date class)
class(Sys.Time())
# --> [1] "POSIXct", "POSIXt"

#class(Sys.time())
# --> [1] "POSIXct" "POSIXt" 

#class(Sys.time())[0]
# --> character(0)

#class(Sys.time())[1]
# --> [1] "POSIXct"

#class(Sys.time())[2]
# --> [1] "POSIXt"

#class(Sys.time())[3]
# --> [1] NA

data <- data.frame(a = 1:3, b = letters[1:3], c = Sys.Date() - 1:3, stringsAsFactors=F)

as_tibble(data)
# A tibble: 3 × 3
#      a b     c         
#  <int> <chr> <date>    
#1     1 a     2022-06-17
#2     2 b     2022-06-16
#3     3 c     2022-06-15

data <- data.frame(a = 1:3, b = letters[1:3], c = Sys.Date() - 1:3)

as_tibble(data)
#
# NB: <fct> = factor
#
# A tibble: 3 × 3
#      a b     c         
#  <int> <fct> <date>    
#1     1 a     2022-06-17
#2     2 b     2022-06-16
#3     3 c     2022-06-15

tibble(x = 1:5, y = 1, z = x ^ 2 + y)


tribble(
  ~x, ~y,  ~z,
  "a", 2,  3.6,
  "b", 1,  8.5
)
#> # A tibble: 2 × 3
#>   x         y     z
#>   <chr> <dbl> <dbl>
#> 1 a         2   3.6
#> 2 b         1   8.5

> tibble(x = letters)
# A tibble: 26 × 1
#   x
#   <chr>
# 1 a
# 2 b
# 3 c
# 4 d
# 5 e
# 6 f
# 7 g
# 8 h
# 9 i
#10 j
# … with 16 more rows

> tibble(x = 1:3, y = list(1:5, 1:10, 1:20))
# A tibble: 3 × 2
#      x y
#  <int> <list>
#1     1 <int [5]>
#2     2 <int [10]>
#3     3 <int [20]>

names(data.frame(`crazy name` = 1))
# [1] "crazy.name"

names(tibble(`crazy name` = 1))
# [1] "crazy name"

tibble(x = 1:5, y = x ^ 2)
# A tibble: 5 × 2
#      x     y
#  <int> <dbl>
#1     1     1
#2     2     4
#3     3     9
#4     4    16
#5     5    25

l <- replicate(26, sample(100), simplify = FALSE)
names(l) <- letters

timing <- bench::mark(
  as_tibble(l),
  as.data.frame(l),
  check = FALSE
)

#
#> timing
# A tibble: 2 × 13
#  expression            min   median `itr/sec` mem_alloc `gc/sec` n_itr  n_gc total_time result memory              time               gc                  
#  <bch:expr>       <bch:tm> <bch:tm>     <dbl> <bch:byt>    <dbl> <int> <dbl>   <bch:tm> <list> <list>              <list>             <list>              
#1 as_tibble(l)        129µs    139µs     6759.    1.55KB     8.50  3181     4      471ms <NULL> <Rprofmem [6 × 3]>  <bench_tm [3,185]> <tibble [3,185 × 3]>
#2 as.data.frame(l)    776µs    815µs     1216.    4.91KB     8.87   548     4      451ms <NULL> <Rprofmem [19 × 3]> <bench_tm [552]>   <tibble [552 × 3]>  
#> 

> tibble(x = -5:100, y = 123.456 * (3 ^ x))
# A tibble: 106 × 2
#       x         y
#   <int>     <dbl>
# 1    -5     0.508
# 2    -4     1.52 
# 3    -3     4.57 
# 4    -2    13.7  
# 5    -1    41.2  
# 6     0   123.   
# 7     1   370.   
# 8     2  1111.   
# 9     3  3333.   
#10     4 10000.   
# … with 96 more rows

options(pillar.print_max = n, pillar.print_min = m)

# if nr rows > pillar.print_max then only show pillar.print_min rows

# trims the second column because there is no space to save it
options(pillar.width = 5) 
tibble(x = -5:100, y = 123.456 * (3 ^ x))
# A
#   tibble:
#   106 ×
#   2
#      x
#  <int>
#1    -5
#2    -4
#3    -3
#4    -2
#5    -1
# … with
#   101
#   more
#   rows,
#   and 1
#   more
#   variable: …

# you can find more package options here https://pillar.r-lib.org/reference/pillar_options.html

## SUBSETTING

df1 <- data.frame(x = 1:3, y = 3:1)

class(df1[, 1:2]) # check
#> [1] "data.frame"
class(df1[, 1])   # check
#> [1] "integer"

options(pillar.width=20)
df2 = tibble(x=1:4, y=0:3, z=-1:2)

# A tibble: 4 × 3
#      x     y     z
#  <int> <int> <int>
#1     1     0    -1
#2     2     1     0
#3     3     2     1
#4     4     3     2

class(df2[,3])
# [1] "tbl_df"     "tbl"        "data.frame"
#
# IF this was a data.frame
# this would have been an:
#  //->  [1] "integer"

class(df2[[1]])
# an single column is not a "tibble", just a vector of that data type
# //-> [1] "integer

class(df2[1])  # "[[  ]]" and "[..]" are different
# //- > 
# [1] "tbl_df"     "tbl"        "data.frame"

# With data frame there is partial matching

df <- data.frame(abc = 1)
df$a
# //-> [1] 1

df$ab
# //-> [1] 1


# With tibble there is no such thing as partial mapping of names

df2 <- tibble(abc = 1)
df2$a # should be "abc"
# //->
# NULL
# Warning message:
# Unknown or uninitialised column: `a`. 

# 
# WITH DROP=TRUE, then the original wrapper IS deleted and vector is returned
#
data.frame(a = 1:3)[, "a", drop = TRUE]
#> [1] 1 2 3
tibble(a = 1:3)[, "a", drop = TRUE]
#> [1] 1 2 3



# Normally this would be selecting a single colum hence and this always returns a vector.
# But with DROP=False this means the original datatype (data.frame or tibble) is NOT detroyed.

> df2[1,, drop=F] 
# A tibble: 1 × 1
#   abc  
#   <int>
#1  99 


# tibble(a = numeric(0), b = 0)
# //-->
# A tibble: 0 × 2
# … with 2 variables: a <dbl>, b <dbl>
# tibble(a = numeric(0), b = numeric(0))
# //-->
# A tibble: 0 × 2
# … with 2 variables: a <dbl>, b <dbl>
