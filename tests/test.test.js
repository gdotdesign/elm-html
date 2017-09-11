const component = require('../source/Examples/Components/Counter.elm')
const TestUtils = require('inferno-test-utils')

test('Renders simple component', () => {
  component.Elm.Examples.Components.Counter.fullscreen()
  document.querySelector('button').click()
  expect(document.body.textContent).toContain('-1')
})
