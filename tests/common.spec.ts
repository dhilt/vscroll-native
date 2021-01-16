import { Scroller, Datasource, Template, IAdapter } from '../src/index';

import { Item as MyItem } from './misc/types';

describe('Common Spec', () => {

  describe('Initialization', () => {
    let viewport: HTMLElement;
    let scroller: Scroller<MyItem>;

    const datasource = new Datasource<IAdapter<MyItem>>({
      get: (index, count, success) => {
        const data = [];
        for (let i = index; i <= index + count - 1; i++) {
          data.push({ id: i, text: 'item #' + i });
        }
        success(data);
      },
    });

    const template: Template<MyItem> = item =>
      `<div class="item"><span>${item.data.id}</span>) ${item.data.text}</div>`;

    beforeEach(() => {
      viewport = document.createElement('div');
      viewport.classList.add('viewport');
      viewport.setAttribute('id', 'viewport');
      document.body.appendChild(viewport);
      scroller = new Scroller<MyItem>(viewport, datasource, template);
    });

    it('should instantiate', (done) => {
      expect(scroller instanceof Scroller).toBe(true);
      expect(scroller.viewport).toBe(viewport);
      expect(scroller.datasource).toBe(datasource);
      expect(scroller.template).toBe(template);
      done();
    });
  });

});
