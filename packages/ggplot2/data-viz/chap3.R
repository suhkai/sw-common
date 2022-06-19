## 3.2.2 Creating a ggplot

ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy))