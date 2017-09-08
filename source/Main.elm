import Examples.MouseTracker as MouseTracker
import Examples.CounterList as CounterList
import Examples.Embedding as Embedding
import Examples.Foreign as Foreign
import Examples.Counter as Counter
import Examples.Http as Http

import Rumble.Html.Events exposing (onClick)
import Rumble exposing (..)
import Rumble.Navigation

import Ui.Theme as Theme
import Ui.Pager as Pager
import Ui.Input as Input

import Dict exposing (Dict)

type alias Model =
  { page : String }

type Msg
  = Changes Rumble.Navigation.Location
  | Navigate String
  | Changed String
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
  | Pager Pager.Msg

init : Model
init =
  { page = Rumble.Navigation.location () |> .pathname
  }


update : Msg -> () -> Model -> Update Model Msg Components msg
update msg props model =
  case msg of
    Changes location ->
      return { model | page = location.pathname }

    Changed _ ->
      return model
        |> send (Input Input.Clear)

    Navigate path ->
      return model
        |> andThen (Rumble.Navigation.navigate path)

    _ ->
      return model

components : Dict String (String, Html Msg msg)
components =
  [ ( "/counter", ("Counter", mount Counter.component Counter identity ))
  , ( "/counter-list", ("List of Counters", mount CounterList.component CounterList identity ))
  , ( "/mouse-tracker", ("Mouser Tracker", mount MouseTracker.component MouseTracker identity))
  , ( "/http", ("Http", mount Http.component Http identity))
  , ( "/foreign", ("Foreign Component", mount Foreign.component Foreign identity))
  , ( "/embedding", ("Embedding Content", mount Embedding.component Embedding identity))
  ]
  |> Dict.fromList

view : () -> Model -> Html Msg msg
view props model =
  let
    page =
      Dict.get model.page components
        |> Maybe.map Tuple.second
        |> Maybe.withDefault (text "")

    navigation =
      Dict.toList components
        |> List.map (\(url, (title, _)) ->
          node "a" [onClick (Navigate url) ] [] [ text title ]
        )
  in
  node "div"
    []
    []
    [ node "div" [] [] navigation
    , page
    , Theme.wrapper
      [ mount Input.component Input
        (\props ->
          { props
          | placeholder = "Hello There"
          , showClearIcon = True
          , onClear = Just Cleared
          }
        )
      , mount Pager.component Pager
        (\props ->
          { props
          | pages =
            [ node "div" [] [] [ text "A" ]
            , node "div" [] [] [ text "B" ]
            , node "div" [] [] [ text "C" ]
            ]
          }
        )
      ]
    ]

main =
  program
    { subscriptions = \_ _ -> [ Rumble.Navigation.changes Changes]
    , initialState = init
    , defaultProps = ()
    , update = update
    , view = view
    }
    (Just Load)

