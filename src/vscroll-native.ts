import {
  IDatasource,
  Item,
  IAdapterItem,
} from 'vscroll';

import consumer from './version';

import { Id, workflowStorage } from './workflow-storage';

export type Template<MyItem = unknown> = (item: IAdapterItem<MyItem>) => string;

export class Scroller<MyItem = unknown> {
  id: Id;
  viewport: HTMLElement;
  datasource: IDatasource<MyItem>;
  template: Template<MyItem>;
  scrollable: HTMLElement;

  constructor(
    element: HTMLElement, datasource: IDatasource<MyItem>, template: Template<MyItem>
  ) {
    this.id = workflowStorage.maxId++;
    this.viewport = element;
    this.datasource = datasource;
    this.template = template;

    this.prepareViewport();
    workflowStorage.add({
      id: this.id,
      consumer,
      element: this.scrollable,
      datasource: this.datasource as IDatasource,
      onItemsChanged: this.updateViewport.bind(this)
    });
  }

  dispose(): void {
    workflowStorage.clear(this.id);
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

  updateViewport(oldItems: Item[], newItems: Item[]): void {
    oldItems
      .filter(item => !newItems.includes(item))
      .forEach(item => item.element && item.element.remove());
    const { list, before } = this.makeNewElements(oldItems as Item<MyItem>[], newItems as Item<MyItem>[]);
    list.forEach(elt =>
      before.insertAdjacentElement('beforebegin', elt)
    );
  }

  makeNewElements(
    oldItems: Item<MyItem>[], newItems: Item<MyItem>[]
  ): { list: HTMLElement[], before: HTMLElement } {
    let before = workflowStorage.get(this.id).scroller.viewport.paddings.forward.element;
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
