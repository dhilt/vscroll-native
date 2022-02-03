import { Workflow } from 'vscroll';

import { Scroller, Datasource } from '../src/index';
import { Misc } from './misc/misc';

import { Item as MyItem } from './misc/types';

describe('Common Spec', () => {

  describe('Initialization', () => {
    let misc: Misc<MyItem>;

    beforeEach(() => {
      misc = new Misc<MyItem>();
    });

    afterEach(() => {
      misc.clear();
    });

    it('should instantiate', () => {
      expect(misc.appScroller instanceof Scroller).toBe(true);
      expect(misc.workflow instanceof Workflow).toBe(true);
      expect(misc.datasource).toBe(misc.appScroller.datasource);
      expect(misc.datasource instanceof Datasource).toBe(true);
      expect(misc.adapter).toBe(misc.appScroller.datasource.adapter);
    });

    it('should provide correct HTML on start', () => {
      const { viewport, routines } = misc.workflow.scroller;
      expect(routines.element.nodeType).toBe(1);
      expect(routines.viewport.nodeType).toBe(1);
      expect(viewport.paddings.backward.element.nodeType).toBe(1);
      expect(viewport.paddings.forward.element.nodeType).toBe(1);
      expect(routines.viewport).toBe(misc.element);
    });

    it('should initialize', (done) => {
      expect(misc.datasource.adapter.init).toBe(false);
      misc.datasource.adapter.init$.on(() => {
        expect(misc.datasource.adapter.init).toBe(true);
        done();
      });
    });

  });

});
