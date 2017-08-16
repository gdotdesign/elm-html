import Plank exposing (Html, node, text, on)

import Counter
import Promise exposing (Promise)

type alias Model =
  { count: Int
  }

type Msg
  = Increment
  | DelayedIncrement

update : Msg -> Model -> (Model, Maybe (Promise Msg))
update msg model =
  case Debug.log "" msg of
    DelayedIncrement ->
      ( { model | count = model.count + 1}, Nothing)

    Increment ->
      ( { model | count = model.count + 1 }
      , Promise.timeout 1000
        |> Promise.map (\() -> DelayedIncrement)
        |> Just
      )

view : Model -> Html Msg
view model =
  node "div"
    [ on "onclick" (\value -> Increment) ]
    [ text (toString model)
    , Counter.component
    ]


mod =
  Plank.component
    { view = view
    , model = { count = 0 }
    , update = update
    }

main =
  Plank.program mod
