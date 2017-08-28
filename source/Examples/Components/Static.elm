module Examples.Components.Static exposing (..)

{-| Static elements for the examples.

@docs li, p, title, ul
-}

import Rumble.Html exposing (Html, node, text)
import Rumble.Style exposing (style)

{-| Renders a title with the given content.
-}
title : String -> Html msg
title content =
  node "h1" []
    [ style
      [ ( "font-family", "sans" )
      ]
    ]
    [ text content ]


{-| Renders a paragraph with the given content.
-}
p : String -> Html msg
p content =
  node "p" []
    [ style
      [ ( "font-family", "sans" )
      ]
    ]
    [ text content ]


{-| Renders a list with the given content.
-}
ul : List (Html msg) -> Html msg
ul =
  node "ul" []
    [ style
      [ ( "font-family", "sans" )
      ]
    ]


{-| Renders a listitem with the given content.
-}
li : String -> Html msg
li content =
  node "li" []
    [ ]
    [ text content ]
