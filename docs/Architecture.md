# Architecture

Rumbles architecture is based on components and tries to fix the following
issues of The Elm Architecture (TEA) and the available packages:

- Update boilerplate:
	**use case:** Embed a button which has a ripple effect with one line.

- Communicating events to parent component:
	**use case:** There is a date picker component and the parent wants to know
	when the user picked a new date (either with mouse or keyboard).

- Controlling sub components:
	**use case:** There is a dropdown element, and the parent wants to open it
	(whithout fully controlling it) for the onboarding process.

- Embedding content from parent component:
	**use case:** TODO

## Defining components

Definition of a component:

```elm
type alias Component model msg event command =
  { update : msg -> model -> Update model msg event command
  , view : model -> Html msg
  , model : model
  }
```

where the types are:

- model - The components model
- msg - The components update messgae
- event - The events that the component can emit
- command - The type for the commands for the sub components

## The Update
Components are updated by themselves through the update function:

```elm
update : msg -> model -> Update msg model event command
```

where the `Update` is defined as:

```elm
type alias Update model msg event command =
  { commands : List (Task Never command)
  , events : List (Task Never event)
  , effects : List (Task Never msg)
  , model : model
  }
```

Basically a component returns it's updated model, commands for the sub
components, events for the parent component and any side effects that needs
to happen.

## Mounting
Components can be mounted into an Html tree with the following function:

```elm
mount
	: Component model msg event command
	-> (msg -> commandMsg)
	-> Html parentMsg
```
