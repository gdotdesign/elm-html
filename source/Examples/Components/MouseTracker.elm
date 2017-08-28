module Examples.Components.MouseTracker exposing (..)

import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Subscription exposing (Subscription)
import Rumble.Mouse exposing (Position, moves)
import Rumble.Html.Events exposing (onClick)
import Rumble.Update exposing (..)

type alias Model =
  { position : Position
  , track : Bool
  }

type Msg
  = Move Position
  | Toggle

init : Model
init =
  { position = { top = 0, left = 0 }
  , track = True
  }

update : Msg -> Model -> Update Model Msg event command
update msg model =
  case msg of
    Toggle ->
      return { model | track = not model.track }

    Move position ->
      return { model | position = position }


view : Model -> Html Msg
view model =
  node "div"
    [ onClick Toggle ]
    []
    [ text (toString model) ]

subscriptions : Model -> List (Subscription Msg)
subscriptions model =
  if model.track then
    [ moves Move ]
  else
    []

component : Component Model Msg event components
component =
  { subscriptions = subscriptions
  , update = update
  , model = init
  , view = view
  }
