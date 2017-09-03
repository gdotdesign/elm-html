module Examples.Http exposing (..)

{-| An example to showcase an Http request.

@docs State, Msg, initialState, fetch, update, view, component
-}

import Examples.Components.Static exposing (..)

import Rumble exposing (..)
import Rumble.Http as Http

{-| The state.
-}
type alias State =
  { progress : Http.Progress
  , result : String
  , fetched : Bool
  }


{-| The messages.
-}
type Msg
  = Progress Http.Progress
  | Load String
  | Fetch
  | Abort


{-| The initial state.
-}
initialState : State
initialState =
  { progress = Http.Initial
  , fetched = False
  , result = ""
  }


{-| Process for fetching a request.
-}
fetch : Process Msg
fetch =
  "https://httpbin.org/stream-bytes/5000?chunk_size=1"
    |> Http.get
    |> Http.onProgress Progress
    |> Http.onLoad Load
    |> Http.toProcess


{-| The update.
-}
update : Msg -> () -> State -> Update State Msg components msg
update msg () state =
  case msg of
    Abort ->
      return initialState
        |> abort "request"

    Fetch ->
      return { initialState | fetched = True }
        |> process "request" fetch

    Load data ->
      return { initialState | result = data }

    Progress progress ->
      return { state | progress = progress }


{-| The view.
-}
view : () -> State -> Html Msg msg
view () model =
  let
    abortButton =
      if model.fetched then
        button Abort "Abort"
      else
        text ""

    status =
      if model.fetched then
        case model.progress of
          Http.Initial ->
            if String.isEmpty model.result then
              "Request started. Waiting for data..."
            else
              "Done!"

          Http.Loaded amount ->
            (toString amount) ++ "bytes"

          Http.LoadedWithTotal amount total ->
            (toString amount) ++ "bytes / " ++ (toString total) ++ "bytes"
      else
        if String.isEmpty model.result then
          "Waiting for a request."
        else
          "Done!"
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
      , p ("Status: " ++ status)
      , logs [ text model.result ]
      ]


{-| The component.
-}
component : Component () State Msg component msg
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
