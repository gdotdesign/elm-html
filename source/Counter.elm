module Counter exposing (..)

import Plank exposing (Component, Html, Update, node, text, on, return, emit, thenEmit, andThen)
import Promise exposing (Promise)

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
          |> andThen (delayedDecrement ())

    Increment ->
      return
        { model | count = model.count + 1 }
          |> emit Incremented
          |> emit Changed


delayedDecrement : () -> Promise Msg
delayedDecrement _ =
  Promise.timeout 1000
    |> Promise.map (\() -> Debug.log "" Decrement)


view : Model -> Html Msg
view model =
  node "div"
    []
    [ node "button"
      [ on "onclick" (\value -> Decrement) ]
      [ text "-"]
    , text (toString model)
    , node "button"
      [ on "onclick" (\value -> Increment) ]
      [ text "+"]
    ]


component : Component Model Msg Event
component =
  { update = update
  , model = init
  , view = view
  }
