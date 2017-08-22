# elm-html

_name is just a placeholder_

---------------

This is an experiment of creating a different architecture for Elm appliactions with the following features:
- Stateful components whose state is managed by the architecture (not by hand)
- Styling of individual HTML nodes
- Better event handling with support for:
	- proper `stopPropagation` and `stopImmediatePropagation` and `preventDefault`
	- getting the event as a Json.Value
- Passive event listeners by default
- Task based DOM API
- Process based HTTP API
- Use already exsisting solutions:
  - **Inferno** for virtual dom
  - **JSS** for styles
  - **Fluture** for tasks

# Roadmap
These features are completed / planned
- [x] Html structure
- [x] Component state handling
- [x] Task based event handling
- [x] Task based child to parent communication
- [ ] Styled nodes
- [ ] Passive event listeners
- [ ] Process handling
- [ ] DOM Apis
