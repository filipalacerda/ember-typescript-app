import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type {
  Filters,
  Operator,
  Products,
  Property,
} from 'ember-typescript-app/types';

import {
  equalFilter,
  greaterThanFilter,
  lessThanFilter,
  anyFilter,
  noneFilter,
  inFilter,
  containsFilter,
} from 'ember-typescript-app/filters';

export interface WrapperSignature {
  // The arguments accepted by the component
  Args: {
    products: Products;
    operators: Operator[];
    properties: Property[];
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class Wrapper extends Component<WrapperSignature> {
  @tracked filters: Filters | undefined;

  @action
  onChange(values) {
    this.filters = values;
  }

  @action
  onClear() {
    this.filters = {};
  }

  get visibleProducts() {
    console.log(this.args, 'visibleProducts');
    return this.filterProducts(this.args.products, this.filters);
  }

  filterProducts(products: Products, filters?: Filters) {
    console.log('products', products);
    if (!filters || (filters && !Object.keys(filters).length)) {
      return products;
    } else {
      switch (filters?.operator?.id) {
        case 'equals':
          return equalFilter(products, filters);
        case 'greater_than':
          return greaterThanFilter(products, filters);
        case 'less_than':
          return lessThanFilter(products, filters);
        case 'any':
          return anyFilter(products, filters);
        case 'none':
          return noneFilter(products, filters);
        case 'in':
          return inFilter(products, filters);
        case 'contains':
          return containsFilter(products, filters);
        default:
          return products;
      }
    }

    return products;
  }
}
