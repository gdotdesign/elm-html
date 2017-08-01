
import Native.Inferno
import Native.InfernoCreateElement
import Native.Html

import Json.Decode as Json

import Promise exposing (Promise)

type Attribute model
  = Property String String
  | Attribute String String
  | Event String (Json.Value -> (() -> model) -> Promise model)

type Contents model
  = Text String
  | Node (Element model)

type alias Element model =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute model)
  , scrollKey : Maybe String
  , contents : List (Contents model)
  }

type alias Prog model =
  { view : model -> Element model
  , init : model
  }


type alias Model =
  { x: String
  }

program : Prog model -> Program Never model msg
program prog =
  Native.Html.program prog

add event getModel =
  Promise.timeout 1000
    |> Promise.map (\_ -> { x = (getModel ()).x ++ "a" })
    |> Debug.log ""

addNow event getModel =
  Promise.succeed { x = (getModel ()).x ++ "b" }

view model =
  { tag = "div"
  , styles = []
  , attributes = [Event "onclick" add, Event "onmousedown" addNow]
  , contents = [Text model.x]
  , scrollKey = Nothing
  }

main = program
  { view = view
  , init = { x = "ASd"}
  }
