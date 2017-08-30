import Test
import NestedCounter

import Examples.Components.Counter as Counter
import Examples.MouseTracker as MouseTracker
import Examples.CounterList as CounterList
import Examples.Counter

import Rumble.Html as Html exposing (Html, root, node, text, on, mount,mountWithEvent, mountWithContent)
import Rumble.Style exposing (style, selector)
import Rumble.Process exposing (Process)
import Rumble.Html.Events exposing (onClick)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)
import Rumble.Http as Http

import Ui.Input
import Ui.Theme

import Dict

type alias Model =
  { result : String
  }

type Msg
  = Open Test.Event
  | Fetch
  | Result String
  | Progress Http.Progress
  | Input Ui.Input.Event
  | Abort

type Components
  = CList CounterList.Msg
  | NCounter NestedCounter.Msg
  | LCounter Counter.Msg
  | IInput Ui.Input.Msg
  | TTest Test.Msg
  | CounterExample Examples.Counter.Msg
  | MT MouseTracker.Msg


init : Model
init =
  { result = ""
  }


fetch : Process Msg
fetch =
  Http.send
    { method = "get"
    , headers = []
    , url = "https://httpbin.org/stream-bytes/5000?chunk_size=1"
    , withCredentials = False
    , body = Http.emptyBody

    , onUploadProgress = Nothing
    , onProgress = Just Progress
    , onFinish = Result
    }


update : Msg -> Model -> Update Model Msg a Components
update msg model =
  case Debug.log "" msg of
    Abort ->
      return model
        |> abort "request"

    Fetch ->
      return model
        |> process "request" fetch

    Result data ->
      return { model | result = data }

    _ ->
      return model

view : Model -> Html Msg
view model =
  let
    content =
      node "button" [ onClick Fetch] [] [text "Fetch"]
  in
    node "div"
      []
      []
      [ node "div" [] []
        [ node "div" [] []
          [ node "h1" [] [] [ text "Nested Component" ]
          , mount NestedCounter.component NCounter
          , node "hr" [] [] []
          , content
          , node "button" [ onClick Abort] [] [text "Abort"]
          , node "h1" [] [] [ text "Open Component" ]
          , mountWithContent Test.component TTest Open
              (Dict.fromList [("content", content)])
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
