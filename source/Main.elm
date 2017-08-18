import Plank exposing (Update, Html, node, text, on, mountControlled, mount, return)

import Counter
import NestedCounter
import Rumble.Task as Task exposing (Task)

type alias Model =
  { incrementCount: Int
  , decrementCount: Int
  , counterChanged: Int
  , counterCount :Int
  , controlledCounter : Counter.Model
  }

type Msg
  = Counter Counter.Event
  | CounterList Counter.Event
  | ControlledCounter Counter.Msg

init : Model
init =
  { incrementCount = 0
  , decrementCount = 0
  , counterChanged = 0
  , counterCount = 0
  , controlledCounter = Counter.init
  }

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

    ControlledCounter msg ->
      let
        (updatedCounter, effects, _) = Counter.update msg model.controlledCounter
      in
        ( { model | controlledCounter = updatedCounter }
        , List.map (Task.map ControlledCounter) effects
        , [])


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
          [ node "h1" [] [ text "Normal Components" ]
          , mount Counter.component "counter" Counter
          , mount Counter.component "counter2" Counter
          , node "hr" [] []
          , node "h1" [] [ text "Nested Component" ]
          , mount NestedCounter.component "nested-counter" Counter
          , node "hr" [] []
          , node "h1" [] [ text "Component List" ]
          , mount Counter.component "list" CounterList
          , node "div" [] counterList
          , node "hr" [] []
          , node "h1" [] [ text "Controlled Component" ]
          , mountControlled Counter.component model.controlledCounter ControlledCounter
          ]
        ]
      ]

mod =
  Plank.root
    { view = view
    , model = init
    , update = update
    }

main =
  Plank.program mod
