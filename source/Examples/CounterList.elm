module Examples.CounterList exposing (..)

{-| This example showcases how to use list of components.

@docs Model, Msg, Components, init, update, view, component
-}

import Examples.Components.Static exposing (..)
import Examples.Components.Counter as Counter

import Rumble.Html exposing (Component, Html, node, mountWithEvent, text)
import Rumble.Style exposing (style)
import Rumble.Update exposing (..)

{-| The model.
-}
type alias Model =
  { incrementCount : Int
  , decrementCount : Int
  , changedCount : Int
  , counterCount : Int
  }


{-| The messages.
-}
type Msg
  = Counter Counter.Event
  | Events Counter.Event


{-| The components.
-}
type Components
  = CountCounter Counter.Msg
  | List Int Counter.Msg


{-| The initial state.
-}
init : Model
init =
  { incrementCount = 0
  , decrementCount = 0
  , counterCount = 1
  , changedCount = 0
  }


{-| The update.
-}
update : Msg -> Model -> Update Model Msg events Components
update msg model =
  case msg of
    Counter (Counter.Changed count) ->
      if count < 0 then
        return { model | counterCount = 0 }
          |> send (CountCounter (Counter.Set 0))
      else
        return { model | counterCount = count }

    Events (Counter.Incremented _) ->
      return { model | incrementCount = model.incrementCount + 1 }

    Events (Counter.Decremented _) ->
      return { model | decrementCount = model.decrementCount + 1 }

    Events (Counter.Changed _) ->
      return { model | changedCount = model.changedCount + 1 }

    _ ->
      return model


{-| The view.
-}
view : Model -> Html Msg
view model =
  let
    mountCounter index =
      node "div" []
        [ style
          [ ( "margin-bottom", "10px" )
          ]
        ]
        [ text ("Counter #" ++ (toString index) ++ ": ")
        , mountWithEvent Counter.component (List index) Events
        ]

    counters =
      model.counterCount
        |> List.range 1
        |> List.map mountCounter

    counterComponent =
      Counter.component

    counterModel =
      counterComponent.model
  in
    container
      [ title "List of Counters"
      , p "Use this counter to change the number of counters:"
      , mountWithEvent
          { counterComponent | model = { counterModel | count = 1 } }
          CountCounter
          Counter
      , p """
          Here are the counters, each are wired in to count the number of
          increments, decrements and changes.
          """
      , node "div" [] [] counters
      , node "div" [] [] [ text (toString model) ]
      ]


{-| The component.
-}
component : Component Model Msg event Components
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
