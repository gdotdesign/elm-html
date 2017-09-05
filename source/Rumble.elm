module Rumble exposing
  ( Component, Html, Attribute(BoolAttribute, Attribute, Property)
  , EventOptions, node, text, mount, embed, on, program, foreign
  , Process, Subscription, Style, Rule, style, selector, selectors
  , pseudo, and, andThen, emit, emitMaybe, emitThen, send, process, abort
  , return, Update)

{-| This module provides a way to render Html elements and simple Components.

# Html
@docs Html, node, text

## Events
@docs EventOptions, on

## Attributes
@docs Attribute

## Component
@docs Component, mount, embed, foreign

## Program
@docs program

# Styling
@docs Style, Rule

## Functions
@docs style, selector, selectors, pseudo

# Update
@docs Update, return

## Side Effects
@docs and, andThen

## Events
@docs emit, emitMaybe, emitThen

## Commands
@docs send

## Processes
@docs process, abort

# Process
@docs Process

# Subscription
@docs Subscription
-}

import Native.Vendor.Inferno
import Native.Vendor.InfernoCreateElement
import Native.Vendor.InfernoComponent
import Native.Vendor.Jss
import Native.Program
import Native.Process
import Native.Html

import Rumble.Task as Task exposing (Task)

import Json.Decode as Json

{- HTML -----------------------------------------------------------------------}

{-| A hidden type to bypass the type system
-}
type DATA a = DATA a


{-| The root ID.
-}
type Root a = Root a


{-| Event options.
-}
type alias EventOptions =
  { stopImmediatePropagation : Bool
  , stopPropagation : Bool
  , preventDefault : Bool
  }


{-| Represents an Html attribute.
-}
type Attribute msg
  = Event String (Json.Value -> (Maybe msg, EventOptions))
  | BoolAttribute String Bool
  | Attribute String String
  | Property String String


{-| Represents a Html node.
-}
type Html msg parentMsg
  = ELEMENT (Element msg parentMsg) -- A normal Html element
  | COMPONENT (DATA parentMsg)      -- A component
  | EMBEDDED (DATA parentMsg)       -- Embedded parent content
  | FOREIGN (DATA parentMsg)        -- Foreign component
  | TEXT String                     -- Text


{-| Represents a component.
-}
type alias Component props state msg command parentMsg =
  { update : msg -> props -> state -> Update state msg command parentMsg
  , subscriptions : props -> state -> List (Subscription msg)
  , view : props -> state -> Html msg parentMsg
  , initialState : state
  , defaultProps : props
  }


{-| Represents an element.
-}
type alias Element msg parentMsg =
  { contents : List (Html msg parentMsg)
  , attributes : List (Attribute msg)
  , scrollKey : Maybe String
  , styles : List Rule
  , tag : String
  }


{-| Subscribe to an event as a Html attribute.
-}
on : String -> (Json.Value -> (Maybe msg, EventOptions)) -> Attribute msg
on event handler =
  Event event handler


{-| Returns an Html text node.
-}
text : String -> Html msg parentMsg
text value =
  TEXT value


{-| Returns an Html element.
-}
node
  : String
  -> List (Attribute msg)
  -> List Rule
  -> List (Html msg parentMsg)
  -> Html msg parentMsg
node tag attributes styles contents =
  ELEMENT
    { attributes = attributes
    , scrollKey = Nothing
    , contents = contents
    , styles = styles
    , tag = tag
    }


{-| Mounts the given component.
-}
mount : Component props state msg command parentMsg
      -> (msg -> actionMsg)
      -> (props -> props)
      -> Html parentMsg grandParentMsg
mount component id method =
  { props = method component.defaultProps
  , component = component
  , id = id
  }
  |> Native.Html.component
  |> COMPONENT


{-| Embeds parent html into a component.
-}
embed : Html parentMsg a -> Html b parentMsg
embed parentHtml =
  EMBEDDED (Native.Html.embed parentHtml)


