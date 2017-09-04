module Ui.Icons exposing (..)

{-| This module contains icons for the components.

# Icons
@docs icon, close
-}

import Rumble exposing (..)

{-| Base for all icons.
-}
icon : String -> List (Attribute msg) -> List Rule -> Html msg parentMsg
icon iconPath attributes styles =
  node "svg"
    ( [ Attribute "width" "36"
      , Attribute "height" "36"
      , Attribute "viewBox" "0 0 36 36"
      ] ++ attributes
    )
    styles
    [ node "path" [ Attribute "d" iconPath ] [] [] ]


{-| Close icon.
-}
close : List (Attribute msg) -> List Rule -> Html msg parentMsg
close =
  icon
    """
    M35.592 30.256l-12.3-12.34L35.62 5.736c.507-.507.507-1.332
    0-1.838L32.114.375C31.87.13 31.542 0 31.194 0c-.346
    0-.674.14-.917.375L18.005 12.518 5.715.384C5.47.14 5.14.01
    4.794.01c-.347 0-.675.14-.918.374L.38 3.907c-.507.506-.507
    1.33 0 1.837l12.328 12.18L.418 30.257c-.245.244-.385.572-.385.918
    0 .347.13.675.384.92l3.506 3.522c.254.253.582.384.92.384.327 0
    .665-.122.918-.384l12.245-12.294 12.253
    12.284c.253.253.58.385.92.385.327 0
    .664-.12.917-.384l3.507-3.523c.243-.243.384-.57.384-.918-.01-.337-.15-.665-.394-.91z
    """
