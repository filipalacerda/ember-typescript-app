import Component from '@glimmer/component';
import type { Property, Product } from '../types/types';

export type PropertyType = 'string' | 'number' | 'enumerated' | undefined;

export interface TableSignature {
  // The arguments accepted by the component
  Args: {
    headers: Array<Property>;
    rows: Array<Product>;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // We have a `<table>` as our root element
  Element: HTMLTableElement;
}

export default class Table extends Component<TableSignature> {}
