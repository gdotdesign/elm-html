import Plank exposing (Update, Html, node, text, on, mount, return)

import Counter
import NestedCounter
import Promise exposing (Promise)

type alias Model =
  { incrementCount: Int
  , decrementCount: Int
  , counterChanged: Int
  , counterCount :Int
  }

type Msg
  = Counter Counter.Event
  | CounterList Counter.Event

update : Msg -> Model -> Update Model Msg a
update msg model =
  case msg of
    CounterList event ->
      case event of
        Counter.Incremented ->
          return { model | counterCount = model.counterCount + 1 }

        Counter.Decremented ->
          return { model | counterCount = model.counterCount - 1 }

        _ -> return model

    Counter event ->
      case event of
        Counter.Incremented ->
          return { model | incrementCount = model.incrementCount + 1 }

        Counter.Decremented ->
          return { model | decrementCount = model.decrementCount + 1 }

        Counter.Changed ->
          return { model | counterChanged = model.counterChanged + 1 }


view : Model -> Html Msg
view model =
  let
    counterList =
      List.range 1 model.counterCount
      |> List.map (\index -> mount Counter.component ("list-" ++ toString index) Counter)
  in
    node "div"
      []
      [ text (toString model)
      , node "div" []
        [ node "div" []
          [ mount Counter.component "counter" Counter
          , mount Counter.component "counter2" Counter
          , node "hr" [] []
          , mount NestedCounter.component "nested-counter" Counter
          , node "hr" [] []
          , mount Counter.component "list" CounterList
          , node "div" [] counterList
          ]
        ]
      ]

mod =
  Plank.root
    { view = view
    , model = { incrementCount = 0, decrementCount = 0, counterChanged = 0, counterCount = 0 }
    , update = update
    }

main =
  Plank.program mod
