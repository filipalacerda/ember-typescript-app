import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-typescript-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | dynamic-input', function (hooks) {
  setupRenderingTest(hooks);

  test('with type string, it should render a text input', async function (assert) {
    this.set('type', 'string');
    this.set('handleChange', () => {});
    await render(
      hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} />`,
    );

    assert.dom('label').hasText('Value:');
    assert.dom('[data-test-text-input]').exists();
  });

  test('with type number, it should render a text input', async function (assert) {
    this.set('type', 'number');
    this.set('handleChange', () => {});
    await render(
      hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} />`,
    );

    assert.dom('label').hasText('Value:');
    assert.dom('[data-test-text-input]').exists();
  });

  module('with type enumerated and operator in', function () {
    test('it should render checkboxes', async function (assert) {
      this.set('type', 'enumerated');
      this.set('operator', 'in');
      this.set('values', ['text', 'foo', 'bar']);
      this.set('handleChange', () => {});
      await render(
        hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} @operator={{this.operator}} @values={{this.values}}/>`,
      );

      assert.dom('[data-test-checkboxes]').exists();
      assert.dom('[data-test-checkboxes]').hasText('text foo bar');
    });
  });

  module('with type enumerated and operator different from in', () => {
    test('it should render a select', async function (assert) {
      this.set('type', 'enumerated');
      this.set('operator', 'equals');
      this.set('values', ['text', 'foo', 'bar']);
      this.set('handleChange', () => {});
      await render(
        hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} @operator={{this.operator}} @values={{this.values}}/>`,
      );

      assert.dom('[data-test-select-input]').exists();
    });
  });
});
