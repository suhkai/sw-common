# How JRE turns unix permissions into FileAttribute<?>

```java
public static FileAttribute<Set<PosixFilePermission>> asFileAttribute(Set<PosixFilePermission> perms)
{
    // copy set and check for nulls (CCE will be thrown if an element is not
    // a PosixFilePermission)
    perms = new HashSet<>(perms);
    for (PosixFilePermission p: perms) {
        if (p == null)
            throw new NullPointerException();
    }
    final Set<PosixFilePermission> value = perms;
    return new FileAttribute<>() {
        @Override
        public String name() {
            return "posix:permissions";
        }
        @Override
        public Set<PosixFilePermission> value() {
            return Collections.unmodifiableSet(value);
        }
    };
}
```
