# @mango/debug

@mango/debug is an esm (and also a commonjs) ultra fast mini-logger written in typescript.

It was created because the current version of npm `debug` does not have an esm module.

## Highlights

- turn on/off logging namespace/scope logging in real time.
- works in web agent as-well in node
- optional tty colors or css colors separating different namespaces
- optional shows ms (humanized time) difference between logs
- optional shows full date time (for log files)
- lazy conversion from data to log string (only evaluates when it logs);

## Installation

```bash
npm i @mango/debug
```

### Quick Example

This example shows the main features

_index.js_

```typescript
import debug from './dist/esm/index.mjs';

// logger for namespace "worker#1"
const printer1 = debug('worker#1');

// logger for namespace "worker#2"
const printer2 = debug('worker#2');

const obj1 = { name: 'Frank', lastName: 'Herbert' };
const obj2 = { name: 'Sandra', lastName: 'Smith' };

printer1('person: %o', obj1); // first time "worker#1" logs

// wait 1 sec
await new Promise((resolve) => setTimeout(resolve, 1000));

printer2('person: %o', obj2); // first time "worker#2" logs

// wait 1 sec
await new Promise((resolve) => setTimeout(resolve, 1000));

printer1('person: %o', obj1); // second time "worker#1" logs, (2s after the prev log)
printer2('person: %o', obj2); // second time "worker#2" logs, (1s after the prev log)
```

Run it with:

```bash
env DEBUG=* node index.js
```

<div>output:</div>
<img src="./screenshot-01.png" style="width: calc(359px * 1.5); height: calc( 75px * 1.5 ); image-rendering: pixelated;">

## Concepts

### Terms

| term      | description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| printer   | a instance of a logger scoped by a namespace name on creation of the printer |
| namespace | a human identifiable name partitioning logging in your program               |

### Namespaces

A logger is always associated with a namespace, and is created via the function `debug`.

A logger is of an implementation of interface `Printer`.

How to create a logger

```typescript
function debug(ns: string): Printer;
```

Arguments:

- `ns`: namespace

Returns:

```typescript
export interface Printer {
  // the interface is callable
  (formatter: string, ...args: any[]): void;
  get color(): string;
  get diff(): number;
  get enabled(): boolean;
  get namespace(): string;
}
```

Properties on `Printer`:

- `color`: css or tty color for this logger, unless configuration option `DEBUG_COLORS` is set to `false`.
- `diff`: time difference (ms) since the last time this `Printer` was called.
- `enabled`: If this logger (namespace) is enabled or not. Enabling of a namespace depends on configuration option `DEBUG`.
- `namespace`: The namespace this logger belongs to.

**NOTE**: The single namespace can have multiple `Printer` instances, they all refer to the same `Printer`.

_index.mjs_

```typescript
import debug from '@mango/debug';

import assert from 'node:assert';

const printer1 = debug('#worker1'); // same namespace
const printer2 = debug('#worker1'); // same namespace

printer1('some logging');
await new Promise((resolve) => setTimeout(resolve, 500));

printer1('some logging');

assert(printer1.diff === printer2.diff); // same 0.5 sec
assert(printer1.enabled === printer2.enabled);
assert(printer1.color === printer2.color);
assert(printer1.namespace === printer2.namespace);
```

<div>output:</div>
<img src="./screenshot-02.png" style="width: calc( 382px * 0.7 ); height: calc( 103px * 0.7 ); image-rendering: pixelated;">

### Configuration

#### During runtime

Configure enable/disable of logging via `setConfig`. You can always change the configuration at runtime after specifying it via environment variables (node) or `localStorage` (web)

```typescript
type Config = {
  namespaces: string; // what namespaces to show;
  showDate: boolean;
  useColors: boolean;
  web: boolean;  // not used when setting config variables
};

function setConfig(options: Partial<Omit<Config, 'web'>>): boolean;
function getConfig(): Config;
```

Arguments:
- options.namespaces: specify namespaces to activate logging for, see [ns patterns]().
- options.showDate: prefix log line with ISO 8601 string
- options.useColors: use ansi or css colors
- options.web: does not exist on argument to `setConfig` will be returned by `getConfig`

Example:

```typescript
import debug from '@mango/debug';

const printer = debug('worker1234');

setConfig({ namespaces: null});
printer('you will NOT see this line');

setConfig({ namespaces: 'worker*' });
printer('you will see this line');
```



DEBUG
DEBUG_HIDE_DATE
DEBUG_COLORS

export interface Printer {
(formatter: string, ...args: any[]): void;
// assigned color
color: string;
// time difference for this printer
diff: number;
// enabled (getter/setter)
enabled: boolean;
// namespace of this printer
namespace: string;
}

function getLineInfo(n = 2): LineInfo | never {

```

```
