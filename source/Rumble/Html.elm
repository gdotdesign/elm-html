module Rumble.Html exposing
  ( ComponentWithContent, Component, Html, Attribute, EventOptions, node, text
  , mount, mountWithEvent, mountWithContent, embed, on, root, program
  , attribute, boolAttribute, property )

{-| This module provides a way to render Html elements and simple Components.

# Html
@docs Html, node, text

# Events
@docs EventOptions, on

# Attributes
@docs Attribute, attribute, property, boolAttribute

# Component
@docs Component, ComponentWithContent, mount, mountWithContent, mountWithEvent, embed, root

# Program
@docs program
-}

import Native.Vendor.Inferno
import Native.Vendor.InfernoCreateElement
import Native.Vendor.Jss
import Native.Program
import Native.Html
import Native.Uid

import Json.Decode as Json
import Dict exposing (Dict)

import Rumble.Subscription exposing (Subscription)
import Rumble.Style exposing (Rule, Style)
import Rumble.Update exposing (Update)

{-| A hidden type to bypass the type system
-}
type DATA = DATA

type Root = Root String


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
type Html msg
  = E (Element msg)
  | T String
  | EM DATA
  | C DATA


{-| Represents a component.
-}
type alias Component model msg event command =
  { update : msg -> model -> Update model msg event command
  , subscriptions : model -> List (Subscription msg)
  , view : model -> Html msg
  , model : model
  }


{-| Represents a component that is has injection points for content from their
parent component.
-}
type alias ComponentWithContent model msg event parentMsg command =
  { view : Dict String (Html parentMsg) -> model -> Html msg
  , update : msg -> model -> Update model msg event command
  , subscriptions : model -> List (Subscription msg)
  , model : model
  }


{-| Represents an element.
-}
type alias Element msg =
  { attributes : List (Attribute msg)
  , contents : List (Html msg)
  , scrollKey : Maybe String
  , styles : List Rule
  , tag : String
  }


{-| Subscribe to an event as a Html attribute.
    - The first parameter is the event
    - The second parameter is the event hanlder function which takes the
      event as a Json.Value so it can be decoded
-}
on : String -> (Json.Value -> (Maybe msg, EventOptions)) -> Attribute msg
on event handler =
  Event event handler


{-| Returns an attribute from the given name and value.
-}
attribute : String -> String -> Attribute msg
attribute =
  Attribute


{-| Returns a boolean attribute from the given name and value.
-}
boolAttribute : String -> Bool -> Attribute msg
boolAttribute =
  BoolAttribute


{-| Returns a property from the given name and value.
-}
property : String -> String -> Attribute msg
property =
  Property


{-| Returns an Html text node.
-}
text : String -> Html msg
text value =
  T value


{-| Returns an Html element.
-}
node : String -> List (Attribute msg) -> List Rule -> List (Html msg) -> Html msg
node tag attributes styles contents =
  E
    { attributes = attributes
    , scrollKey = Nothing
    , contents = contents
    , styles = styles
    , tag = tag
    }


{-| Mounts the given component.
-}
mount : Component model msg event command
      -> (msg -> actionMsg)
      -> Html parentMsg
mount template id =
  C (Native.Html.component template id "")


{-| Mounts the given component with a listener.
-}
mountWithEvent : Component model msg event command
      -> (msg -> actionMsg)
      -> (event -> parentMsg)
      -> Html parentMsg
mountWithEvent template id listener =
  C (Native.Html.component template id listener)

{-| Mounts the given open component.
-}
mountWithContent
  : ComponentWithContent model msg event parentMsg command
  -> (msg -> actionMsg)
  -> (event -> parentMsg)
  -> Dict String (Html parentMsg)
  -> Html parentMsg
mountWithContent template id listener dict =
  C (Native.Html.component { template | view = template.view dict } id listener)


{-| Embeds parent html into a component.
-}
embed : Html parentMsg -> Html msg
embed parentHtml =
  EM (Native.Html.embed parentHtml)


{-| Mounts the given component as a root component.
-}
root : Component a b d e -> Html c
root template =
  C (Native.Html.component template Root "")


{-| Creates a program from the given Html tree.
-}
program : Html msg -> Program Never model msg
program =
  Native.Html.program

