import { Scroller, Datasource, IAdapter, Template } from '../src/index';

const element = document.getElementById('viewport');
if (!element) {
  throw 'No viewport found';
}

interface MyItem {
  id: number;
  text: string;
}

const datasource = new Datasource<IAdapter<MyItem>>({
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

const scroller = new Scroller<MyItem>(element, datasource, template);

datasource.adapter.init$.once(async () => {
  console.log(JSON.stringify(datasource.adapter.packageInfo));
  let MAX = 50;
  performance.mark('1');
  while (MAX--) {
    datasource.adapter.fix({ scrollPosition: Infinity });
    await new Promise(resolve =>
      requestAnimationFrame(async () => {
        await datasource.adapter.relax();
        resolve(void 0);
      })
    );
  }
  performance.measure('2');
  console.log(performance.getEntriesByType('measure'));
});