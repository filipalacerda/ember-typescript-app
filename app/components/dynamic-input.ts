import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export interface DynamicInputSignature {
  // The arguments accepted by the component
  Args: {
    type: string;
    values?: string[];
    handleChange: (value: string) => void;
    operator?: string;
  };
  // Any blocks yielded by the component
  Blocks: {
    default: [];
  };
  // The element to which `...attributes` is applied in the component template
  Element: null;
}

export default class DynamicInput extends Component<DynamicInputSignature> {
  @tracked checkboxValue: string = '';

  get isTextInput() {
    return this.args.type === 'string' || this.args.type === 'number';
  }

  get isCheckbox() {
    console.log(this.args.operator);
    return this.args.type === 'enumerated' && this.args.operator === 'in';
  }

  get isSelect() {
    return this.args.type === 'enumerated' && this.args.operator !== 'in';
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

  @action
  handleInputValueChange(event) {
    this.args.handleChange(event.target.value);
  }
}
