module Examples.Components.GoogleMaps exposing (..)

{-| Google Maps component using a foreign inferno component.

@docs Position, Props, mount
-}

import Rumble.Html exposing (Html, foreign)
import Native.Components.GoogleMaps

{-| Represents a geographic position.
-}
type alias Position =
  { lat : Float
  , lng : Float
  }


{-| Props for the component.
-}
type alias Props msg =
  { onCenterChange : Maybe (Position -> msg)
  , onZoomLevelChanged : Maybe (Int -> msg)
  , center : Position
  , zoomLevel : Int
  }


{-| Mounts the component with the given props.
-}
mount : Props msg -> Html msg a
mount props =
  foreign props Native.Components.GoogleMaps.component
