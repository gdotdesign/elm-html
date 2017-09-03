import Examples.MouseTracker as MouseTracker
import Examples.CounterList as CounterList
import Examples.Foreign as Foreign
import Examples.Counter as Counter
import Examples.Http as Http

import Rumble.Html as Html exposing (Html, node, mount)
import Rumble.Update exposing (..)

type alias Model =
  {}

type Msg
  = Changed Int

type Components
  = MouseTracker MouseTracker.Msg
  | CounterList CounterList.Msg
  | Counter Counter.Msg
  | Foreign Foreign.Msg
  | Http Http.Msg


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
    [ mount Counter.component Counter ()
    , mount CounterList.component CounterList ()
    , mount MouseTracker.component MouseTracker ()
    , mount Http.component Http ()
    , mount Foreign.component Foreign ()
    ]

main =
  Html.program
    { subscriptions = \_ _ -> []
    , initialState = init
    , update = update
    , view = view
    }

