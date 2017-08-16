const Program = require('../source/Native/Program')

const ctor = function (name, data) {
  return { ctor: name, _0: data }
}

const rootComponent = ctor('C', {
  view: (model) => {
    return ctor('E', { tag: 'div',
      contents: [
        ctor('T', 'Hello')
      ],
      attributes: [] })
  }
})

test('Renders simple component', () => {
  const program = new Program(rootComponent)
  expect(program.container.textContent).toBe('Hello')
})
