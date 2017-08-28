module NestedCounter exposing (..)

import Rumble.Html exposing (Component, Html, node, text, on, mountWithEvent)
import Rumble.Update exposing (..)
import Examples.Components.Counter as Counter

type alias Model =
  {}

init : Model
init =
  {}

type Msg
  = Counter Counter.Event

type Components
  = ACounter Counter.Msg

update : Msg -> Model -> Update Model Msg Counter.Event Components
update msg model =
  case msg of
    Counter event ->
      return model
        |> emit event

view : Model -> Html Msg
view model =
  node "div" [] []
    [ text "Nested Counter:"
    , node "div" [] []
      [ node "div" [] []
        [ mountWithEvent Counter.component ACounter Counter
        ]
      ]
    ]

component : Component Model Msg Counter.Event Components
component =
  { model = init
  , update = update
  , view = view
  }
