module Rumble.Html exposing
  ( ComponentWithContent, Component, Html, node, text, mount, mountWithContent
  , embed, on, root, program)

{-| This module provides a way to render Html elements and simple Components.

# Html
@docs Html, node, text

# Events
@docs on

# Component
@docs Component, ComponentWithContent, mount, mountWithContent, embed, root

# Program
@docs program
-}

import Native.Vendor.Inferno
import Native.Vendor.InfernoCreateElement
import Native.Program
import Native.Html
import Native.Uid

import Json.Decode as Json
import Dict exposing (Dict)

import Rumble.Update exposing (Update)

-- A hidden type to bypass the type system
type DATA = DATA


{-| Represents an Html attribute.
-}
type Attribute msg
  = Event String (Json.Value -> msg)
  | Property String String
  | Attribute String String


{-| Represents a Html node.
-}
type Html msg
  = E (Element msg)
  | T String
  | EM DATA
  | C DATA


{-| Represents a component.
-}
type alias Component model msg event =
  { update : msg -> model -> Update model msg event
  , view : model -> Html msg
  , model : model
  }


{-| Represents a component that is has injection points for content from their
parent component.
-}
type alias ComponentWithContent model msg event parentMsg =
  { view : Dict String (Html parentMsg) -> model -> Html msg
  , update : msg -> model -> Update model msg event
  , model : model
  }


{-| Represents an element.
-}
type alias Element msg =
  { attributes : List (Attribute msg)
  , styles : List (String, String)
  , contents : List (Html msg)
  , scrollKey : Maybe String
  , tag : String
  }


{-| Subscribe to an event as a Html attribute.
    - The first parameter is the event
    - The second parameter is the event hanlder function which takes the
      event as a Json.Value so it can be decoded
-}
on : String -> (Json.Value -> msg) -> Attribute msg
on event handler =
  Event event handler


{-| Returns an Html text node.
-}
text : String -> Html msg
text value =
  T value


{-| Returns an Html element.
-}
node : String -> List (Attribute msg) -> List (Html msg) -> (Html msg)
node tag attributes contents =
  E
    { attributes = attributes
    , scrollKey = Nothing
    , contents = contents
    , styles = []
    , tag = tag
    }


{-| Mounts the given component.
-}
mount : Component model msg event
      -> String
      -> (event -> parentMsg)
      -> Html parentMsg
mount template id listener =
  C (Native.Html.component template id listener)


{-| Mounts the given open component.
-}
mountWithContent
  : ComponentWithContent model msg event parentMsg
  -> String
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
root : Component a b d -> Html c
root template =
  C (Native.Html.component template "root" "")


{-| Creates a program from the given Html tree.
-}
program : Html msg -> Program Never model msg
program =
  Native.Html.program

