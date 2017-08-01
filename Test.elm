import Html exposing (component, node, on, program, text)

import Counter

type alias Model =
  {}

init : Model
init =
  {}

view : Model -> Html.Node Model
view model =
  node "div" []
    [ component Counter.component
    ]

main = program
  { view = view
  , init = init
  }
