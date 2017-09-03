module Examples.Foreign exposing (..)

{-| Example of mounting a foreign component.

@docs State, Msg, initialState, update, view, component
-}

import Examples.Components.GoogleMaps as GoogleMaps exposing (Position)
import Examples.Components.Static exposing (..)

import Rumble exposing (..)

{-| The state.
-}
type alias State =
  { center : Position
  , zoomLevel : Int
  }


{-| The messages.
-}
type Msg
  = CenterChanged Position
  | ZoomLevelChanged Int
  | IncreaseZoomLevel
  | DecreaseZoomLevel


{-| The initial state.
-}
initialState : State
initialState =
  { center = { lat = 47.4979, lng = 19.0402 }
  , zoomLevel = 8
  }


{-| The updates.
-}
update : Msg -> () -> State -> Update State Msg components msg
update msg () state =
  case msg of
    IncreaseZoomLevel ->
      return { state | zoomLevel = state.zoomLevel + 1 }

    DecreaseZoomLevel ->
      return { state | zoomLevel = state.zoomLevel - 1 }

    ZoomLevelChanged zoomLevel ->
      return { state | zoomLevel = zoomLevel }

    CenterChanged position ->
      return { state | center = position }


{-| Renders the component.
-}
view : () -> State -> Html Msg msg
view () state =
  container
    [ title "Foreign Component"
    , p """
        This example shows how to embed a foreign component (google maps).
        """

    , GoogleMaps.mount
      { onZoomLevelChanged = Just ZoomLevelChanged
      , onCenterChange = Just CenterChanged
      , center = state.center
      , zoomLevel = state.zoomLevel
      }

    , node "div" []
      [ style
        [ ( "margin-top", "10px" )
        , ( "display", "flex" )
        ]
      ]
      [ text "Center: "
      , text (toString state.center)
      , text ", Zoom Level: "
      , text (toString state.zoomLevel)
      ]

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


{-| The component.
-}
component : Component () State Msg components msg
component =
  { initialState = initialState
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
