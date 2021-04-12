import { IAdapter, IDatasource } from '../../src/index';

export interface Item {
  id: number;
  text: string;
}

export type DatasourceWithAdapter<Data> = IDatasource<Data> & {
  adapter: IAdapter<Data>
};
