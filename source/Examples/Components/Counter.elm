module Examples.Components.Counter exposing
  (State, Msg(Increment, Decrement), Props, component)

{-| A simple counter component with the following features:
  - buttons for increment / decrement
  - a side effect for an other decrement which is triggered after 1 second
  - styling for the buttons are embedded
  - 'Incremented' 'Decremented' and 'Change' events
  - API for incrementing and decrementing

# State
@docs State, Msg

# Props
@docs Props

# Component
@docs component
-}
import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Style exposing (style, selector)
import Rumble.Html.Events exposing (onClick)
import Rumble.Task as Task exposing (Task)
import Rumble.Update exposing (..)

{-| Representation of a counter.
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


{-| Initial state for a counter.
-}
initialState : State
initialState =
  { count = 0
  }


{-| Updates a counter.
-}
update : Msg -> Props msg -> State -> Update State Msg msg command
update msg props state =
  let
    count = Maybe.withDefault state.count props.count
  in
    case msg of
      Decrement ->
        let
          newCount = count - 1

          updateData =
            return
              { state | count = newCount }
                |> maybeEmit props.onDecrement newCount
                |> maybeEmit props.onChange newCount
        in
          if props.delayedDecrement then
            andThen (Task.delay 1000 DelayedDecrement) updateData
          else
            updateData

      DelayedDecrement ->
        let
          newCount = count - 1
        in
          return
            { state | count = newCount }
              |> maybeEmit props.onDecrement newCount
              |> maybeEmit props.onChange newCount

      Increment ->
        let
          newCount = count + 1
        in
          return
            { state | count = newCount }
              |> maybeEmit props.onIncrement newCount
              |> maybeEmit props.onChange newCount


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
component : Component (Props msg) State Msg msg command
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
