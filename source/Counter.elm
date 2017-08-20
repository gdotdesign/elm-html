module Counter exposing (..)

import Plank exposing (Component, Html, Update, node, text, on, return, emit, thenEmit, andThen)
import Rumble.Task as Task exposing (Task)

type alias Model =
  { count: Int
  }


type Msg
  = Increment
  | Decrement
  | ClearTimeout


type Event
  = Incremented
  | Decremented
  | Changed


init : Model
init =
  { count = 0
  }


update : Msg -> Model -> Update Model Msg Event
update msg model =
  case msg of
    Decrement ->
      return
        { model | count = model.count - 1 }
          |> emit Decremented
          |> emit Changed
          |> andThen delayedDecrement

    Increment ->
      return
        { model | count = model.count + 1 }
          |> emit Incremented
          |> emit Changed

    ClearTimeout ->
      return model
        |> andThen (Task.cancel "timeout")


delayedDecrement : Task Msg
delayedDecrement =
  Task.delay 1000
    |> Task.andThen
      ( \() ->
        Task.delay 1000
        |> Task.map (\() -> Debug.log "" Decrement)
      )
    |> Task.label "timeout"


view : Model -> Html Msg
view model =
  node "div"
    []
    [ node "button"
      [ on "click" (\value -> Decrement) ]
      [ text "-"]
    , text (toString model)
    , node "button"
      [ on "click" (\value -> Increment) ]
      [ text "+"]
    , text "|"
    , node "button"
      [ on "click" (\value -> ClearTimeout) ]
      [ text "clear decrement timeout" ]
    ]


component : Component Model Msg Event
component =
  { update = update
  , model = init
  , view = view
  }
