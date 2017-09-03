module Examples.Counter exposing (..)

{-| Example component for showcasing a simple component.

@docs State, Msg, Components, initialState, update, view, component
-}

import Examples.Components.Static exposing (..)
import Examples.Components.Counter as Counter

import Rumble.Html exposing (Component, Html, node, text, mount)
import Rumble.Update exposing (Update, send, return)
import Rumble.Style exposing (style, selector)

{-| The model.
-}
type alias State =
  { events : List String
  }


{-| The messages.
-}
type Msg
  = IncrementCounter
  | DecrementCounter
  | Incremented Int
  | Decremented Int
  | Changed Int


{-| The components.
-}
type Components
  = Counter Counter.Msg


{-| Defaults a model.
-}
initialState : State
initialState =
  { events = []
  }


{-| Update.
-}
update : Msg -> () -> State -> Update State Msg msg Components
update msg props state =
  case msg of
    IncrementCounter ->
      return state
        |> send (Counter Counter.Increment)

    DecrementCounter ->
      return state
        |> send (Counter Counter.Decrement)

    Incremented count ->
      return
        { state
        | events = ("Incremented to: " ++ (toString count)) :: state.events
        }

    Decremented count ->
      return
        { state
        | events = ("Decremented to: " ++ (toString count)) :: state.events
        }

    Changed count ->
      return
        { state
        | events = ("Changed to: " ++ (toString count)) :: state.events
        }


{-| The view.
-}
view : () -> State -> Html Msg msg
view props model =
  container
    [ title "Counter"
    , p "Simple stateful component that implements:"
    , ul
      [ li "buttons for increment / decrement"
      , li "a side effect for an other decrement which is triggered after 1 second"
      , li "styling for the buttons"
      , li "props for events: onIncrement, onDecrement and onChange"
      , li "API for incrementing and decrementing"
      ]
    , mount Counter.component Counter
      { onIncrement = Just Incremented
      , onDecrement = Just Decremented
      , delayedDecrement = True
      , onChange = Just Changed
      , count = Nothing
      }
    , node "div" []
      [ style
        [ ( "margin-top", "10px" )
        , ( "display", "flex" )
        ]

      , selector "* + *"
        [ ( "margin-left", "10px" )
        ]
      ]
      [ button IncrementCounter "Increment"
      , button DecrementCounter "Decrement"
      ]
    , p "Events:"
    , logs (List.map log model.events)
    ]


{-| The component.
-}
component : Component () State Msg msg Components
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
