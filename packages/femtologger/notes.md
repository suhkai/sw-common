# Notes

## usage of `ms` library

```javascript
import ms from 'ms';
console.log(ms(3600*1000))
// ->
```

## detection of tty and colors

```javascript
const tty = process.stdout.tty
console.log(process.stdout.isTTY);
console.log(process.stdout.getColorDepth());
console.log(process.stdout.hasColors());
```

## Links for color information

- [link1](https://www.lihaoyi.com/post/BuildyourownCommandLinewithANSIescapecodes.html)
- [link2](https://pisquare.osisoft.com/s/Blog-Detail/a8r1I000000GvXBQA0/console-things-getting-24bit-color-working-in-terminals)
