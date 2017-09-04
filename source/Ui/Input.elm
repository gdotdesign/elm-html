module Ui.Input exposing (Msg(SetValue, Clear), Props, component)

{-| Component for single line text based input (wrapper for the input HTML tag).

# Component
@docs component

# Props
@docs Props

# API
@docs Msg
-}

import Rumble.Html.Events exposing (onInput, onClick)
import Rumble.Html.Attributes exposing (..)
import Rumble exposing (..)

import Ui.Theme exposing (defaults)
import Ui.Icons

{-| The state:
  - **value** - The value of the input
-}
type alias State =
  { value : String
  }


{-| The props:
  - **placeholder** - The text to display when there is no value
  - **showClearIcon** - Whether or not to show the clear icon
  - **disabled** - Whether or not the input is disabled
  - **readonly** - Whether or not the input is readonly
  - **kind** - The type of the input
-}
type alias Props msg =
  { onChange : Maybe (String -> msg)
  , onClear : Maybe msg

  , value : Maybe String
  , placeholder : String
  , showClearIcon : Bool
  , readonly : Bool
  , disabled : Bool
  , kind : String
  }


{-| Messages that used to update an input.
-}
type Msg
  = SetValue String
  | Clear


{-| The initial state.
-}
initialState : State
initialState =
  { value = ""
  }


{-| Function to return props.
-}
defaultProps : Props msg
defaultProps =
  { onChange = Nothing
  , onClear = Nothing

  , showClearIcon = False
  , placeholder = ""
  , disabled = False
  , readonly = False
  , value = Nothing
  , kind = "text"
  }


{-| Updates an input.
-}
update : Msg -> Props msg -> State -> Update State Msg components msg
update msg props state =
  let
    value =
      Maybe.withDefault state.value props.value
  in
    case msg of
      SetValue newValue ->
        if value /= newValue then
          return { state | value = newValue }
            |> emitMaybe props.onChange newValue
        else
          return state

      Clear ->
        if value /= "" then
          return { state | value = "" }
            |> emitMaybe (Maybe.map always props.onClear) ()
        else
          return state


{-| Renders an input.
-}
view : Props msg -> State -> Html Msg msg
view props state =
  let
    value =
      Maybe.withDefault state.value props.value

    showClearIcon =
      not (not props.showClearIcon
           || props.disabled
           || props.readonly
           || value == "")

    clearIcon =
      if showClearIcon then
        Ui.Icons.close
          [ onClick Clear ]
          [ style
            [ ( "fill", "var(--ui-input-text, var(--styles-input-text))" )
            , ( "position", "absolute" )
            , ( "height", "12px" )
            , ( "width", "12px" )
            , ( "right", "11px" )
            , ( "top", "11px" )
            ]
          , pseudo ":hover"
            [  ( "fill", "var(--ui-input-hover, var(--styles-focus-color))" )
            ,  ( "cursor", "pointer" )
            ]
          ]
      else
        text ""
  in
    node "ui-input" []
      [ defaults
      , style
        [ ( "display", "inline-block" )
        , ( "position", "relative" )
        ]
      ]
      [ node
          "input"
          [ Rumble.Html.Attributes.value value
          , placeholder props.placeholder
          , readonly props.readonly
          , disabled props.disabled
          , type_ props.kind
          , spellcheck False
          , onInput SetValue
          ]
          [ defaults
          , style
            [ ( "background-color", "var(--ui-input-background-color, var(--styles-input-background))")
            , ( "border", "1px solid var(--ui-input-boder-color, var(--border-color))")
            , ( "border-radius", "var(--ui-input-border-radius, var(--border-radius))")
            , ( "font-family", "var(--ui-input-font-family, var(--font-family))")
            , ( "color", "var(--ui-input-text, var(--styles-input-text))" )
            , ( "-webkit-appearance", "none")
            , ( "padding", "0px 10px" )
            , ( "appearance", "none" )
            , ( "font-size", "14px" )
            , ( "height", "34px" )
            , ( "width", "100%" )

            , ( "box-shadow", "var(--ui-input-box-shadow, var(--focused-idle-box-shadow))")
            , ( "transition", "var(--ui-input-transition, var(--focused-idle-transition))")
            ]

          , pseudo ":focus"
            [ ( "box-shadow", "var(--ui-input-focus-box-shadow, var(--focused-box-shadow))")
            , ( "transition", "var(--ui-input-focus-transition, var(--focused-transition))")
            , ( "outline", "none" )
            ]

          , selector "&[disabled]"
            [ ( "border-color", "transparent" )
            ]

          , selectors
            [ "&[readonly]::-moz-selection"
            , "&[readonly]::selection"
            ]
            [ ( "background", "transparent" )
            ]
          ]
          []
      , clearIcon
      ]


{-| The input component.
-}
component : Component (Props msg) State Msg command msg
component =
  { initialState = initialState
  , defaultProps = defaultProps
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
