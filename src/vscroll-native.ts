import {
  Workflow,
  IDatasource,
  Item,
  IAdapterItem,
} from 'vscroll';

import consumer from './version';

export type Template<MyItem = unknown> = (item: IAdapterItem<MyItem>) => string;

export class Scroller<MyItem = unknown> {
  viewport: HTMLElement;
  datasource: IDatasource<MyItem>;
  template: Template<MyItem>;
  scrollable: HTMLElement;

  workflow: Workflow<MyItem>;
  private _items: Item<MyItem>[] = [];

  constructor(
    element: HTMLElement, datasource: IDatasource<MyItem>, template: Template<MyItem>
  ) {
    this.viewport = element;
    this.datasource = datasource;
    this.template = template;
    this.init();
  }

  init(): void {
    this.prepareViewport();
    this.workflow = new Workflow<MyItem>({
      consumer,
      element: this.scrollable,
      datasource: this.datasource,
      run: (items) => this.items = items,
    });
  }

  dispose(): void {
    this.workflow.dispose();
  }

  set items(items: Item<MyItem>[]) {
    if (!items.length && !this._items.length) {
      return;
    }
    this.updateViewport(this._items, items);
    this._items = items;
  }

  prepareViewport(): void {
    while (this.viewport.firstChild) {
      this.viewport.removeChild(this.viewport.firstChild);
    }
    this.scrollable = document.createElement('div');
    this.scrollable.setAttribute('vscroll', '');
    this.viewport.append(this.scrollable);
    const bwdPaddingElement = document.createElement('div');
    bwdPaddingElement.setAttribute('data-padding-backward', '');
    const fwdPaddingElement = document.createElement('div');
    fwdPaddingElement.setAttribute('data-padding-forward', '');
    this.scrollable.append(bwdPaddingElement);
    this.scrollable.append(fwdPaddingElement);
  }

  updateViewport(oldItems: Item<MyItem>[], newItems: Item<MyItem>[]): void {
    oldItems
      .filter(item => !newItems.includes(item))
      .forEach(item => item.element.remove());
    const { list, before } = this.makeNewElements(oldItems, newItems);
    list.forEach(elt =>
      before.insertAdjacentElement('beforebegin', elt)
    );
  }

  makeNewElements(
    oldItems: Item<MyItem>[], newItems: Item<MyItem>[]
  ): { list: HTMLElement[], before: HTMLElement } {
    let before = this.workflow.scroller.viewport.paddings.forward.element;
    const list = [];
    for (let i = newItems.length - 1; i >= 0; i--) {
      const item = newItems[i];
      if (oldItems.includes(item)) {
        if (!list.length) {
          before = item.element;
          continue;
        } else {
          break;
        }
      }
      list.unshift(this.createItemElement(item));
    }
    return { before, list };
  }

  createItemElement(item: Item<MyItem>): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('data-sid', item.nodeId);
    if (item.invisible) {
      element.style.position = 'fixed';
      element.style.left = '-99999px';
    }
    element.innerHTML = this.template(item.get());
    return element;
  }
}
