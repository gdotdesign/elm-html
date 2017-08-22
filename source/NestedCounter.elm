module NestedCounter exposing (..)

import Rumble.Html exposing (Component, Update, Html, node, text, on, return, emit, mount)
import Counter

type alias Model =
  {}

init : Model
init =
  {}

type Msg
  = Counter Counter.Event

update : Msg -> Model -> Update Model Msg Counter.Event
update msg model =
  case msg of
    Counter event ->
      return model
        |> emit event

view : Model -> Html Msg
view model =
  node "div"
    []
    [ text "Nested Counter:"
    , node "div" []
      [ node "div" []
        [ mount Counter.component "counter" Counter
        ]
      ]
    ]

component : Component Model Msg Counter.Event
component =
  { model = init
  , update = update
  , view = view
  }
