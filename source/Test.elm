module Test exposing (..)

import Rumble.Html exposing (Html, OpenComponent, embed, text, node, on)
import Rumble.Update exposing (Update, return)
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

update : Msg -> Model -> Update Model Msg Event
update msg model =
  case msg of
    Toggle ->
      return { open = not model.open }


view : Dict String (Html parentMsg) -> Model -> Html Msg
view data model =
  if model.open then
    case Dict.get "content" data of
      Just html -> embed html
      Nothing -> text "Hello"
  else
    node "button" [ on "click" (\value -> Toggle) ] [ text "Open" ]


component : OpenComponent Model Msg Event a
component =
  { update = update
  , model = init
  , view = view
  }
