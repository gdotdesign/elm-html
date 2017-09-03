module Rumble.Html.Attributes exposing (..)

{-| Commonly used Html attributes.

@docs placeholder, readonly, disabled, type_, value, spellcheck
-}

import Rumble exposing (Attribute(..))

{-| Provides a hint to the user of what can be entered into an
    editable element.
-}
placeholder : String -> Attribute msg
placeholder value =
  Attribute "placeholder" value


{-| Indicates whether an element can be edited.
-}
readonly : Bool -> Attribute msg
readonly value =
  BoolAttribute "readOnly" value


{-| Indicates whether an element is disabled.
-}
disabled : Bool -> Attribute msg
disabled value =
  BoolAttribute "disabled" value


{-| Indicates the type of an input element.
-}
type_ : String -> Attribute msg
type_ value =
  Attribute "type" value


{-| Defines the default value of an element.
-}
value : String -> Attribute msg
value value =
  Attribute "value" value


{-| Indicates whether spell checking is allowed for the element.
-}
spellcheck : Bool -> Attribute msg
spellcheck value =
  if value then
    Attribute "spellcheck" "true"
  else
    Attribute "spellcheck" "false"
