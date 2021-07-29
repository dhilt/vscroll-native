[![npm version](https://badge.fury.io/js/vscroll-native.svg)](https://www.npmjs.com/package/vscroll-native)

# vscroll-native

vscroll-native is a JavaScript library built on top of the [vscroll](https://github.com/dhilt/vscroll) library to represent unlimited datasets using virtualization technique. The idea behind virtualization is to increase the performance of large scrollable lists by rendering only a small portion of the dataset, which is visible to the end user at a moment, while the rest of the dataset is emulated with special padding elements that keep the scrollbar parameters consistent, making the UX close to a simple scrollable list without virtualization.

- [Getting](#getting)
- [Usage](#usage)
  - [Viewport](#1-viewport)
  - [Template](#2-template)
  - [Datasource](#3-datasource)
- [Adapter](#adapter)
- [Development](#development)
 
## Getting

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/vscroll-native"></script>
<script>
  const scroller = new VScrollNative.Scroller({...});
</script>
```

### NPM

```
npm install vscroll-native
```

```js
import { Scroller } from 'vscroll-native';

const scroller = new Scroller({...});
```

## Usage

The `vscroll-native` module exports two entities: `Scroller` and `Datasource`. The virtual scroll engine runs during the `Scroller` class instantiation. The constructor of the `Scroller` class requires 3 arguments packed in a settings object: viewport HTML element, single item HTML template factory and the datasource.

```js
import { Scroller, Datasource } from 'vscroll-native';

const element = document.getElementById('viewport');

const template = item =>
  `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;

const datasource = new Datasource({
  get: (index, length, success) => {
    const data = [];
    for (let i = index; i <= index + count - 1; i++) {
      const item: Data = { id: i, text: 'item #' + i };
      data.push(item);
    }
    success(data);
  }
});

new Scroller({ element, datasource, template });
```

This basic example is available at https://dhilt.github.io/vscroll-native/samples/cdn/. Let's clarify what the `Scroller` is and how to instantiate it properly. In terms of the TypeScript the argument object of the `Scroller` constructor has the following type:

```typescript
interface IScrollerParams<Data = unknown> {
  element: HTMLElement;
  template: Template<Data>;
  datasource: IDatasource<Data>;
}
```

### 1. Viewport

The first parameter of the `Scroller` is an HTML __element__ that should provide the limited viewport with scrollable contents. It should be present in DOM before instantiating the `Scroller`.

```js
const element = document.getElementById('viewport');
```

```html
<div id="viewport"></div>
```

```css
#viewport {
  height: 240px;
  width: 150px;
  overflow-y: scroll;
}
```

This is the simplest case with the default elements structure that is managed by the Scroller automatically.

### 2. Template

The second parameter of the `Scroller` is a factory of single item __template__. This is a function that should return a string that will be used by the Scroller to render items in the visible part of the viewport.

```js
const template = ({ data }) =>
  `<div class="item"><span>${data.id}</span>) ${data.text}</div>`;
```

The argument of the `template` factory is an item object containing data to be present to the end user. With TypeScript it can be written as follows:

```typescript
import { Template } from 'vscroll-native';

interface Data {
  id: number;
  text: string;
}

const template: Template<Data> = ({ data }) =>
  `<div class="item"><span>${data.id}</span>) ${data.text}</div>`;
```

### 3. Datasource

The third parameter of the `Scroller` is a special __datasource__ object, providing dataset items in runtime. There are two ways of how it can be defined. First, as an object literal of `IDatasource` type:

```typescript
import { IDatasource } from 'vscroll-native';

const datasource: IDatasource<Data> = { get, settings };
```

Second, as an instance of `Datasource` class, whose constructor requires an object of `IDatasource` type:

```typescript
import { Datasource } from 'vscroll-native';

const datasource = new Datasource<Data>({ get, settings });
```

The second way makes the Adapter API available via `datasource.adapter` property after the Datasource is instantiated (see [Adapter](#adapter) section). In both cases we need to arrange the object of `IDatasource` type:

```typescript
interface IDatasource<Data = unknown> {
  get: DatasourceGet<Data>;
  settings?: Settings<Data>;
  devSettings?: DevSettings;
}
```

The `settings` parameter is optional (as well as `devSettings`), please refer to ngx-ui-scroll documentation to get more information about it: https://github.com/dhilt/ngx-ui-scroll#settings.

The `get` parameter is the main point of the App-Scroller integration. It should provide a portion of dataset by index and count:

```typescript
const get = <Data = unknown>(
  index: number, count: number, success: (data: Data[]) => void
) => 
  success(Array.from({ length: count }).map((i, j) =>
    ({ id: index + j, text: 'item #' + (index + j) })
  ));
```

This is the simplest example of the synchronous `Datasource.get` implementation, where items are generated at runtime and passed to the Scroller via `success` callback. There are two additional signatures for asynchronous implementations: promise-based and observable-based.

```js
const get = (index, count) => new Promise((resolve, reject) => {
  makeAjaxCall(index, count)
    .then(data => resolve(data))
    .catch(error => reject(error))
});
// should be equivalent to 
// const get = (index, count) => makeAjaxCall(index, count);
```

```js
import { Observable } from 'rxjs';

const get = (index, count) => new Observable(subscriber => {
  makeAjaxCall(index, count)
    .then(data => subscriber.next(data))
    .catch(error => subscriber.error(error))
    .finally(() => subscriber.complete())
});
```

## Adapter

`Adapter` is a special entity providing massive functionality to assess and manipulate Scroller's data/parameters at runtime. It is available if the `Datasource` is created via operator `new`.

```js
import { Datasource, Scroller } from 'vscroll-native';

const ds = new Datasource({ ... });

ds.adapter.init$.once(() => console.log('Adapter works, the second output'));

new Scroller({ datasource: ds, ... });

console.log('Scroller works, the first output');
```

Note, that the adapter subscriptions become available right after instantiating the `Datasource`, but they start work only after the `Scroller` instantiation.

Please refer to the ngx-ui-scroll documentation for more information on the Adapter API: https://github.com/dhilt/ngx-ui-scroll#adapter-api. An important difference should be taken into account, this is how the reactive props are implemented:
 - ngx-ui-scroll Adapter implements RxJs subjects,
 - vscroll-native Adapter implements [Reactive](https://github.com/dhilt/vscroll/blob/main/src/classes/reactive.ts) entities.

The vscroll-native demo contains some basic examples of the Adapter usage: https://dhilt.github.io/vscroll-native/.


## Development

The `vscroll-native` module is built on top of the [vscroll](https://github.com/dhilt/vscroll) solution and can be treated as a `vscroll` wrapper or consumer. It is designed to demonstrate how the `vscroll` solution may work in non-specific environment. The sources of the `vscroll-native` module are relatively small (https://github.com/dhilt/vscroll-native/tree/main/src); they do

  - instantiate the virtual scrolling Workflow (main entity of the vscroll module),
  - advance DOM manipulations in accordance with the Workflow requirements,
  - provide some infrastructure logic such as internal Workflow instance storage and external Scroller class.

The issues, requests and ideas that are not targeting these particular points should be addressed to the [vscroll](https://github.com/dhilt/vscroll) repository.

The most important point of the development of the vscroll-native module is the DOM-related logic. Another important area is [the demo app](https://github.com/dhilt/vscroll-native/tree/main/demo) development. Also, [the tests]((https://github.com/dhilt/vscroll-native/tree/main/tests)) are very poor and need extension.

There are some npm scripts:

  - `npm start`, runs the demo app over the vscroll-native sources at 5000 port
  - `npm run build`, builds the vscroll-native distributive
  - `npm run build-app`, builds the demo app distributive
  - `npm test`, performs linter and tests in a single run
  - `npm run jest`, runs tests in a watch mode

______


2021 &copy; [Denis Hilt](https://github.com/dhilt)
