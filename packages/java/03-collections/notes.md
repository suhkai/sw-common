# collections

## interfaces

[doc](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

- Collection: ok
  - Set: ok
    - SortedSet:
      - NavigableSet:
  - List: ok
  - Queue: ok
  - Deque: ok

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
  Iterable<E> iterator():
  defeault Stream<E> parallelStream();
  boolean   remove(Object o)
  boolean   removeAll(Collection<?> c)
  /* must be type or superType */
  default   removeIf(Predicate<? super E> filter)
  boolean   retainAll(Collection<?> c)
  int       size()
  default Spliterator<E> spliterator()
  default Stream<E> stream()
  Object[] toArray() // this is trange why not <E> E[]
  // store the collection into "a", T must be a supertype of E
  <T> T[] toArray(T[] a)
  
```

```java
interface Predicate<T> {
    default Predicate<T> and(Predicate<? super T> other);
    static <T> Predicate<T> isEqual(Object targetRef);
    default Predicate<T> negate()
    default Predicate<T> or(Predicate<? super T> other);
    boolean test(T t);
}
```

## Set interface

Set has the same methods as `Collection` and `Iterable`

## List interface

- Ordered collection (sequence)
- Allows duplicates
- Allows for nulls (some implementation dont allow for null)

Add all methods of Sequence interface, plus the following

```java
void            add(int index, E element);
boolean         addAll(int index, Collection<? extends E> c);
E               get(int index);
int             indexOf(Object o);
int             lastIndexOf(Object o);
ListIterator<E> listIterator();
ListIterator<E> listIterator(int index);
E               remove(int index);
default void    replaceAll(UnaryOperator<E> operator);
boolean         retainAll(Collection<?> c);
// 
E               set(int index, E element);
default void    sort(Comperator<? super E> c);
List<E>         subList(int fromIndex, int toIndex);
```

```java
public interface Function<T,R> {
  
  default <V> Function<T,V> andThen(
          Function<? super R, ? extends V> after)

  R         apply(T t)
  
  default <V> Function<V,R> compose<Function<? super V, ? extends T> before)

  // returns a function that when call only returns its argument
  static <T> Function<T,T> identity() /* the actual body {
      return t -> t
  }*/
}

```java
public interface UnaryOperator<T> extends Function<T,T> {
  static <T> UnaryOperator<T> identity(); // ok
  // inherited from Function<T, R>
  andThen
  apply
  compose
}
```

## Queue interface

`public interface Queue<E> extends Collection<E>`

```java
public interface Queue<E> extends Collection<E> {
    E element();        // the head of the queue, throws if queue is empty
    boolean offer(E e); // offer element to the queue, can fail, does not throw
    E peek();           // the head of the queue, does not throw
    E poll();           // retrieves + removes the head of this queue or null
    E remove();         // retrieves and removes the head or exception? 
}
```

## Deque: `[D]ouble [e]nded [que]ue

Aliases: deck

LIFO and FIFO possible

`public interface Deque<E> extends Queue<E>`

```java
void        addFirst(E e); //add at the front of the queue, can throw 4 exceptions if adding is not possible
void        addLast(E e); //add at the end of the queue, can throw 4 exceptions if adding is not possible
Iterator<E> descendingIterator(); // Returns an iterator in reverse order

E           getFirst(); //[head]does not remove, throws if empty
E           getLast(); //[tail] does not remove, throws if empty
boolean     offer(E e); //[tail] inserts at tail end of the queue, doesnt throw
boolean     offerFirst(E e); //[head] inserts at the head of the queue, doesnt throw
boolean     offerLast(E e); //[tail] inserts at the tail of the queue, doesnt throw
E           peek(); //[head] looks, doesnt remove,doesnt throw
E           peekFirst(); //[head] looks, doesnt throw
E           peekLast(); //[tail] looks, doesnt throw
E           poll();//[head], removes, doesnt throw
E           pollFirst();//[head], removes, doesnt throw
E           pollLast();//[tail], removes, doesnt throw
E           pop();//[head], removes, throws
void        push(E e);//[head], adds, throws
E           remove();//[head], removes, throws
E           removeFirst();//[head], remove, throws
E           removeLast();//[last], remove, throws
bool        removeLastOccurrence(Object o);//[last] removes element equal to "o", throws
```

## `SortedSet<E>`

`public interface SortedSet<E> extends Set<E>

Set + ordering:

- natural ordering
- provide `Comparitor<E>`

```java
Comperator<? super E> comperator();// returns comperator used
E                     first();//[head], remove ,throws
SortedSet<E>          headSet(E toElement)//[head]s, returns a VIEW (same storage) of all elements strictly less then to `toElement`.
E                     last();//[tail], remove, throws
default Spliterator<E> spliterator();// 
SortedSet<E>          subSet(E fromElement, E toElement);// VIEW, fromElement (inclusive) to toElement (exclusive), can throws

SortedSet<E>          tailSet(E fromElement);// VIEW, from "fromElements" onwards, can throw
```

```