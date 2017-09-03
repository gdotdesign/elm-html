module Examples.Foreign exposing (..)

import Examples.Components.GoogleMaps as GoogleMaps
import Examples.Components.Static exposing (..)

import Rumble.Html exposing (Html, Component, node)
import Rumble.Style exposing (style, selector)
import Rumble.Update exposing (..)

type alias State =
  { center : GoogleMaps.Position
  , zoomLevel : Int
  }

type Msg
  = IncreaseZoomLevel
  | DecreaseZoomLevel
  | CenterChanged GoogleMaps.Position
  | ZoomLevelChanged Int

initialState : State
initialState =
  { center = { lat = 47.4979, lng = 19.0402 }
  , zoomLevel = 8
  }

update : Msg -> () -> State -> Update State Msg msg components
update msg () state =
  case msg of
    IncreaseZoomLevel ->
      return { state | zoomLevel = state.zoomLevel + 1 }

    DecreaseZoomLevel ->
      return { state | zoomLevel = state.zoomLevel - 1 }

    CenterChanged position ->
      return { state | center = position }

    ZoomLevelChanged zoomLevel ->
      return { state | zoomLevel = zoomLevel }

view : () -> State -> Html Msg msg
view () state =
  container
    [ title "Foreign Component"
    , p """
        This example shows how to embed a foreign (google maps) component.
        """
    , GoogleMaps.mount
      { center = state.center
      , zoomLevel = state.zoomLevel
      , onCenterChange = Just CenterChanged
      , onZoomLevelChanged = Just ZoomLevelChanged
      }

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


component : Component () State Msg msg components
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
