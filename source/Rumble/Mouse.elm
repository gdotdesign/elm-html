module Rumble.Mouse exposing (..)

import Rumble.Subscription exposing (Subscription)
import Native.Mouse

type alias Position =
  { top : Int
  , left : Int
  }

moves : (Position -> msg) -> Subscription msg
moves msg =
  Native.Mouse.moves msg
