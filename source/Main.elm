import Examples.MouseTracker as MouseTracker
import Examples.CounterList as CounterList
import Examples.Embedding as Embedding
import Examples.Foreign as Foreign
import Examples.Counter as Counter
import Examples.Http as Http

import Rumble exposing (..)

import Ui.Theme as Theme
import Ui.Input as Input

type alias Model =
  {}

type Msg
  = Changed String
  | Cleared
  | Load

type Components
  = MouseTracker MouseTracker.Msg
  | CounterList CounterList.Msg
  | Embedding Embedding.Msg
  | Counter Counter.Msg
  | Foreign Foreign.Msg
  | Http Http.Msg

  | Input Input.Msg

init : Model
init =
  {}


update : Msg -> () -> Model -> Update Model Msg Components msg
update msg props model =
  case Debug.log "" msg of
    Changed _ ->
      return model
        |> send (Input Input.Clear)

    _ ->
      return model

view : () -> Model -> Html Msg msg
view props model =
  node "div"
    []
    []
    [ Theme.wrapper
      [ mount Input.component Input
        (\props ->
          { props
          | placeholder = "Hello There"
          , showClearIcon = True
          , onClear = Just Cleared
          }
        )
      ]
    , mount Counter.component Counter identity
    , mount CounterList.component CounterList identity
    , mount MouseTracker.component MouseTracker identity
    , mount Http.component Http identity
    , mount Foreign.component Foreign identity
    , mount Embedding.component Embedding identity
    ]

main =
  program
    { subscriptions = \_ _ -> []
    , initialState = init
    , defaultProps = ()
    , update = update
    , view = view
    }
    (Just Load)

