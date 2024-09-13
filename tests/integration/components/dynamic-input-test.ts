import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-typescript-app/tests/helpers';
import { click, fillIn, render, select } from '@ember/test-helpers';
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

  test('it should call handleChange when the user types a value', async function (assert) {
    let actual;
    this.set('type', 'string');
    this.set('handleChange', (data) => {
      actual = data;
    });

    await render(
      hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} />`,
    );

    await fillIn('[data-test-text-input]', 'a');

    const expected = 'a';
    assert.deepEqual(
      actual,
      expected,
      'changed value is passed to external action',
    );
  });

  module('with type enumerated and operator in', function () {
    test('it should render checkboxes', async function (assert) {
      let actual;

      this.set('type', 'enumerated');
      this.set('operator', 'in');
      this.set('values', ['text', 'foo', 'bar']);
      this.set('handleChange', (data) => {
        actual = data;
      });
      await render(
        hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} @operator={{this.operator}} @values={{this.values}}/>`,
      );

      assert.dom('[data-test-checkboxes]').exists();
      assert.dom('[data-test-checkboxes]').hasText('text foo bar');
    });

    test('it should call handleChange when the user checks a checkbox', async function (assert) {
      let actual;

      this.set('type', 'enumerated');
      this.set('operator', 'in');
      this.set('values', ['text', 'foo', 'bar']);
      this.set('handleChange', (data) => {
        actual = data;
      });

      await render(
        hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} @operator={{this.operator}} @values={{this.values}}/>`,
      );

      await click('[data-test-checkbox-input]');
      const expected = 'text';
      assert.deepEqual(
        actual,
        expected,
        'changed value is passed to external action',
      );
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

    test('it should call handleChange when the user selects an option', async function (assert) {
      let actual;

      this.set('type', 'enumerated');
      this.set('operator', 'equals');
      this.set('values', ['text', 'foo', 'bar']);
      this.set('handleChange', (data) => {
        actual = data;
      });

      await render(
        hbs`<DynamicInput @handleChange={{this.handleChange}} @type={{this.type}} @operator={{this.operator}} @values={{this.values}}/>`,
      );

      await select('[data-test-select-input]', 'text');
      const expected = 'text';
      assert.deepEqual(
        actual,
        expected,
        'changed value is passed to external action',
      );
    });
  });
});
