module Rumble.Mouse exposing (..)

{-| A module for getting the mouse position.

@docs Position, moves
-}

import Rumble exposing (Subscription)
import Native.Mouse

{-| Represents a position on the screen.
-}
type alias Position =
  { left : Int
  , top : Int
  }


{-| A subscription for the mouse position.
-}
moves : (Position -> msg) -> Subscription msg
moves msg =
  Native.Mouse.moves msg
