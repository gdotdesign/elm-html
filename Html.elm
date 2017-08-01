module Html exposing (..)

import Native.Inferno
import Native.InfernoCreateElement
import Native.Html

import Json.Decode as Json
import Promise exposing (Promise)

type Attribute model
  = Property String String
  | Attribute String String
  | Event String (Json.Value -> (() -> model) -> Promise model)

type Node model
  = T String
  | N (Element model)
  | C Comp

type alias Element model =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute model)
  , scrollKey : Maybe String
  , contents : List (Node model)
  }

type Comp = Comp

type alias Component model =
  { view : model -> Node model
  , init : model
  }

on : String -> (model -> model) -> Attribute model
on event handler =
  Event event (\_ getModel -> Promise.succeed (handler (getModel ())))

text : String -> Node model
text value =
  T value

node : String -> List (Attribute model) -> List (Node model) -> Node model
node tag attributes contents =
  N
    { tag = tag
    , styles = []
    , attributes = attributes
    , contents = contents
    , scrollKey = Nothing
    }

program : Component model -> Program Never model msg
program prog =
  Native.Html.program prog


component : Component model -> Node model2
component component =
  C (Native.Html.component component)
