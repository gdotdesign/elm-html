module Examples.MouseTracker exposing (..)

{-| Example for showcasing basic subscriptions.

@docs Model, Msg, init, subscriptions, view, component, update
-}

import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Subscription exposing (Subscription)
import Rumble.Mouse exposing (Position, moves)
import Rumble.Html.Events exposing (onClick)
import Rumble.Style exposing (style)
import Rumble.Update exposing (..)

{-| The model.
-}
type alias Model =
  { position : Position
  , tracking : Bool
  }


{-| The messages.
-}
type Msg
  = Move Position
  | Toggle


{-| The initial model.
-}
init : Model
init =
  { position = { top = 0, left = 0 }
  , tracking = True
  }


{-| The update.
-}
update : Msg -> Model -> Update Model Msg event command
update msg model =
  case msg of
    Toggle ->
      return { model | tracking = not model.tracking }

    Move position ->
      return { model | position = position }


{-| The view.
-}
view : Model -> Html Msg
view model =
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
        , node "strong" [] [] [ text ((toString model.position.top) ++ "px") ]
        ]
      , node "div" [] []
        [ text "Left: "
        , node "strong" [] [] [ text ((toString model.position.left) ++ "px") ]
        ]
      ]
    , node "button"
      [ onClick Toggle ]
      [ style
        [ ( "justify-content", "center" )
        , ( "font-family", "inherit" )
        , ( "background", "#2E86AB" )
        , ( "align-items", "center" )
        , ( "border-radius", "3px" )
        , ( "font-weight", "bold" )
        , ( "font-size", "14px" )
        , ( "padding", "0 10px" )
        , ( "cursor", "pointer" )
        , ( "line-height", "0" )
        , ( "display", "flex" )
        , ( "color", "white" )
        , ( "height", "30px" )
        , ( "border", "0" )
        ]
      ]
      [ text (if model.tracking then "Stop tracking" else "Track")
      ]
    ]


{-| The subscriptions.
-}
subscriptions : Model -> List (Subscription Msg)
subscriptions model =
  if model.tracking then
    [ moves Move ]
  else
    []


{-| The component.
-}
component : Component Model Msg event components
component =
  { subscriptions = subscriptions
  , update = update
  , model = init
  , view = view
  }
