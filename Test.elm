import Html exposing (component, node, on, program, text)

import Counter

type alias Model =
  { count : Int }


increment : Model -> Model
increment model =
  { model | count = model.count + 1 }

view : Model -> Html.Node Model
view model =
  node "div"
    [ on "onclick" increment ]
    [ component Counter.component
    , component Counter.component
    , node "div"
      []
      [ component Counter.component
      ]
    , text (toString model.count)
    ]


main = program
  { view = view
  , defaults = { count = 0 }
  }