{-| Mounts the given component as a root component.
-}
program
  : Component props state msg command parentMsg
  -> Maybe msg
  -> Program Never state msg
program component initialMsg =
  { component = component
  , props = {}
  , id = Root
  }
  |> Native.Html.component
  |> COMPONENT
  |> Native.Html.program initialMsg


{-| Embeds a foreign Inferno component.
-}
foreign : props -> component -> Html msg b
foreign props component =
  FOREIGN (Native.Html.foreign props component)


{- SUBSCRIPTION----------------------------------------------------------------}

{-| Represents a subscription.
-}
type Subscription a = Subscription a



{- UPDATE ---------------------------------------------------------------------}

{-| Represents an update for a component.
  - commands - Tasks that return messages for sub components
  - parentMessages - Tasks that return messages for the parent component
  - effects - Tasks that return side effects
  - model - The updated model
-}
type alias Update state msg command parentMsg =
  { parentMessages : List (Task Never parentMsg)
  , processes : List (String, Process msg)
  , commands : List (Task Never command)
  , effects : List (Task Never msg)
  , state : state
  }


{-| Builds an update from a model.
-}
return : state -> Update state msg command parentMsg
return state =
  { state = state, effects = [], parentMessages = [], commands = [], processes = [] }


{-| Emits the given event to the parent.
-}
emit
  : parentMsg
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
emit parentMsg data =
  { data | parentMessages = Task.succeed parentMsg :: data.parentMessages }


{-| Emits the given message if exists with the given value.
-}
emitMaybe
  : Maybe (a -> parentMsg)
  -> a
  -> Update state msg command parentMsg
  -> Update state msg command parentMsg
emitMaybe maybeParentMsg value data =
  case maybeParentMsg of
    Just parentMsg ->
      { data | parentMessages = Task.succeed (parentMsg value) :: data.parentMessages }

    Nothing ->
      data


{-| Runs the given task then emits the message returned by it.
-}
emitThen
  : Task Never parentMsg
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
emitThen task data =
  { data | parentMessages = task :: data.parentMessages }


{-| Runs the given message.
-}
and
  : Task Never parentMsg
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
and task data =
  { data | parentMessages = task :: data.parentMessages }


{-| Runs the given task of a side effect.
-}
andThen
  : Task Never msg
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
andThen effect data =
  { data | effects = effect :: data.effects }


{-| Runs the given task of a command.
-}
send
  : command
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
send command data =
  { data | commands = Task.succeed command :: data.commands }


{-| Starts the given process with the given ID.
-}
process
  : String
  -> Process msg
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
process id process data =
  { data | processes = (id, process) :: data.processes }


{-| Aborts the process with the given ID.
-}
abort
  : String
  -> Update model msg command parentMsg
  -> Update model msg command parentMsg
abort id data =
  { data | processes = (id, Native.Process.abort) :: data.processes }


{- STYLE ----------------------------------------------------------------------}

{-| Represents a style for a rule or element.
-}
type alias Style =
  List (String, String)


{-| Represents of sub selector. It can either be a normal selector like
"span", "+ span", "> button" etc... or a pseudo selector like "::before",
"::after", etc...
-}
type Selector
  = Child String
  | Children (List String)
  | Pseudo String
  | Pseudos (List String)
  | Self


{-| Represents a CSS rule.
-}
type alias Rule =
  { selector : Selector
  , data : Style
  }


{-| Returns a rule for a child selector.
-}
selector : String -> Style -> Rule
selector selector data =
  Rule (Child selector) data


{-| Returns a rule for multiple child selectors using the same data.
-}
selectors : List String -> Style -> Rule
selectors selectors data =
  Rule (Children selectors) data


{-| Returns a rule for a pseudo selector.
-}
pseudo : String -> Style -> Rule
pseudo selector data =
  Rule (Pseudo selector) data


{-| Returns a rule containing the styles for an element.
-}
style : Style -> Rule
style data =
  Rule Self data


{- PROCESS --------------------------------------------------------------------}

{-| Represents a process.
-}
type Process a = Process a
