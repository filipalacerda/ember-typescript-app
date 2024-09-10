import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-typescript-app/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | dynamic-input', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<DynamicInput />`);

    assert.dom().hasText('');

    // Template block usage:
    await render(hbs`
      <DynamicInput>
        template block text
      </DynamicInput>
    `);

    assert.dom().hasText('template block text');
  });
});
