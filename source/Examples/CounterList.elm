module Examples.CounterList exposing (..)

{-| This example showcases how to use list of components.

@docs State, Msg, Components, initialState, update, view, component
-}

import Examples.Components.Static exposing (..)
import Examples.Components.Counter as Counter

import Rumble.Html exposing (Component, Html, node, mount, text)
import Rumble.Style exposing (style)
import Rumble.Update exposing (..)

{-| The model.
-}
type alias State =
  { incrementCount : Int
  , decrementCount : Int
  , changedCount : Int
  , counterCount : Int
  }


{-| The messages.
-}
type Msg
  = SetCount Int
  | Incremented
  | Decremented
  | Changed


{-| The components.
-}
type Components
  = CountCounter Counter.Msg
  | List Int Counter.Msg


{-| The initial state.
-}
initialState : State
initialState =
  { incrementCount = 0
  , decrementCount = 0
  , counterCount = 1
  , changedCount = 0
  }


{-| The update.
-}
update : Msg -> () -> State -> Update State Msg msg Components
update msg props state =
  case msg of
    SetCount count ->
      if count < 0 then
        return { state | counterCount = 0 }
      else
        return { state | counterCount = count }

    Incremented ->
      return { state | incrementCount = state.incrementCount + 1 }

    Decremented ->
      return { state | decrementCount = state.decrementCount + 1 }

    Changed ->
      return { state | changedCount = state.changedCount + 1 }


{-| The view.
-}
view : () -> State -> Html Msg parentMsg
view props state =
  let
    mountCounter index =
      node "div" []
        [ style
          [ ( "margin-bottom", "10px" )
          ]
        ]
        [ text ("Counter #" ++ (toString index) ++ ": ")
        , mount Counter.component (List index)
          { onDecrement = Just (always Decremented)
          , onIncrement = Just (always Incremented)
          , onChange = Just (always Changed)
          , delayedDecrement = False
          , count = Nothing
          }
        ]

    counters =
      state.counterCount
        |> List.range 1
        |> List.map mountCounter
  in
    container
      [ title "List of Counters"
      , p "Use this counter to change the number of counters:"
      , mount
          Counter.component
          CountCounter
          { count = Just state.counterCount
          , onChange = Just SetCount
          , delayedDecrement = False
          , onDecrement = Nothing
          , onIncrement = Nothing
          }
      , p """
          Here are the counters, each are wired in to count the number of
          increments, decrements and changes.
          """
      , node "div" [] [] counters
      , node "div" [] [] [ text (toString state) ]
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
