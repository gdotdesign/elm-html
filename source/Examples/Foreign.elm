module Examples.Foreign exposing (..)

import Examples.Components.GoogleMaps as GoogleMaps
import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Html, Component, node)
import Rumble.Style exposing (style, selector)
import Rumble.Update exposing (..)

type alias Model = GoogleMaps.Props

type Msg
  = IncreaseZoomLevel
  | DecreaseZoomLevel

init : Model
init =
  { center = { lat = 47.4979, lng = 19.0402 }
  , zoomLevel = 8
  }

update : Msg -> Model -> Update Model Msg events components
update msg model =
  case msg of
    IncreaseZoomLevel ->
      return { model | zoomLevel = model.zoomLevel + 1 }

    DecreaseZoomLevel ->
      return { model | zoomLevel = model.zoomLevel - 1 }

view : Model -> Html Msg parentMsg
view model =
  container
    [ title "Foreign Component"
    , p """
        This example shows how to embed a foreign (google maps) component.
        """
    , GoogleMaps.mount model
    , node "div" []
      [ style
        [ ( "margin-top", "10px" )
        , ( "display", "flex" )
        ]

      , selector "* + *"
        [ ( "margin-left", "10px" )
        ]
      ]
      [ button IncreaseZoomLevel "+ Zoom Level"
      , button DecreaseZoomLevel "- Zoom Level"
      ]
    ]


component : Component Model Msg events components parentMsg
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
