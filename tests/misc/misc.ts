import { Workflow } from '../../src/vscroll';
import { Scroller as AppScroller, Datasource, IAdapter, Template, IDatasource } from '../../src/index';
import { workflowStorage } from '../../src/workflow-storage';
import { Item } from './types';

type DatasourceWithAdapter<MyItem> = IDatasource<MyItem> & {
  adapter: IAdapter<MyItem>
};

const templateDefault: Template<Item> = item =>
  `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;

const getDefaultDatasource = <MyItem>() => new Datasource<MyItem>({
  get: (index, count, success) => {
    const data: MyItem[] = [];
    for (let i = index; i <= index + count - 1; i++) {
      data.push({ id: i, text: 'item #' + i } as unknown as MyItem);
    }
    success(data);
  },
});

export class Misc<MyItem> {
  element: HTMLElement;
  appScroller: AppScroller<MyItem>;
  datasource: DatasourceWithAdapter<MyItem>;
  adapter: IAdapter<MyItem>;
  workflow: Workflow<MyItem>;
  scroller: Workflow<MyItem>['scroller'];

  constructor() {
    this.element = this.prepareViewportElement();
    const template = templateDefault as unknown as Template<MyItem>;
    this.datasource = getDefaultDatasource();
    this.adapter = this.datasource.adapter;

    this.appScroller = new AppScroller<MyItem>(this.element, this.datasource, template);

    this.workflow = workflowStorage.get(this.appScroller.id);
    this.scroller = this.workflow.scroller;
  }

  prepareViewportElement(): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('id', 'viewport');
    element.classList.add('viewport');
    document.body.appendChild(element);
    return element;
  }

  clear(): void {
    this.appScroller.dispose();
    document.body.innerHTML = '';
  }
}