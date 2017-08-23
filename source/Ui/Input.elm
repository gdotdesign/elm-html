module Ui.Input exposing (..)

{-| Component for single line text based input (wrapper for the input HTML tag).

# Model
@docs Model, Msg, init, update

# DSL
@docs placeholder, showClearIcon, kind

# Events
@docs Event

# View
@docs view, render

# Functions
@docs setValue
-}

import Rumble.Html exposing (Component, Html, node, text, on, attribute, property)
import Rumble.Update exposing (Update, return, emit)

import Json.Decode as Json

--import Ui.Icons
--import Ui

--import Ui.Styles.Input exposing (defaultStyle)
--import Ui.Styles

{-| Represents an input.
-}
type alias Model =
  { value : String
  }


{-| Properties for an input.
  - **placeholder** - The text to display when there is no value
  - **showClearIcon** - Whether or not to show the clear icon
  - **disabled** - Whether or not the input is disabled
  - **readonly** - Whether or not the input is readonly
  - **kind** - The type of the input
-}
type alias Properties =
  { placeholder : String
  , showClearIcon : Bool
  , value : Maybe String
  , disabled : Bool
  , readonly : Bool
  , kind : String
  }


{-| Messages that an input can receive.
-}
type Msg
  = Input String
  | Clear


type Event
  = Changed String
  | Cleared

{-| Initializes an input.
-}
init : Model
init =
  { value = ""
  }


{-| Default properties for an input.
-}
defaultProps : Properties
defaultProps =
  { showClearIcon = False
  , placeholder = ""
  , disabled = False
  , readonly = False
  , kind = "text"
  , value = Nothing
  }


{-| Updates an input.
-}
update : Msg -> Model -> Update Model Msg Event
update msg model =
  case msg of
    Input value ->
      return { model | value = value }
        |> emit (Changed value)

    Clear ->
      return { model | value = "" }
        |> emit Cleared


{-| Renders an input.
-}
view : Properties -> Model -> Html Msg
view properties model =
  let
    value =
      Maybe.withDefault model.value properties.value

    showClearIcon =
      not (not properties.showClearIcon
           || properties.disabled
           || properties.readonly
           || value == "")

    clearIcon =
      if showClearIcon then
        node "span" [ on "click" (\_ -> Clear)] [] [ text "clear" ]
      else
        text ""
  in
    node
      "ui-input"
      []
      []
      [ node
          "input"
          [ attribute "placeholder" properties.placeholder
          --, attribute "readonly" properties.readonly
          --, attribute "disabled" properties.disabled
          , attribute "type" properties.kind
          , attribute "spellcheck" "false"

          , property "value" value
          , on "input" (\value ->
              case Json.decodeValue (Json.at ["target", "value"] Json.string) value of
                Ok value -> Input value
                Err _ -> Input ""
            )
          ]
          []
          []
      , clearIcon
      ]

component : Properties -> Component Model Msg Event
component properties =
  { view = view properties
  , update = update
  , model = init
  }
