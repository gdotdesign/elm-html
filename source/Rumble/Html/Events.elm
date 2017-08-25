module Rumble.Html.Events exposing (..)

{-| Commonly used events, and decoders for elements.

# Events
@docs onClick, onInput

# Decoders
@docs decodeTargetValue

# Event Options
@docs defaultOptions
-}

import Rumble.Html exposing (EventOptions, Attribute, on)
import Json.Decode as Json

{-| Default event options.
-}
defaultOptions : EventOptions
defaultOptions =
  EventOptions False False False


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
  on "click" (always (Just msg, defaultOptions))


{-| Captures input events.
-}
onInput : (String -> msg) -> Attribute msg
onInput msg =
  let
    function =
      decodeTargetValue
      >> Maybe.map msg
      >> (flip (,) defaultOptions)
  in
    on "input" function
