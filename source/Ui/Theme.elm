module Ui.Theme exposing (..)

import Rumble.Html exposing (Html, node)
import Rumble.Style exposing (style)

fontFamilyStack : String
fontFamilyStack =
  [ "-apple-system"
  , "system-ui"
  , "BlinkMacSystemFont"
  , "Segoe UI"
  , "Roboto"
  , "Helvetica Neue"
  , "Arial"
  , "sans-serif"
  ]
  |> String.join ","

focusedIdleBoxShadows : String
focusedIdleBoxShadows =
  [ "0 0 0 1px rgba(0,192,255,0) inset"
  , "0 0 4px 0 rgba(0,192,255,0)"
  , "0 0 4px 0 rgba(0,192,255,0) inset"
  ]
  |> String.join ","

focusedBoxShadows : String
focusedBoxShadows =
  [ "0 0 0 1px rgba(0,192,255,1) inset"
  , "0 0 4px 0 rgba(0,192,255,.5)"
  , "0 0 4px 0 rgba(0,192,255,.5) inset"
  ]
  |> String.join ","

wrapper : List (Html msg) -> Html msg
wrapper =
  node "div" []
    [ style
      [ ( "--font-family", fontFamilyStack )

      , ( "--border-radius", "2px" )
      , ( "--border-color", "#DDD" )

      , ( "--styles-input-background", "#FDFDFD")
      , ( "--styles-input-text", "#606060")

      , ( "--focused-idle-transition", "box-shadow 400ms linear" )
      , ( "--focused-idle-box-shadow", focusedIdleBoxShadows )

      , ( "--focused-transition", "box-shadow 200ms linear" )
      , ( "--focused-box-shadow", focusedBoxShadows )
      ]
    ]
