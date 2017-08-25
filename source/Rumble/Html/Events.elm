module Rumble.Html.Events exposing (..)

{-| Commonly used events, and decoders for elements.

# Events
@docs onClick, onInput

# Decoders
@docs decodeTargetValue
-}

import Rumble.Html exposing (Attribute, on)
import Json.Decode as Json


{-| Decodes the value of the event target.
-}
decodeTargetValue : Json.Value -> Maybe String
decodeTargetValue value =
  let
    decoder = Json.at ["target", "value"] Json.string
  in
    value
      |> Json.decodeValue decoder
      |> Result.toMaybe


{-| Captures click events.
-}
onClick : msg -> Attribute msg
onClick msg =
  msg
    |> Just
    |> always
    |> on "click"


{-| Captures input events.
-}
onInput : (String -> msg) -> Attribute msg
onInput msg =
  on "input" (decodeTargetValue >> (Maybe.map msg))
