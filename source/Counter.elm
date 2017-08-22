module Counter exposing (..)

import Rumble.Html exposing (Component, Html, node, text, on)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)

type alias Model =
  { count: Int
  }


type Msg
  = Increment
  | Decrement


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


delayedDecrement : Task Never Msg
delayedDecrement =
  Task.delay 1000 Decrement


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
    ]


component : Component Model Msg Event
component =
  { update = update
  , model = init
  , view = view
  }
