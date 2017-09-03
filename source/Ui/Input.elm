module Ui.Input exposing
  (Model, Msg(SetValue, Clear), Event(..), init, component)

{-| Component for single line text based input (wrapper for the input HTML tag).

# Component
@docs Model, init, component

# Events
@docs Event

# API
@docs Msg
-}

import Rumble.Html exposing (Component, Html, node, text)
import Rumble.Html.Events exposing (onInput, onClick)
import Rumble.Update exposing (Update, return, emit)
import Rumble.Style exposing (..)
import Rumble.Html.Attributes exposing
  (placeholder, disabled, readonly, value, type_ , spellcheck)

--import Ui.Icons
import Ui.Theme exposing (defaults)

{-| Represents an input.
  - **placeholder** - The text to display when there is no value
  - **showClearIcon** - Whether or not to show the clear icon
  - **disabled** - Whether or not the input is disabled
  - **readonly** - Whether or not the input is readonly
  - **value** - The value of the input
  - **kind** - The type of the input
-}
type alias Model =
  { placeholder : String
  , showClearIcon : Bool
  , readonly : Bool
  , disabled : Bool
  , value : String
  , value : String
  , kind : String
  }


{-| Messages that used to update an input.
-}
type Msg
  = SetValue String
  | Clear


{-| Events that an input can make.
-}
type Event
  = Changed String
  | Cleared


{-| Initializes an input.
-}
init : Model
init =
  { showClearIcon = False
  , placeholder = ""
  , disabled = False
  , readonly = False
  , kind = "text"
  , value = ""
  }


{-| Updates an input.
-}
update : Msg -> Model -> Update Model Msg Event command
update msg model =
  case msg of
    SetValue value ->
      if value /= model.value then
        return { model | value = value }
          |> emit (Changed value)
      else
        return model

    Clear ->
      if model.value /= "" then
        return { model | value = "" }
          |> emit Cleared
      else
        return model


{-| Renders an input.
-}
view : Model -> Html Msg parentMsg
view model =
  let
    showClearIcon =
      not (not model.showClearIcon
           || model.disabled
           || model.readonly
           || model.value == "")

    clearIcon =
      if showClearIcon then
        node "span"
          [ onClick Clear ]
          []
          [ text "clear" ]
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
          [ placeholder model.placeholder
          , readonly model.readonly
          , disabled model.disabled
          , value model.value
          , type_ model.kind
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
component : Component Model Msg Event command parentMsg
component =
  { subscriptions = \_ -> []
  , update = update
  , model = init
  , view = view
  }
