module Test exposing (..)

import Rumble.Html exposing (Html, ComponentWithContent, embed, text, node, on)
import Rumble.Update exposing (Update, return)
import Rumble.Html.Events exposing (onClick)
import Dict exposing (Dict)

type alias Model =
  { open : Bool
  }

type Msg
  = Toggle

type Event
  = Event

init : Model
init =
  { open = False
  }

update : Msg -> Model -> Update Model Msg Event a
update msg model =
  case msg of
    Toggle ->
      return { open = not model.open }


view : Dict String (Html parentMsg a) -> Model -> Html Msg parentMsg
view data model =
  if model.open then
    case Dict.get "content" data of
      Just html -> embed html
      Nothing -> text "Hello"
  else
    node "button" [ onClick Toggle ] [] [ text "Open" ]


component : ComponentWithContent Model Msg Event a b c
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
