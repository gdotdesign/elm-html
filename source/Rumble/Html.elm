module Rumble.Html exposing
  ( Component, Html, Attribute, EventOptions, node, text
  , mount, embed, on, program
  , attribute, boolAttribute, property, foreign )

{-| This module provides a way to render Html elements and simple Components.

# Html
@docs Html, node, text

# Events
@docs EventOptions, on

# Attributes
@docs Attribute, attribute, property, boolAttribute

# Component
@docs Component, mount, embed, foreign

# Program
@docs program
-}

import Native.Vendor.Inferno
import Native.Vendor.InfernoCreateElement
import Native.Vendor.InfernoComponent
import Native.Vendor.Jss
import Native.Program
import Native.Html

import Json.Decode as Json

import Rumble.Subscription exposing (Subscription)
import Rumble.Style exposing (Rule, Style)
import Rumble.Update exposing (Update)

{-| A hidden type to bypass the type system
-}
type DATA = DATA
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
  = ELEMENT (Element msg parentMsg)
  | TEXT String
  | EMBEDDED (DATA parentMsg)
  | FOREIGN (DATA parentMsg)
  | COMPONENT (DATA parentMsg)


{-| Represents a component.
-}
type alias Component props state msg parentMsg command =
  { update : msg -> props -> state -> Update state msg parentMsg command
  , subscriptions : props -> state -> List (Subscription msg)
  , view : props -> state -> Html msg parentMsg
  , initialState : state
  }


{-| Represents an element.
-}
type alias Element msg parentMsg =
  { attributes : List (Attribute msg)
  , contents : List (Html msg parentMsg)
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
text : String -> Html msg parentMsg
text value =
  TEXT value


{-| Returns an Html element.
-}
node : String -> List (Attribute msg) -> List Rule -> List (Html msg parentMsg) -> Html msg parentMsg
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
mount : Component props state msg parentMsg command
      -> (msg -> actionMsg)
      -> props
      -> Html parentMsg grandParentMsg
mount component id props =
  { component = component
  , props = props
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
program : Component props state msg command parentMsg
        -> Program Never state msg
program component =
  { component = component
  , props = {}
  , id = Root
  }
  |> Native.Html.component
  |> COMPONENT
  |> Native.Html.program


{-| Embeds a foreign Inferno component.
-}
foreign : props -> component -> Html msg b
foreign props component =
  FOREIGN (Native.Html.foreign props component)
