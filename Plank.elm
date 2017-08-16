module Plank exposing (..)

import Native.Uid
import Native.Inferno
import Native.InfernoCreateElement
import Native.Html

import Json.Decode as Json
import Promise exposing (Promise)

-- Hidden things
type Component = Component

type Attribute msg
  = Property String String
  | Attribute String String
  | Event String (Json.Value -> msg)

type Html msg
  = T String
  | E (Element msg)
  | C Component

type alias ComponentTemplate a b =
  { update : b -> a -> (a, Maybe (Promise b))
  , view : a -> Html b
  , model : a
  }

type alias Element msg =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute msg)
  , scrollKey : Maybe String
  , contents : List (Html msg)
  }

on : String -> (Json.Value -> msg) -> Attribute msg
on event handler =
  Event event handler

text : String -> Html msg
text value =
  T value

node : String -> List (Attribute msg) -> List (Html msg) -> (Html msg)
node tag attributes contents =
  E
    { tag = tag
    , styles = []
    , attributes = attributes
    , contents = contents
    , scrollKey = Nothing
    }

component : ComponentTemplate a b -> Html c
component template =
  C (Native.Html.component template)

program : Html msg -> Program Never model msg
program =
  Native.Html.program
