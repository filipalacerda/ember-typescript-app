import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import type { PropertyType } from 'ember-typescript-app/types';

export interface DynamicInputSignature {
  // The arguments accepted by the component
  Args: {
    type: PropertyType;
    values?: string[];
    handleChange: (value: string) => void;
    operator?: string;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: HTMLElement;
}

export default class DynamicInput extends Component<DynamicInputSignature> {
  @tracked checkboxValue: string = '';

  @action
  onChange(event) {
    this.args.handleChange(event.target.value);
  }

  @action
  onCheckboxChange(event) {
    let newValue;

    if (this.checkboxValue.length) {
      newValue = this.checkboxValue.concat(',', event.target.value);
    } else {
      newValue = event.target.value;
    }

    this.checkboxValue = newValue;
    this.args.handleChange(newValue);
  }

  get isTextInput() {
    return this.args.type === 'string' || this.args.type === 'number';
  }

  get isCheckbox() {
    return this.args.type === 'enumerated' && this.args.operator === 'in';
  }

  get isSelect() {
    return this.args.type === 'enumerated' && this.args.operator !== 'in';
  }
}
