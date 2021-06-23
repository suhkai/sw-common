class Point(val x: Int, val y: Int) {
  override def equals(other: Any) = other match {
    case that: Point => this.x == that.x && this.y == that.y; case _ => false
  }
  override def toString = s"x:${this.x}, y:${this.y}"
  override def hashCode = (this.x, this.y).##
}
