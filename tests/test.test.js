const component = require('../source/Main.elm')

test('Renders simple component', () => {
  component.Elm.Main.fullscreen()
  document.querySelector('button').click()
  expect(document.body.textContent).toContain('-1')
})
