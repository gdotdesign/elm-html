module Examples.Components.Counter exposing
  (Model, Msg(Increment, Decrement), Event(..), component)

{-| A simple counter component with the following features:
  - buttons for increment / decrement
  - a side effect for an other decrement which is triggered after 1 second
  - styling for the buttons are embedded
  - 'Incremented' 'Decremented' and 'Change' events
  - API for incrementing and decrementing

# Model
@docs Model, Msg

# Events
@docs Event

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
type alias Model =
  { count: Int
  }


{-| Messages that a counter can handle.
-}
type Msg
  = DelayedDecrement
  | Increment
  | Decrement


{-| Events that a counter can emit.
-}
type Event
  = Incremented Int
  | Decremented Int
  | Changed Int


{-| Default model for a counter.
-}
init : Model
init =
  { count = 0
  }


{-| Updates a counter.
-}
update : Msg -> Model -> Update Model Msg Event command
update msg model =
  case msg of
    Decrement ->
      let
        newCount = model.count - 1
      in
        return
          { model | count = newCount }
            |> emit (Decremented newCount)
            |> emit (Changed newCount)
            |> andThen (Task.delay 1000 DelayedDecrement)

    DelayedDecrement ->
      let
        newCount = model.count - 1
      in
        return
          { model | count = newCount }
            |> emit (Decremented newCount)
            |> emit (Changed newCount)

    Increment ->
      let
        newCount = model.count + 1
      in
        return
          { model | count = newCount }
            |> emit (Incremented newCount)
            |> emit (Changed newCount)


{-| Renders a counter.
-}
view : Model -> Html Msg
view model =
  node "div"
    []
    [ style
      [ ( "display", "inline-flex" )
      , ( "font-family", "sans" )
      ]

    , selector "button"
      [ ( "background", "CornflowerBlue" )
      , ( "justify-content", "center" )
      , ( "font-family", "inherit" )
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
      [ ( "border-radius", "50% 0 0 50%" )
      ]

    , selector "button:last-child"
      [ ( "border-radius", "0 50% 50% 0" )
      ]
    ]
    [ node "button"
      [ onClick Decrement ]
      []
      [ text "-"]

    , node "div" []
      [ style
        [ ( "padding", "0 20px" )
        , ( "background", "#b6caef" )
        , ( "line-height", "30px" )
        ]
      ]
      [ text (toString model.count) ]

    , node "button"
      [ onClick Increment ]
      []
      [ text "+"]
    ]


{-| The counter component.
-}
component : Component Model Msg Event command
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
