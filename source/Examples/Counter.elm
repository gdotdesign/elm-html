module Examples.Counter exposing (..)

{-| Example component for showcasing a simple component.

@docs Model, Msg, Components, init, update, view, component
-}

import Examples.Components.Static exposing (..)
import Examples.Components.Counter as Counter

import Rumble.Html exposing (Component, Html, node, text, mountWithEvent)
import Rumble.Update exposing (Update, send, return)

{-| The model.
-}
type alias Model =
  { events : List String
  }


{-| The messages.
-}
type Msg
  = IncrementCounter
  | DecrementCounter
  | Events Counter.Event


{-| The components.
-}
type Components
  = Counter Counter.Msg


{-| Defaults a model.
-}
init : Model
init =
  { events = []
  }


{-| Update.
-}
update : Msg -> Model -> Update Model Msg event Components
update msg model =
  case msg of
    IncrementCounter ->
      return model
        |> send (Counter Counter.Increment)

    DecrementCounter ->
      return model
        |> send (Counter Counter.Decrement)

    Events event ->
      case event of
        Counter.Incremented count ->
          return
            { model
            | events = ("Incremented to: " ++ (toString count)) :: model.events
            }

        Counter.Decremented count ->
          return
            { model
            | events = ("Decremented to: " ++ (toString count)) :: model.events
            }

        Counter.Changed count ->
          return
            { model
            | events = ("Changed to: " ++ (toString count)) :: model.events
            }


{-| The view.
-}
view : Model -> Html Msg
view model =
  node "div" [] []
    [ title "Counter"
    , p "Simple stateful component that implements:"
    , ul
      [ li "buttons for increment / decrement"
      , li "a side effect for an other decrement which is triggered after 1 second"
      , li "styling for the buttons are embedded"
      , li "'Incremented' 'Decremented' and 'Change' events"
      , li "API for incrementing and decrementing"
      ]
    , mountWithEvent Counter.component Counter Events
    , p "Events:"
    , ul (List.map li model.events)
    ]


{-| The component.
-}
component : Component Model Msg event Components
component =
  { update = update
  , model = init
  , view = view
  }
