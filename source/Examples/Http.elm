module Examples.Http exposing (..)

import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Html, Component, node, text)
import Rumble.Style exposing (style, selector)
import Rumble.Html.Events exposing (onClick)
import Rumble.Process exposing (Process)
import Rumble.Update exposing (..)
import Rumble.Http as Http

type alias Model =
  { progress : Http.Progress
  , result : String
  , fetched : Bool
  }

type Msg
  = Progress Http.Progress
  | Load String
  | Fetch
  | Abort

init : Model
init =
  { progress = Http.Initial
  , fetched = False
  , result = ""
  }

fetch : Process Msg
fetch =
  "https://httpbin.org/stream-bytes/5000?chunk_size=1"
    |> Http.get
    |> Http.onProgress Progress
    |> Http.onLoad Load
    |> Http.send

update : Msg -> Model -> Update Model Msg events components
update msg model =
  case Debug.log "" msg of
    Abort ->
      return { model | fetched = False }
        |> abort "request"

    Fetch ->
      return { model | fetched = True }
        |> process "request" fetch

    Load data ->
      return
        { model
        | result = data
        , progress = Http.Initial
        , fetched = False
        }

    Progress progress ->
      return { model | progress = progress }


view : Model -> Html Msg
view model =
  let
    abortButton =
      if model.fetched then
        button Abort "Abort"
      else
        text ""

    resultText =
      case model.progress of
        Http.Initial ->
          ""

        Http.Loaded amount ->
          (toString amount) ++ "bytes"

        Http.LoadedWithTotal amount total ->
          (toString amount) ++ "bytes / " ++ (toString total) ++ "bytes"
  in
    container
      [ title "Http"
      , p """
          This example makes a streaming request to https://httpbin.org/
          which loads 5000 bytes of data over a few seconds.
          """
      , p """
          After starting the request you can abort it with the abort button.
          """
      , node "div" []
        [ style
          [ ( "display", "flex" )
          ]

        , selector "* + *"
          [ ( "margin-left", "10px" )
          ]
        ]
        [ button Fetch "Fetch"
        , abortButton
        ]
      , p ("Result: " ++ resultText)
      , logs [ text model.result ]
      ]

{-| The component.
-}
component : Component Model Msg events components
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
