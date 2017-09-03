module Examples.Embedding exposing (..)

import Examples.Components.Static exposing (..)
import Examples.Components.Pager as Pager

import Rumble.Html exposing (Component, Html, mount, node, text)
import Rumble.Style exposing (Rule, style)
import Rumble.Update exposing (..)

import Array

type alias State =
  { count : Int
  }

type Msg
  = Increment

type Components
  = Pager Pager.Msg

initialState : State
initialState =
  { count = 0
  }

update : Msg -> () -> State -> Update State Msg msg Components
update msg props state =
  case msg of
    Increment ->
      return { state | count = state.count + 1 }

sharedStyle : Rule
sharedStyle =
  style
    [ ( "justify-content", "center" )
    , ( "flex-direction", "column" )
    , ( "align-items", "center" )
    , ( "display", "flex" )
    ]

view : () -> State -> Html Msg parentMsg
view () state =
  container
    [ title "Embedding Content"
    , p """
        This example shows a component (Pager) that has embedded content
        (the pages) from it's parent component.
        """
    , p """
        Use the prev / next buttons (which belongs to the pager) to change
        pages. The second page contains a button that increments this examples
        counter.
        """
    , p ("Count: " ++ (toString state.count))
    , mount Pager.component Pager
      { pages = Array.fromList
        [ node "div" []
          [ style [ ( "background", "#F0F8FF") ]
          , sharedStyle
          ]
          [ text "Page 1" ]
        , node "div" []
          [ style [ ( "background", "#F0FFF0") ]
          , sharedStyle
          ]
          [ text "Page 2"
          , button Increment "Increment"
          ]
        , node "div" []
          [ style [ ( "background", "#F5F5DC") ]
          , sharedStyle
          ]
          [ text "Page 3" ]
        ]
      }
    ]

component : Component () State Msg msg Components
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
