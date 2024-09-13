import { assert, module, test } from 'qunit';
import { setupRenderingTest } from 'ember-typescript-app/tests/helpers';
import { render, select } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | search-form', function (hooks) {
  setupRenderingTest(hooks);
  hooks.beforeEach(() => {
    this.categories = [
      {
        id: 0,
        name: 'Product Name',
        type: 'string',
      },
      {
        id: 1,
        name: 'color',
        type: 'string',
      },
      {
        id: 2,
        name: 'weight (oz)',
        type: 'number',
      },
      {
        id: 3,
        name: 'category',
        type: 'enumerated',
        values: ['tools', 'electronics', 'kitchenware'],
      },
      {
        id: 4,
        name: 'wireless',
        type: 'enumerated',
        values: ['true', 'false'],
      },
    ];

    this.operators = [
      {
        text: 'Equals',
        id: 'equals',
      },
      {
        text: 'Is greater than',
        id: 'greater_than',
      },
      {
        text: 'Is less than',
        id: 'less_than',
      },
      {
        text: 'Has any value',
        id: 'any',
      },
      {
        text: 'Has no value',
        id: 'none',
      },
      {
        text: 'Is any of',
        id: 'in',
      },
      {
        text: 'Contains',
        id: 'contains',
      },
    ];
  });

  module('default state', function () {
    test('it renders a category select by default', async function (assert) {
      await render(
        hbs`<SearchForm @onChange={{this.onChange}} @onClear={{this.onClear}} @categories={{this.categories}} @operators={{this.operators}} />`,
      );

      assert.dom('[data-test-category-select]').exists();
    });

    test('it renders a clear button by default', async (assert) => {
      await render(
        hbs`<SearchForm @onChange={{this.onChange}} @onClear={{this.onClear}} @categories={{this.categories}} @operators={{this.operators}} />`,
      );

      assert.dom('[data-test-clear-button]').exists();
    });
  });

  module('when user select a category', () => {
    test('it should render the operator select', async (assert) => {
      await render(
        hbs`<SearchForm @onChange={{this.onChange}} @onClear={{this.onClear}} @categories={{this.categories}} @operators={{this.operators}} />`,
      );

      console.log('this.categories', this.categories);
      await select('[data-test-category-select]', 'color');

      assert.dom('[data-test-operator-select]').exists();
    });

    test('it should render the dynamic input', async (assert) => {
      let actual;
      this.set(
        'onChange',
        (data: { id: number; name: string; type: string }) => {
          actual = data;
        },
      );

      await render(
        hbs`<SearchForm @onChange={{this.onChange}} @onClear={{this.onClear}} @categories={{this.categories}} @operators={{this.operators}} />`,
      );

      await select('[data-test-category-select]', 'Product Name');

      assert.dom('[data-test-text-input]').exists();
    });

    test('it should call onChange with the selected catefory', async (assert) => {
      let actual;
      this.set(
        'onChange',
        (data: { id: number; name: string; type: string }) => {
          actual = data;
        },
      );

      await render(
        hbs`<SearchForm @onChange={{this.onChange}} @onClear={{this.onClear}} @categories={{this.categories}} @operators={{this.operators}} />`,
      );

      await select('[data-test-category-select]', 'Product Name');

      const expected = {
        id: 0,
        name: 'Product Name',
        type: 'string',
      };

      assert.deepEqual(
        actual,
        expected,
        'changed value is passed to external action',
      );
    });
  });
});
