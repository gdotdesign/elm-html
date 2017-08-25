module Rumble.Html.Events exposing
  ( onClick, onInput )

import Json.Decode as Json
import Rumble.Html exposing (Attribute, on)

decodeTargetValue : Json.Value -> Maybe String
decodeTargetValue value =
  let
    decoder = Json.at ["target", "value"] Json.string
  in
    value
      |> Json.decodeValue decoder
      |> Result.toMaybe

onClick : msg -> Attribute msg
onClick msg =
  msg
    |> Just
    |> always
    |> on "click"

onInput : (String -> msg) -> Attribute msg
onInput msg =
  on "input" (decodeTargetValue >> (Maybe.map msg))
