

## how to build a plot

### 2.1 basic plot

| A | B  | C  | D |
|---|----|----|---|
| 2 | 3  | 4  | a |
| 1 | 2  | 1  | a |
| 4 | 5  | 15 | b |
| 9 | 10 | 80 | b |



| x | y  | Shape |
|---|----|-------|
| 2 | 4  | a     |
| 1 | 1  | a     |
| 4 | 15 | b     |
| 9 | 80 | b     |


|   | x | y  | Shape  |
|---|---|----|--------|
| a | 2 | 4  | circle |
| a | 1 | 1  | circle |
| b | 4 | 15 | square |
| b | 9 | 80 | square |

## 3 COMPONENTS OF THE LAYERED GRAMMAR

In practice, many plots have
(at least) three layers: the data, context for the data, and a statistical summary of the data.
For example, to visualize a spatial point process, we might display the points themselves, a
map giving some spatial context, and the contours of a two-dimensional density estimate.

### 3.1 LAYERS

the plot we see on the screen

- data and aesthetic mapping
- a statistical transformation (stat)
- a geometric object (geom)
- a position adjustment.

Example

##GPL
line(position(smooth.linear(x*y)), color(z))

##GGPLOT2
layer(aes(x=x, y=y, color=z), geom="line", stat="smooth")


#### 3.1.1 Data and Mapping

With "Mapping" it is meant to map (for example) "age" to the x-axis and "earnings" to the y-axis and "bonus" to the size of the geometric (bigger cross or color of the "diamond", etc)

#### 3.1.2 Statistical Transformation

-smoother
-equicontour lines
-whatever transformation, or convolution


Restriction that insures smoothness:
location scale invariant

f(x) is the "stat"

1. f(x + a) = f(x) + a

2. f(b * x) = b*f (x)

This ensures that the transformation is invariant under translation and scaling

is a f(x) = x stat "location invariant"?

f(x+a) = x+a (sufficed)
f(b*x) = b*x = b*f(x) (sufficed)


Example:
test stat: `f(x) = p*x+q`

```bash
1. f(x+a) = p*(x+a)+q = p*x+p*a + q = f(x) + p*a => violation except when p = 1
2. f(b*x) = p(b*x)+q = b*p*x+q = f(x) + b*p => violation except if b = 1 and p =1
```

Example:
test stat: `f(x) = E(x) (mean)`
```bash
1. f(x+a) = E(x+a) = E(x) +a: ok
2. f(x*b) = E(x*b) = b*E(x)
```

Example:
test stat: `f(x) = var(x)`
```bash
1. f(x+a) = var(x+a) = a^2 + 2*E(x)*a + E(x^2) != f(x)+a
2. f(x*b) = var(x*b) = b^2*var(x) != b*f(x)
```

statistical transformation

| statistic | description                                 |
|-----------|---------------------------------------------|
| bin       | divide range into bins                      |
| boxplot   | compute statistics for boxplot              |
| contour   |                                             |
| density   | compute 1d density estimate                 |
| jitter    | Jitter values by adding small random value  |
| qq        | Calculate values for quantile-quantile plot |
| quantile  | Quantile regression                         |
| smooth    | Smoothed conditional mean of y given x      |
| summary   | Aggregate values of y for given x           |
| unique    | Remove duplicated observations              |

#### 3.1.3 Geometric Object

- 0d: point, text,
- 1d: path, line (ordered path),
- 2d: polygon, interval.

#### 3.1.4 Position Adjustment

### 3.2 Scales

Controls mapping from data -> aes attributes

### 3.3 COORDINATE SYSTEM

### 3.4 FACETING

In Wilkinson’s grammar, faceting is an aspect of the coordinate system, 

## 4. A HIERARCHY OF DEFAULTS

ggplot() +
	layer(
		data = diamonds, mapping = aes(x = carat, y = price),
		geom = "point", stat = "identity", position = "identity"
	) +
scale_y_continuous() +
scale_x_continuous() +
coord_cartesian() 

ggplot() +
	layer( 
		data = diamonds, mapping = aes(x = carat, y = price),
		position = "identity",geom = "point", stat="identity"
	)
	
ggplot(diamonds, aes(caret, price)) + geom_point()

ggplot(diamonds, aes(carat, price)) + geom_point() +

# stat_smooth(method) returns another layer, see below

	stat_smooth(method = lm) +
	scale_x_log10() +
	scale_y_log10()
#	
#	
#Above is shorthand for
#
#
ggplot() +
	layer(
		data = diamonds, mapping = aes(x = carat, y = price),
		geom = "point", stat = "identity", position = "identity"
	) +
#  Add layer below if you want to see a "lm" regression line	
#	layer(
#		data = diamonds, mapping = aes(x = carat, y = price),
#		geom = "smooth", position = "identity",
#		stat = "smooth", method = lm
#	) +
	scale_y_log10() +
	scale_x_log10() +
	coord_cartesian()	
	
## 5. AN EMBEDDED GRAMMAR

## 6. IMPLICATIONS OF THE LAYERED GRAMMAR

• the histogram, which maps bar height to a variable not in the original dataset, and
raises questions of parameterization and defaults,
• polar coordinates, which generate pie charts from bar charts,
• variable transformations, and the three places in which they can occur.

### 6.1 HISTOGRAMS

```R
ggplot(data = diamonds, mapping = aes(price)) +
	layer(
		geom = "bar", stat = "bin", mapping = aes(y = ..count..)
	)
```	

```R
ggplot(diamonds, aes(x = price)) + geom_histogram()
```