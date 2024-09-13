import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-typescript-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | table', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.headers = [
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

    this.rows = [
      {
        id: 0,
        property_values: [
          {
            property_id: 0,
            value: 'Headphones',
          },
          {
            property_id: 1,
            value: 'black',
          },
          {
            property_id: 2,
            value: 5,
          },
          {
            property_id: 3,
            value: 'electronics',
          },
          {
            property_id: 4,
            value: 'false',
          },
        ],
      },
      {
        id: 1,
        property_values: [
          {
            property_id: 0,
            value: 'Cell Phone',
          },
          {
            property_id: 1,
            value: 'black',
          },
          {
            property_id: 2,
            value: 3,
          },
          {
            property_id: 3,
            value: 'electronics',
          },
          {
            property_id: 4,
            value: 'true',
          },
        ],
      },
    ];
  });

  test('it renders table headers', async function (assert) {
    await render(hbs`<Table @headers={{this.headers}} @rows={{this.rows}}/>`);

    assert
      .dom('[data-test-header]')
      .hasText(' Product Name Color Weight (oz) Category Wireless');
  });

  test('it renders table rows', async function (assert) {
    await render(hbs`<Table @headers={{this.headers}} @rows={{this.rows}}/>`);

    assert
      .dom('[data-test-row]')
      .hasText('Headphones black 5 electronics false');
    assert.dom('[data-test-row]').exists({ count: 2 });
  });

  test('without rows, renders a message', async function (assert) {
    await render(hbs`<Table @headers={{this.headers}} />`);

    assert.dom('[data-test-empty-row]').exists();
  });
});
