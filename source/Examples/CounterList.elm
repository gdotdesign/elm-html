module Examples.CounterList exposing (..)

{-| This example showcases how to use dynamic list of counters while counting
the number of increments, decrements and overall changes.

@docs State, Msg, Components, initialState, update, view, component
-}

import Examples.Components.Static exposing (..)
import Examples.Components.Counter as Counter

import Rumble exposing (..)

{-| The state.
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
update : Msg -> () -> State -> Update State Msg Components msg
update msg props state =
  case msg of
    SetCount count ->
      return { state | counterCount = max 0 count }

    Incremented ->
      return { state | incrementCount = state.incrementCount + 1 }

    Decremented ->
      return { state | decrementCount = state.decrementCount + 1 }

    Changed ->
      return { state | changedCount = state.changedCount + 1 }


{-| The view.
-}
view : () -> State -> Html Msg msg
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
          (\props ->
            { props
            | onDecrement = Just (always Decremented)
            , onIncrement = Just (always Incremented)
            , onChange = Just (always Changed)
            }
          )
        ]

    counters =
      state.counterCount
        |> List.range 1
        |> List.map mountCounter
  in
    container
      [ title "List of Counters"
      , p "Use this counter to change the number of counters:"
      , mount Counter.component CountCounter
          (\props ->
            { props
            | count = Just state.counterCount
            , onChange = Just SetCount
            }
          )
      , p """
          Here are the counters, each are wired in to count the number of
          increments, decrements and changes.
          """
      , node "div" [] [] counters
      , node "div" [] [] [ text (toString state) ]
      ]


{-| The component.
-}
component : Component () State Msg Components msg
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , defaultProps = ()
  , update = update
  , view = view
  }
