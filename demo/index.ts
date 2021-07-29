import { Scroller, Datasource, Template } from '../src/index';

const elements = {
  viewport: document.getElementById('viewport'),
  core: document.getElementById('core'),
  consumer: document.getElementById('consumer'),
  counter: document.getElementById('counter'),
  minIndex: document.getElementById('minIndex'),
  maxIndex: document.getElementById('maxIndex'),
  reload: document.getElementById('reload'),
  scroll: document.getElementById('scroll'),
} as { [key: string]: HTMLElement };

Object.entries(elements).forEach(([key, element]) => {
  if (!element) {
    throw `No ${key} element found`;
  }
});

interface MyItem {
  id: number;
  text: string;
}

const datasource = new Datasource<MyItem>({
  get: (index, count, success) => {
    const data: MyItem[] = [];
    for (let i = index; i <= index + count - 1; i++) {
      data.push({ id: i, text: 'item #' + i });
    }
    success(data);
  },
  devSettings: {
    debug: false
  }
});

const template: Template<MyItem> = item =>
  `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;
// `<tr class="item"><td><span>${item.data.id}</span>) ${item.data.text}</td></tr>`;

new Scroller<MyItem>({
  element: elements.viewport,
  datasource,
  template
});

const { adapter } = datasource;

adapter.init$.once(() => {
  const { core, consumer } = adapter.packageInfo;
  elements.core.innerHTML = core.name + ' v' + core.version;
  elements.consumer.innerHTML = consumer.name + ' v' + consumer.version;
});

adapter.isLoading$.on(() => {
  const { minIndex, maxIndex, firstIndex, lastIndex } = adapter.bufferInfo;
  elements.counter.innerHTML = isNaN(firstIndex) || isNaN(lastIndex) ? '' : String(lastIndex - firstIndex);
  elements.minIndex.innerHTML = String(minIndex);
  elements.maxIndex.innerHTML = String(maxIndex);
});

elements.reload.addEventListener('click', () =>
  adapter.reload()
);

elements.scroll.addEventListener('click', async () => {
  let interrupt = false;
  setTimeout(() => interrupt = true, 2000);
  while (!interrupt) {
    adapter.fix({ scrollPosition: Infinity });
    await new Promise(resolve =>
      requestAnimationFrame(async () => {
        await adapter.relax();
        resolve(void 0);
      })
    );
  }
});
