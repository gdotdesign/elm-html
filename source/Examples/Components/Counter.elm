module Examples.Components.Counter exposing
  (State, Msg(Increment, Decrement), Props, component)

{-| A simple counter component with the following features:
  - buttons for increment / decrement
  - a side effect for an other decrement which is triggered after 5 seconds
  - styling for the buttons
  - props for events: onIncrement, onDecrement and onChange
  - prop for the delayed decrement side effect
  - API for incrementing and decrementing

@docs State, Props, Msg, component
-}

import Rumble.Html.Events exposing (onClick)
import Rumble exposing (..)
import Rumble.Task as Task

{-| Representation of the state of a counter.
-}
type alias State =
  { count: Int
  }


{-| Messages that a counter can handle.
-}
type Msg
  = DelayedDecrement
  | Increment
  | Decrement


{-| Props for a counter.
-}
type alias Props msg =
  { onDecrement : Maybe (Int -> msg)
  , onIncrement : Maybe (Int -> msg)
  , onChange : Maybe (Int -> msg)
  , delayedDecrement : Bool
  , count : Maybe Int
  }


{-| The default props.
-}
defaultProps : Props msg
defaultProps =
  { delayedDecrement = False
  , onDecrement = Nothing
  , onIncrement = Nothing
  , onChange = Nothing
  , count = Nothing
  }


{-| Initial state for a counter.
-}
initialState : State
initialState =
  { count = 0
  }


{-| Updates a counter.
-}
update : Msg -> Props msg -> State -> Update State Msg components msg
update msg props state =
  let
    -- The component can be "controlled" with the props so we need to use
    -- that if present
    count =
      Maybe.withDefault state.count props.count
  in
    case msg of
      Decrement ->
        let
          newCount = count - 1

          updateData =
            return
              { state | count = newCount }
                |> emitMaybe props.onDecrement newCount
                |> emitMaybe props.onChange newCount
        in
          if props.delayedDecrement then
            updateData
              |> andThen (Task.delay 5000 DelayedDecrement)
          else
            updateData

      DelayedDecrement ->
        let
          newCount = count - 1
        in
          return
            { state | count = newCount }
              |> emitMaybe props.onDecrement newCount
              |> emitMaybe props.onChange newCount

      Increment ->
        let
          newCount = count + 1
        in
          return
            { state | count = newCount }
              |> emitMaybe props.onIncrement newCount
              |> emitMaybe props.onChange newCount


{-| Renders a counter.
-}
view : Props msg -> State -> Html Msg msg
view props state =
  node "div"
    []
    [ style
      [ ( "display", "inline-flex" )
      , ( "font-family", "sans" )
      ]

    , selector "button"
      [ ( "justify-content", "center" )
      , ( "font-family", "inherit" )
      , ( "background", "#2E86AB" )
      , ( "align-items", "center" )
      , ( "font-weight", "bold" )
      , ( "font-size", "18px" )
      , ( "cursor", "pointer" )
      , ( "line-height", "0" )
      , ( "display", "flex" )
      , ( "color", "white" )
      , ( "height", "30px" )
      , ( "width", "30px" )
      , ( "border", "0" )
      ]

    , selector "button:first-child"
      [ ( "border-radius", "3px 0 0 3px" )
      ]

    , selector "button:last-child"
      [ ( "border-radius", "0 3px 3px 0" )
      ]
    ]
    [ node "button"
      [ onClick Decrement ]
      []
      [ text "-"]

    , node "div" []
      [ style
        [ ( "background", "white" )
        , ( "line-height", "30px" )
        , ( "padding", "0 20px" )
        ]
      ]
      [ text (toString (Maybe.withDefault state.count props.count)) ]

    , node "button"
      [ onClick Increment ]
      []
      [ text "+"]
    ]


{-| The counter component.
-}
component : Component (Props msg) State Msg components msg
component =
  { initialState = initialState
  , defaultProps = defaultProps
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }

main =
  program component Nothing
