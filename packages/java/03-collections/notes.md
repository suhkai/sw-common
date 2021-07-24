# collections

## interfaces

[doc](https://docs.oracle.com/javase/tutorial/collections/interfaces/index.html)

- Collection: ok
  - Set: ok
    - SortedSet:ok
      - NavigableSet:ok
  - List: ok
  - Queue: ok
  - Deque: ok

A map is not a true collection

- Map: ok
  - SortedMap:

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

## NavigableSet

`public interface NavigableSet<E> extends SortedSet<E>`
A SortedSet extended with navigation methods reporting closest matches for given search targets.

```java
E               ceiling(E e);// Returns the smallest of (e, max), or null if there is no such element, ClassCastException, NullPointerException
Iterator<E>     descendingSet()
E               floor(E e); // returns the largest of (min, e), or null if there is no such element, ClassCast-and-NullPointerException
NavigableSet<E> headSet(E toElement, boolean inclusive); //VIEW: "toElement" is high endpoint of the view, throws Exceptions

E               higher(E e);// returns smallest, strictly geater then "e" or null,, ClassCastException, NullPointerException
E               lower(E e);// returns greatest, strictly smaller then "e" or null, throws Errors
E               pollFirst();//[head] removes+returns lowest element or null, doesn't throw
E               pollLast();//[tail] removes+returns highest element or null, doesn't throw
NavigableSet<E> headSet(E toElement, boolean inclusive); //VIEW:
NavigableSet<E> tailSet(E fromElement, boolean inclusive); //VIEW:
```

## `BiFunction<T,U,R>` (functional interface)

- T first argument
- U second argument
- R return value

```java
R                             apply(T t, U u);
default <V> BiFunction<T,U,V> andThen(Function<? super R> after);
```


## `Map<K,V>`

`public interface Map<K,V>`

- null as value not allowed (map.get(k) returns null as "key not mapped")
- Not permissible for a map to contain itself as a key
- Map can contain itself as a value
- Map method implementation may throw "UnsupportedOperationException", but this is not mandated

3 views (Collections)

- only keys
- only values
- key-value combination

```java
// Map<K,V>
void          clear();// removes all mappings
/*
  1.if the key has no mapping:
    - if the remapping is null, do nothing
    - if the remapping is non null, bind the key to this value
  2.if the key has a mapping 
    - if the remapping is null, removes binding for key
    - if the remapping is non null, replaces the binding for key 
*/
default V     compute(K key, BiFunction<? super K, ? super V> remap)
;
/*
  1. if the key is mapped do nothing
  2. if the remapping is null do nothing
  3. rebind key to new value
*/
default V     computeIfAbsent(K key, BiFunction<? super K, ? super V> remap);
/*
  1. if the key is not mapped do nothing
  2. if remapping returns null, remove key binding
  3. bind "key" to new value
*/
default V     computeIfPresent(K key, BiFunction<? super K,? super V,? extends V> remappingFunction);

boolean       containsKey(Object key);// (throws cast and nullptrex) returns true if key is bound
boolean       containsValue(Object value);// throws, linear time O(n), returns true for the first value encountered value.equals(e);

Set<Map.Entry<K,V>> entrySet(); // VIEW!!, if you mutate the returned set the underlying Map is also mutated, if iteration is in progress and the underlying map is mutated the results of the iteration are undefined (except if you mutate via the iterator itself)
boolean             equals(Object o); // shortcut for  m1.entrySet().equals(m2.entrySet())

default void        forEach(BiConsumer<? super K, ? super V> action); // throws

V             get(Object key); //[] value is, returned or null, throws exceptions

default V     getOrDefault(Object key, V defaultValue);// throws returns binding of key or else defaultValue if there is no binding

/*The hash code of a map is defined to be the sum of the hash codes of each entry in the map's entrySet()*/
int           hashCode();// m1.equals(m2) implies m1.hashCode() == m2.hashCode()

boolean       isEmpty();// map has no key-value mapping

Set<K>        keySet();//VIEW of keys
/*
1. if key is not bound and value is null do nothing
2. if key is not bound and value is NOT null bind key to value
3. if key is bound and remapping is null, remove bind
4. if key is bound and remapping is not null bind key to remapped value 
*/
default V     merge(K key, V value, BiFunction<? super V,? super V, ? extends V> remappingFunction)

V             put(K key, V value); // some implementations support do not support inserting "null", throws 4 exceptions, value is, 

V             putAll(Map<? extends K, ? extends V> m);//throws, bulk operation for "put(key,value)"
/*
1. if key is bound do nothing
2. if value is null do nothing
3. bind key with value
*/
default V     putIfAbsent(K key, V value); // throws

V               remove(Object key); // remove binding if preset, returns value or null, throws 3 exceptions

default boolean remove(Object key, Object value);// remove only if key and value are the same

/*
1. if the key is not bound, do nothing, return null
2. if the value is null, throw error on some implementations
3. bind key to value
*/
default V       replace(K key, V value);// throws

/*
1. if key is not bound do nothing
2. if key is bound but oldValue.equals(get(key)) is false do nothing
3. if key is bound and oldValue.equals(get(key)) is true, set to new value
*/
default boolean replace(K key, V oldValue, V newValue);

/*
 for (Map.Entry<K, V> entry : map.entrySet())
     entry.setValue(function.apply(entry.getKey(), entry.getValue()));
*/
default V       replaceAll(BiFunction<? super K, ? super V, ? extends V> replace);// bulk method for replace, throws

int             size();//number of mappings in the map

Collection<V>   values();//VIEW, all values
```

## `SortedMap<K,V>`

`public interface SortedMap<K,V> extends Map<K,V>`

- Provides ordering of keys.
- several constructors taking a `Comperator`, `Map` or `SortedMap`.

```java
Comperator<? super K>     comperator(); // returns comperator used
K                         firstKey(); // throws if empty map
SortedMap<K,V>            headMap(K toKey); //VIEW: strictly less then `toKey`, throws
K                         lastKey();// throws if empty map
SortedMap<K,V>            subMap(K fromKey, K toKey); //View: toKey is exclusive
SortedMap<K,V>            tailMap(K fromKey); //View: stricly greater then "fromKey".
Collection<V>             values();//View:
```

