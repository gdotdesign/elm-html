# HTML

The `Html` is defined as the following:

```
type Html msg parentMsg
  = ELEMENT (Element msg parentMsg)
  | COMPONENT (DATA parentMsg)
  | EMBEDDED (DATA parentMsg)
  | FOREIGN (DATA parentMsg)
  | TEXT String
```

Where the cases are:

- ELEMENT   - A normal HTML element (see definition below)
- COMPONENT - A component (see definition in the Architecure document)
- EMBEDDED  - An HTML element which is embedded in a component and belongs
              to the parent element
- FOREIGN   - An Inferno component
- TEXT      - A simple text

As you can see the type describes the relationship between it and it's parent.
This makes it possible to A) send messages to the parent and B) to embed nodes
from the parent.

Also as a necessity (because of the language) some of the cases use a hidden
state through `DATA` which the program can recognize.

## Node

The definition of a node is:

```
node
  : String
  -> List (Attribute msg)
  -> List Rule
  -> List (Html msg parentMsg)
  -> Html msg parentMsg
```

Where the arguments in order are:

- the tagname
- the list of attributes
- the styles (see more in the Styling document)
- the children

## Rendering

The tree is just a intermediate representation of the expected DOM, it is
transformed and then rendered with Inferno.
