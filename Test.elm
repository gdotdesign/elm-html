
import Native.Inferno
import Native.InfernoCreateElement
import Native.Html

import Json.Decode as Json

type Attribute model
  = Property String String
  | Attribute String String
  | Event String (Json.Value -> model -> model)

type Contents model
  = Empty
  | Nodes (List (Node model))

type alias Node model =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute model)
  , scrollKey : String
  , contents : Contents model
  }

type alias Prog model =
  { view : model -> Node model
  , init : model
  }

program : Prog model -> Program Never model msg
program prog =
  Native.Html.program prog

main = program
  { view = (\_ -> { tag = "div", styles = [], attributes = [], contents = Nodes [] })
  , init = ""
  }
