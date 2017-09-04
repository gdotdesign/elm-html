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
  **use case:** A pager component where the parent component provides the pages.

## Defining components

Definition of a component:

```elm
type alias Component props state msg command parentMsg =
  { update : msg -> props -> state -> Update state msg command parentMsg
  , subscriptions : props -> state -> List (Subscription msg)
  , view : props -> state -> Html msg parentMsg
  , initialState : state
  }

```

where the types are:

- props     - The components props
- state     - The components state
- msg       - The union type of messages for the update
- command   - The union type for the sub components
- parentMsg - The messages of the parent for communication ( which usually
              come from the props).

## The Update
Components are updated by the program through their update function:

```elm
update : msg -> props -> state -> Update state msg command parentMsg
```

where the `Update` is defined as:

```elm
type alias Update state msg command parentMsg =
  { parentMessages : List (Task Never parentMsg)
  , processes : List (String, Process msg)
  , commands : List (Task Never command)
  , effects : List (Task Never msg)
  , state : state
  }
```

Basically a component returns:
  - state - it's updated state,
  - commands - messages for the sub components
  - parentMessages - messages for the parent component
  - effects - messages for side effects
  - processes - starting / aborting any processes

## Mounting
Components can be mounted into an HTML tree with the following function:

```elm
mount
  : Component props state msg command parentMsg
  -> (msg -> actionMsg)
  -> props
  -> Html parentMsg grandParentMsg
```

Where the arguments are:
  - the component
  - then ID
  - the props
