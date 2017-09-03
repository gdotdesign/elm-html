module Examples.Components.Pager exposing (..)

import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Html, Component, embed, text, node, on)
import Rumble.Update exposing (Update, return)
import Rumble.Style exposing (style, selector)

import Array exposing (Array)

type alias State =
  { page : Int
  }

type alias Props msg a =
  { pages : Array (Html msg a)
  }

type Msg
  = Next
  | Prev

initialState : State
initialState =
  { page = 0
  }

update : Msg -> Props msg a -> State -> Update State Msg msg components
update msg props state =
  case msg of
    Next ->
      return { page = min ((Array.length props.pages) - 1) (state.page + 1) }

    Prev ->
      return { page = max 0 (state.page - 1) }


view : Props msg a -> State -> Html Msg msg
view props state =
  node "div"
    []
    [ style
      [ ( "width", "300px" )
      ]
    ]
    [ node "div" []
      [ style
        [ ( "display", "flex" )
        , ( "justify-content", "space-between" )
        , ( "margin-bottom", "10px" )
        ]
      ]
      [ button Prev "Prev"
      , button Next "Next"
      ]
    , node "div"
      []
      [ style
        [ ( "border", "1px solid #CCC" )
        , ( "flex-direction", "column" )
        , ( "height", "300px" )
        , ( "display", "flex" )
        ]

      , selector "> *"
        [ ( "flex", "1" )
        ]
      ]
      [ Array.get state.page props.pages
        |> Maybe.withDefault (text "")
        |> embed
      ]
    ]


component : Component (Props msg a) State Msg msg components
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
