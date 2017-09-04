module Examples.Components.Pager exposing (..)

{-| A component for paginating content.

@docs State, Props, Msg, initialState, update, view, component
-}

import Examples.Components.Static exposing (..)
import Array exposing (Array)
import Rumble exposing (..)


{-| The state.
-}
type alias State =
  { page : Int
  }


{-| The props.
-}
type alias Props msg parentMsg =
  { pages : Array (Html msg parentMsg)
  }


{-| The messages.
-}
type Msg
  = Next
  | Prev


{-| The initial state.
-}
initialState : State
initialState =
  { page = 0
  }


{-| The update.
-}
update : Msg -> Props msg a -> State -> Update State Msg components msg
update msg props state =
  case msg of
    Next ->
      return { page = min ((Array.length props.pages) - 1) (state.page + 1) }

    Prev ->
      return { page = max 0 (state.page - 1) }


{-| The view.
-}
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


{-| The component.
-}
component : Component (Props msg a) State Msg components msg
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
