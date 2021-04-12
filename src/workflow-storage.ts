import { Workflow, Item } from './vscroll';

export type Id = number;

interface WorkflowBox {
  workflow: Workflow;
  items: Item[];
}

type WorkflowParams = ConstructorParameters<typeof Workflow>[0];

interface MyWorkflowParams extends Omit<WorkflowParams, 'run'> {
  onItemsChanged: (oldItems: Item[], newItems: Item[]) => void;
}

class WorkflowStorage {
  maxId: Id = 0;
  map: Map<Id, WorkflowBox> = new Map();

  add(params: MyWorkflowParams): Id {
    const box = {
      items: []
    } as unknown as WorkflowBox;
    box.workflow = new Workflow({
      consumer: params.consumer,
      element: params.element,
      datasource: params.datasource,
      run: (items) => {
        if (!items.length && !box.items.length) {
          return;
        }
        params.onItemsChanged(box.items, items);
        box.items = items;
      }
    });
    this.maxId++;
    this.map.set(this.maxId, box);
    return this.maxId;
  }

  getBox(id: Id): WorkflowBox {
    const box = this.map.get(id);
    if (!box) {
      throw 'Can\'t get the Workflow';
    }
    return box;
  }

  get<MyItem>(id: Id): Workflow<MyItem> {
    return this.getBox(id).workflow as Workflow<MyItem>;
  }

  clear(id: Id): void {
    this.get(id).dispose();
    this.map.delete(id);
  }
}

export const workflowStorage = new WorkflowStorage();
