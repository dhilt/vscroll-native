import {
  IDatasource,
  Item,
  IAdapterItem,
} from './vscroll';

import consumer from './version';

import { Id, workflowStorage } from './workflow-storage';

export type Template<Data = unknown> = (item: IAdapterItem<Data>) => string;

export class Scroller<Data = unknown> {
  id: Id;
  viewport: HTMLElement;
  datasource: IDatasource<Data>;
  template: Template<Data>;
  scrollable: HTMLElement;

  constructor(
    element: HTMLElement, datasource: IDatasource<Data>, template: Template<Data>
  ) {
    this.viewport = element;
    this.datasource = datasource;
    this.template = template;
    this.scrollable = element.querySelector('[data-vscroll]') as HTMLElement;

    this.id = workflowStorage.add({
      consumer,
      element: this.scrollable,
      datasource: this.datasource as IDatasource,
      onItemsChanged: this.updateViewport.bind(this)
    });
  }

  dispose(): void {
    workflowStorage.clear(this.id);
  }

  updateViewport(oldItems: Item[], newItems: Item[]): void {
    oldItems
      .filter(item => !newItems.includes(item))
      .forEach(item => item.element && item.element.remove());
    const { list, before } = this.makeNewElements(oldItems as Item<Data>[], newItems as Item<Data>[]);
    list.forEach(elt =>
      before.insertAdjacentElement('beforebegin', elt)
    );
  }

  makeNewElements(
    oldItems: Item<Data>[], newItems: Item<Data>[]
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

  createItemElement(item: Item<Data>): HTMLElement {
    const template = document.createElement('template');
    template.innerHTML = this.template(item.get());
    const element = template.content.childNodes[0] as HTMLElement;
    element.setAttribute('data-sid', String(item.$index));
    if (item.invisible) {
      element.style.position = 'fixed';
      element.style.left = '-99999px';
    }
    return element;
  }
}
