# elm-html _name is just a placeholder_

This is an experiment of creating a different architecture for Elm appliactions with the following features:
- Stateful components whose state is managed by the architecture (not by hand)
- Styling of individual elements
- Better event handling with support for proper `stopPropagation` and `stopImmediatePropagation` and `preventDefault`
- Passive event listeners by default
- Promise based HTTP and DOM apis
- Use already exsisting solutions:
  - **Inferno** for virtual dom
  - **JSS** for styles
  - **Bluebird** for promises
