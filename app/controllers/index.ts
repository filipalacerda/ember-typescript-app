import Controller from '@ember/controller';
import { computed, set } from '@ember/object';
import type {
  Filters,
  Operator,
  Products,
  Property,
} from 'ember-typescript-app/types';
import { action } from '@ember/object';

import {
  equalFilter,
  greaterThanFilter,
  lessThanFilter,
  anyFilter,
  noneFilter,
  inFilter,
  containsFilter,
} from 'ember-typescript-app/filters';

export default class IndexController extends Controller {
  filters: Filters | undefined;

  @action
  onChange(values) {
    set(this, 'filters', values);
  }

  @action
  onClear() {
    set(this, 'filters', {});
  }

  @computed('filters', 'model.products')
  get visibleProducts() {
    return this.filterProducts(this.model.products, this.filters);
  }

  filterProducts(products: Products, filters?: Filters) {
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
  }
}
