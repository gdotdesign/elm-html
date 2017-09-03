module Examples.MouseTracker exposing (..)

{-| Example for showcasing basic subscriptions.

@docs State, Msg, initialState, subscriptions, view, component, update
-}

import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Subscription exposing (Subscription)
import Rumble.Mouse exposing (Position, moves)
import Rumble.Html.Events exposing (onClick)
import Rumble.Style exposing (style)
import Rumble.Update exposing (..)

{-| The state.
-}
type alias State =
  { position : Position
  , tracking : Bool
  }


{-| The messages.
-}
type Msg
  = Move Position
  | Toggle


{-| The initial state.
-}
initialState : State
initialState =
  { position = { top = 0, left = 0 }
  , tracking = True
  }


{-| The update.
-}
update : Msg -> () -> State -> Update State Msg msg commands
update msg () state =
  case msg of
    Toggle ->
      return { state | tracking = not state.tracking }

    Move position ->
      return { state | position = position }


{-| The view.
-}
view : () -> State -> Html Msg parentMsg
view () state =
  container
    [ title "Mouse Tracker"
    , p """
        This example showcases the subscription system with tracking the mouse
        position.
        """
    , node "div" []
      [ style
        [ ( "font-size", "20px" )
        , ( "line-height", "1.6em" )
        , ( "margin-bottom", "20px" )
        ]
      ]
      [ node "div" [] []
        [ text "Top: "
        , node "strong" [] [] [ text ((toString state.position.top) ++ "px") ]
        ]
      , node "div" [] []
        [ text "Left: "
        , node "strong" [] [] [ text ((toString state.position.left) ++ "px") ]
        ]
      ]
    , button Toggle (if state.tracking then "Stop tracking" else "Track")
    ]


{-| The subscriptions.
-}
subscriptions : () -> State -> List (Subscription Msg)
subscriptions () state =
  if state.tracking then
    [ moves Move ]
  else
    []


{-| The component.
-}
component : Component () State Msg msg components
component =
  { subscriptions = subscriptions
  , initialState = initialState
  , update = update
  , view = view
  }
