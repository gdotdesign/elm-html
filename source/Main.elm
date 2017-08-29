import Test
import NestedCounter

import Examples.MouseTracker as MouseTracker
import Examples.Components.Counter as Counter
import Examples.Counter

import Rumble.Html as Html exposing (Html, root, node, text, on, mount,mountWithEvent, mountWithContent)
import Rumble.Style exposing (style, selector)
import Rumble.Html.Events exposing (onClick)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)
import Rumble.Http as Http

import Ui.Input
import Ui.Theme

import Dict

type alias Model =
  { incrementCount: Int
  , decrementCount: Int
  , counterChanged: Int
  , counterCount :Int
  , result : String
  }

type Msg
  = Counter Counter.Event
  | CounterList Counter.Event
  | Open Test.Event
  | Fetch
  | Result String
  | Progress Http.Progress
  | Input Ui.Input.Event
  | DoIncrement

type Components
  = ACounter Counter.Msg
  | BCounter Counter.Msg
  | CList Int Counter.Msg
  | NCounter NestedCounter.Msg
  | LCounter Counter.Msg
  | IInput Ui.Input.Msg
  | TTest Test.Msg
  | CounterExample Examples.Counter.Msg
  | MT MouseTracker.Msg


init : Model
init =
  { incrementCount = 0
  , decrementCount = 0
  , counterChanged = 0
  , counterCount = 0
  , result = ""
  }


fetch : Task Never Msg
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
  case msg of
    CounterList event ->
      case event of
        Counter.Incremented _ ->
          return { model | counterCount = model.counterCount + 1 }

        Counter.Decremented _ ->
          return { model | counterCount = model.counterCount - 1 }

        _ -> return model

    Counter event ->
      case event of
        Counter.Incremented _ ->
          return { model | incrementCount = model.incrementCount + 1 }

        Counter.Decremented _ ->
          return { model | decrementCount = model.decrementCount + 1 }

        Counter.Changed _ ->
          return { model | counterChanged = model.counterChanged + 1 }

    Fetch ->
      return model
        |> andThen fetch

    Result data ->
      return { model | result = data }

    DoIncrement ->
      return model
        |> send (ACounter Counter.Increment)

    _ ->
      return model

view : Model -> Html Msg
view model =
  let
    content =
      node "button" [ onClick Fetch] [] [text "Fetch"]

    counterList =
      List.range 1 model.counterCount
      |> List.map (\index -> mountWithEvent Counter.component (CList index) Counter)
  in
    node "div"
      []
      []
      [ node "div" [] []
        [ node "div" [] []
          [ node "h1" [] [] [ text "Nested Component" ]
          , mountWithEvent NestedCounter.component NCounter Counter
          , node "hr" [] [] []
          , node "h1" [] [] [ text "Component List" ]
          , mountWithEvent Counter.component LCounter CounterList
          , node "hr" []
            [ style
              [ ("border", "0")
              , ("border-bottom", "1px dashed #ccc")
              ]
            ] []
          , node "div" [] [] counterList
          , node "hr" [] [] []
          , content
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
        [ mount MouseTracker.component MT
        , mount Examples.Counter.component CounterExample
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
