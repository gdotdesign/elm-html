module Ui.Theme exposing (..)

{-| The default theme wrapper for the styles.

# Wrapper
@docs wrapper

# Utility function
@docs fontFamilyStack, focusedIdleBoxShadows, focusedBoxShadows

# Mixins
@docs defaults
-}

import Rumble exposing (..)

{-| The font family stack.
-}
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


{-| Idle box shadows.
-}
focusedIdleBoxShadows : String
focusedIdleBoxShadows =
  [ "0 0 0 1px rgba(0,192,255,0) inset"
  , "0 0 4px 0 rgba(0,192,255,0)"
  , "0 0 4px 0 rgba(0,192,255,0) inset"
  ]
  |> String.join ","


{-| Focused box shadows.
-}
focusedBoxShadows : String
focusedBoxShadows =
  [ "0 0 0 1px rgba(0,192,255,1) inset"
  , "0 0 4px 0 rgba(0,192,255,.5)"
  , "0 0 4px 0 rgba(0,192,255,.5) inset"
  ]
  |> String.join ","


{-| The default css for an element.
-}
defaults : Rule
defaults =
  style
    [ ( "-webkit-tap-highlight-color", "rgba(0,0,0,0)" )
    , ( "-webkit-touch-callout", "none" )
    , ( "box-sizing", "border-box" )
    ]


{-| Wrapper element that contains the styles.
-}
wrapper : List (Html msg parentMsg) -> Html msg parentMsg
wrapper =
  node "div" []
    [ style
      [ ( "--font-family", fontFamilyStack )

      , ( "--border-radius", "2px" )
      , ( "--border-color", "#DDD" )

      , ( "--styles-input-background", "#FDFDFD")
      , ( "--styles-input-text", "#606060")

      , ( "--styles-focus-color", "#00C0FF" )

      , ( "--focused-idle-transition", "box-shadow 400ms linear" )
      , ( "--focused-idle-box-shadow", focusedIdleBoxShadows )

      , ( "--focused-transition", "box-shadow 200ms linear" )
      , ( "--focused-box-shadow", focusedBoxShadows )
      ]
    ]
