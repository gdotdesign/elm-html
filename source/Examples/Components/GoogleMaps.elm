module Examples.Components.GoogleMaps exposing (..)

import Rumble.Html exposing (Html, foreign)
import Native.Components.GoogleMaps

type alias Props =
  { center : { lat : Float, lng : Float }
  , zoomLevel : Int
  }


mount : Props -> Html msg parentMsg
mount props =
  foreign props Native.Components.GoogleMaps.component
