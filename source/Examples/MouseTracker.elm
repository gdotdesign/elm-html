module Examples.MouseTracker exposing (..)

{-| Example for showcasing basic subscriptions.

@docs Model, Msg, init, subscriptions, view, component, update
-}

import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Subscription exposing (Subscription)
import Rumble.Mouse exposing (Position, moves)
import Rumble.Html.Events exposing (onClick)
import Rumble.Update exposing (..)

{-| The model.
-}
type alias Model =
  { position : Position
  , track : Bool
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
  , track = True
  }


{-| The update.
-}
update : Msg -> Model -> Update Model Msg event command
update msg model =
  case msg of
    Toggle ->
      return { model | track = not model.track }

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
    , node "div"
      [ onClick Toggle ]
      []
      [ text (toString model) ]
    ]


{-| The subscriptions.
-}
subscriptions : Model -> List (Subscription Msg)
subscriptions model =
  if model.track then
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
