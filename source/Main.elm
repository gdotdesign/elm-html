
import Counter
import NestedCounter

import Rumble.Html as Html exposing (Update, Html, node, text, on, mount, return)
import Rumble.Task as Task exposing (Task)
import Rumble.Http as Http

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
  | Fetch
  | Result String
  | Progress Http.Progress

init : Model
init =
  { incrementCount = 0
  , decrementCount = 0
  , counterChanged = 0
  , counterCount = 0
  , result = ""
  }


fetch : Task Msg
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


update : Msg -> Model -> Update Model Msg a
update msg model =
  case Debug.log "" msg of
    CounterList event ->
      case event of
        Counter.Incremented ->
          return { model | counterCount = model.counterCount + 1 }

        Counter.Decremented ->
          return { model | counterCount = model.counterCount - 1 }

        _ -> return model

    Counter event ->
      case event of
        Counter.Incremented ->
          return { model | incrementCount = model.incrementCount + 1 }

        Counter.Decremented ->
          return { model | decrementCount = model.decrementCount + 1 }

        Counter.Changed ->
          return { model | counterChanged = model.counterChanged + 1 }

    Fetch ->
      return model
        |> Html.andThen fetch

    Result data ->
      return { model | result = data }

    _ ->
      return model

view : Model -> Html Msg
view model =
  let
    counterList =
      List.range 1 model.counterCount
      |> List.map (\index -> mount Counter.component ("list-" ++ toString index) Counter)
  in
    node "div"
      []
      [ node "div" []
        [ node "div" []
          [ node "h1" [] [ text "Normal Components" ]
          , mount Counter.component "counter" Counter
          , mount Counter.component "counter2" Counter
          , node "hr" [] []
          , node "h1" [] [ text "Nested Component" ]
          , mount NestedCounter.component "nested-counter" Counter
          , node "hr" [] []
          , node "h1" [] [ text "Component List" ]
          , mount Counter.component "list" CounterList
          , node "div" [] counterList
          , node "hr" [] []
          , node "button" [on "click" (\_ -> Fetch)] [text "Fetch"]
          ]
        ]
      , text (toString model)
      ]

mod =
  Html.root
    { view = view
    , model = init
    , update = update
    }

main =
  Html.program mod
