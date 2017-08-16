module Counter exposing (..)

import Plank exposing (Html, node, text, on)
import Promise exposing (Promise)

init : Model
init =
  { count = 0
  }

type alias Model =
  { count: Int
  }

type Msg
  = Increment

update : Msg -> Model -> (Model, Maybe (Promise Msg))
update msg model =
  case msg of
    Increment ->
      ({ model | count = model.count + 1 }, Nothing)

view : Model -> Html Msg
view model =
  node "div"
    [ on "onclick" (\value -> Increment) ]
    [ text (toString model)
    ]

component : Html msg
component =
  { model = init
  , update = update
  , view = view
  }
  |> Plank.component
