import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type { Property, Operator, Filters, PropertyType } from '../types';

export interface SearchFormSignature {
  // The arguments accepted by the component
  Args: {
    categories: Property[];
    operators: Operator[];
    onChange: ({ property, operator, value }: Filters) => void;
    onClear: () => void;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: HTMLFormElement;
}

export default class SearchForm extends Component<SearchFormSignature> {
  @tracked currentOperator: Operator | undefined;
  @tracked currentCategoryProperty: Property | undefined;
  @tracked currentValue: string = '';

  filterOperators = (
    operators: Operator[],
    currentCategoryProperty?: PropertyType,
  ) => {
    const categoryOperatorsMap = {
      string: ['equals', 'any', 'none', 'in', 'contains'],
      number: ['equals', 'greater_than', 'less_than', 'any', 'none', 'in'],
      enumerated: ['equals', 'any', 'none', 'in'],
    };

    let result: [] | Operator[];
    const availableOperators =
      currentCategoryProperty &&
      categoryOperatorsMap[currentCategoryProperty?.type as PropertyType];

    if (availableOperators) {
      result = operators.reduce((acc: Operator[], value: Operator) => {
        if (availableOperators.includes(value.id)) {
          acc.push(value);
        }
        return acc;
      }, []);
    } else {
      result = [];
    }

    return result;
  };

  get visibleOperators() {
    return this.filterOperators(
      this.args.operators,
      this.currentCategoryProperty as PropertyType,
    );
  }

  get isDynamicInputVisible() {
    return (
      this.currentCategoryProperty &&
      this.currentCategoryProperty.id !== -1 &&
      this.currentOperator?.id !== 'none' &&
      this.currentOperator?.id !== 'any'
    );
  }

  @action
  handleCategoryChange(event) {
    const value = event.target.value;

    const categorySelected = this.args.categories.filter((category) => {
      return category.id === parseInt(value);
    })[0];

    this.currentCategoryProperty = categorySelected;

    this.args.onChange &&
      this.args.onChange({
        property: categorySelected,
        operator: this.currentOperator,
        value: this.currentValue,
      });
  }

  @action
  handleOperatorChange(event) {
    const value = event.target.value;

    const operatorSelected = this.args.operators.filter((operator) => {
      return operator.id === value;
    })[0];

    this.currentOperator = operatorSelected;

    this.args.onChange &&
      this.args.onChange({
        property: this.currentCategoryProperty,
        operator: operatorSelected,
        value: this.currentValue,
      });
  }

  @action
  handleValueChange(value: string) {
    this.currentValue = value;

    this.args.onChange &&
      this.args.onChange({
        property: this.currentCategoryProperty,
        operator: this.currentOperator,
        value,
      });
  }

  @action
  handleOnClear() {
    this.currentCategoryProperty = { id: -1, name: '', type: undefined };
    this.currentOperator = { id: 'empty', text: '' };
    this.currentValue = '';

    this.args.onClear();
  }
}
