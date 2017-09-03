module Examples.Components.GoogleMaps exposing (..)

import Rumble.Html exposing (Html, foreign)
import Native.Components.GoogleMaps

type alias Position =
  { lat : Float
  , lng : Float
  }

type alias Props msg =
  { onCenterChange : Maybe (Position -> msg)
  , onZoomLevelChanged : Maybe (Int -> msg)
  , center : Position
  , zoomLevel : Int
  }


mount : Props msg -> Html msg a
mount props =
  foreign props Native.Components.GoogleMaps.component
