module Rumble.Html.Attributes exposing (..)

import Rumble.Html exposing (Attribute, attribute, boolAttribute, property)

{-| Provides a hint to the user of what can be entered into an
    editable element.
-}
placeholder : String -> Attribute msg
placeholder value =
  attribute "placeholder" value


{-| Indicates whether an element can be edited.
-}
readonly : Bool -> Attribute msg
readonly value =
  boolAttribute "readOnly" value


{-| Indicates whether an element is disabled.
-}
disabled : Bool -> Attribute msg
disabled value =
  boolAttribute "disabled" value


{-| Indicates the type of an input element.
-}
type_ : String -> Attribute msg
type_ value =
  attribute "type" value


{-| Defines the default value of an element.
-}
value : String -> Attribute msg
value value =
  attribute "value" value


{-| Indicates whether spell checking is allowed for the element.
-}
spellcheck : Bool -> Attribute msg
spellcheck value =
  if value then
    attribute "spellcheck" "true"
  else
    attribute "spellcheck" "false"
