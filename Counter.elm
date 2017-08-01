module Counter exposing (..)

import Html exposing (node, on, program, text)

type alias Model =
  { count: Int
  }


component : Html.Component Model {}
component =
  { defaults = init
  , view = view
  }


init : Model
init =
  { count = 0
  }


increment : Model -> Model
increment model =
  { model | count = model.count + 1 }


view : {} -> Model -> Html.Node Model
view props model =
  node "div"
    [ on "onclick" increment
    ]
    [ text (toString model.count)
    ]
