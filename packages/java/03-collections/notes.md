# collections

## interfaces

[doc](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

- Collection
  - Set
    - SortedSet
  - List
  - Queue
  - Deque

A map is not a true collection

- Map
- SortedMap

```java
package java.util
interface Collection<E> extends Iterable<E>
```

## Iterbale<E> (no direct implementation)

Remember: Interface `default`s are not `access modifiers`

```java
    default void forEach(Consumer<? super T> action);  // <T is a superclass of ?>
    public Iterator<T> iterator();
    default Spliterator<T> spliterator(); // for parallel traversal of a collection
```

## Iterator<E>

```java
/*"forEach" but for the remainig elements not yet fetched*/
@throws NullPointerException
default void forEachRemaining(Consumer<? super E> action) 
boolean hasNext()
E       next()
@throws UnsupportedOperationException
default void remove() // can only be called once per call to  next()
```

## Consumer<T>

```java
    void accept(T);
    default Consumer<T> andThen(Consumer<? super T> after) // will be run after accepy
```

PS: Consumer `andThen` looks like a thenable.

## Collection<E>

```java
  boolean add(E e)
  boolean addAll(Collection<? extends E> c) // superinterface can add more specific types, yes
  void      clear()
  boolean   contains(Object o)
  boolean   containsAll(Collection<?> c) // unspecified types?
  boolean   equals(Object o)
  int       hashCode()
  boolean   isEmpty()
  Iterable<E> iterator()
  defeault Stream<E> parallelStream()
  boolean   remove(Object o)
  boolean   removeAll(Collection<?> c)
  default   removeIf(Predicate<? super E> filter) // must be type or superType
  
```



