import Examples.Counter as Counter

import Rumble.Html as Html exposing (Html, node, text, on, mount)
import Rumble.Style exposing (style, selector)
import Rumble.Process exposing (Process)
import Rumble.Html.Events exposing (onClick)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)

import Dict

type alias Model =
  {}

type Msg = Changed Int

type Components
  = A Counter.Msg


init : Model
init =
  {}


update : Msg -> () -> Model -> Update Model Msg a Components
update msg props model =
  case Debug.log "" msg of
    _ ->
      return model

view : () -> Model -> Html Msg a
view props model =
  node "div"
    []
    []
    [ mount Counter.component A {} ]

main =
  Html.program
    { subscriptions = \_ _ -> []
    , initialState = init
    , update = update
    , view = view
    }

