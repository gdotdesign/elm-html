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


type alias Element model =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute model)
  , scrollKey : Maybe String
  , contents : List (Node model)
  }


type alias Component model props =
  { view : props -> model -> Node model
  , defaults : model
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

program : Component model props -> props -> Program Never model msg
program prog props =
  Native.Html.program (component prog props)

component : Component model props -> props -> Node b
component component props =
  Native.Html.component component.view component.defaults props
