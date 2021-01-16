import { Workflow, Item } from 'vscroll';

export type Id = number;

interface WorkflowBox {
  workflow: Workflow;
  items: Item[];
}

type WorkflowParams = ConstructorParameters<typeof Workflow>[0];

export interface MyWorkflowParams extends Omit<WorkflowParams, 'run'> {
  id: Id;
  onItemsChanged: (oldItems: Item[], newItems: Item[]) => void;
}

export class WorkflowStorage {
  maxId: Id = 0; // increment only!
  map: Map<Id, WorkflowBox> = new Map();

  add(params: MyWorkflowParams): void {
    const box = {
      items: []
    } as unknown as WorkflowBox;
    const workflow = new Workflow({
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
    box.workflow = workflow;
    this.map.set(params.id, box);
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
