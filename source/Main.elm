import Test
import NestedCounter

import Examples.Components.Counter as Counter
import Examples.MouseTracker as MouseTracker
import Examples.CounterList as CounterList
import Examples.Http as Http
import Examples.Counter

import Rumble.Html as Html exposing (Html, root, node, text, on, mount,mountWithEvent, mountWithContent)
import Rumble.Style exposing (style, selector)
import Rumble.Process exposing (Process)
import Rumble.Html.Events exposing (onClick)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)

import Ui.Input
import Ui.Theme

import Dict

type alias Model =
  { }

type Msg
  = Open Test.Event
  | Input Ui.Input.Event

type Components
  = CList CounterList.Msg
  | NCounter NestedCounter.Msg
  | IInput Ui.Input.Msg
  | TTest Test.Msg
  | CounterExample Examples.Counter.Msg
  | MT MouseTracker.Msg
  | HT Http.Msg


init : Model
init =
  {}


update : Msg -> Model -> Update Model Msg a Components
update msg model =
  case Debug.log "" msg of
    _ ->
      return model

view : Model -> Html Msg
view model =
  node "div"
    []
    []
    [ node "div" [] []
      [ node "div" [] []
        [ node "h1" [] [] [ text "Nested Component" ]
        , mount NestedCounter.component NCounter
        , node "hr" [] [] []
        , node "h1" [] [] [ text "Open Component" ]
        , mountWithContent Test.component TTest Open
            (Dict.fromList [("content", text "")])
        ]
      ]
    , Ui.Theme.wrapper
      [ mountWithEvent Ui.Input.component IInput Input
      ]
    , text (toString model)
    , node "div" [] []
      [ mount Examples.Counter.component CounterExample
      , mount CounterList.component CList
      , mount MouseTracker.component MT
      , mount Http.component HT
      ]
    ]

mod =
  root
    { view = view
    , model = init
    , subscriptions = \_ -> []
    , update = update
    }

main =
  Html.program mod
