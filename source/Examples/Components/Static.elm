module Examples.Components.Static exposing (..)

{-| Static elements for the examples.

@docs li, p, title, ul, container, logs, log, button
-}

import Rumble.Html exposing (Html, node, text)
import Rumble.Style exposing (style, selector)
import Rumble.Html.Events exposing (onClick)

{-| A simple button.
-}
button : msg -> String -> Html msg
button msg content =
  node "button"
    [ onClick msg ]
    [ style
      [ ( "justify-content", "center" )
      , ( "font-family", "inherit" )
      , ( "background", "#2E86AB" )
      , ( "align-items", "center" )
      , ( "border-radius", "3px" )
      , ( "font-weight", "bold" )
      , ( "font-size", "14px" )
      , ( "padding", "0 10px" )
      , ( "cursor", "pointer" )
      , ( "line-height", "0" )
      , ( "display", "flex" )
      , ( "color", "white" )
      , ( "height", "30px" )
      , ( "border", "0" )
      ]
    ]
    [ text content
    ]


{-| Renders a log container.
-}
logs : List (Html msg) -> Html msg
logs =
  node "div" []
    [ style
      [ ( "border", "1px solid rgba(0,0,0,0.1)")
      , ( "padding", "3px 10px" )
      , ( "background", "white" )
      , ( "font-family", "sans" )
      , ( "line-height", "1em" )
      , ( "font-size", "14px" )
      , ( "overflow", "auto" )
      , ( "height", "200px" )
      ]
    ]


{-| Renders a log container.
-}
log : String -> Html msg
log content =
  node "div" []
    [ style
      [ ( "padding", "7px 0" )
      ]

    , selector "+ *"
      [ ( "border-top", "1px dashed rgba(0,0,0,0.1)" )
      ]
    ]
    [ text content ]


{-| Renders an example container.
-}
container : List (Html msg) -> Html msg
container =
  node "div" []
    [ style
      [ ( "background", "#F2F6F7" )
      , ( "font-family", "sans" )
      , ( "margin", "10px 2px" )
      , ( "color", "#26343D" )
      , ( "padding", "20px" )
      ]
    ]


{-| Renders a title with the given content.
-}
title : String -> Html msg
title content =
  node "h1" []
    [ style
      [ ( "font-family", "sans" )
      , ( "margin-top", "0" )
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
    [ style
      [ ( "line-height", "1.4em" )
      ]
    ]
    [ text content ]
