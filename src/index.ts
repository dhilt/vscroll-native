import {
  IDatasource,
  IAdapter,
  makeDatasource,
} from 'vscroll';

import { Scroller, Template } from './vscroll-native';

const Datasource = makeDatasource<IAdapter>();

export { Scroller, Datasource, Template, IDatasource, IAdapter };
