module Rumble.Navigation exposing (..)

import Rumble exposing (Subscription)
import Rumble.Task exposing (Task)
import Native.Navigation

type alias Location =
  { protocol : String
  , host : String
  , hostname : String
  , port_ : Int
  , pathname : String
  , search : String
  , hash : String
  }

location : () -> Location
location () =
  Native.Navigation.location ()

changes : (Location -> msg) -> Subscription msg
changes msg =
  Native.Navigation.changes msg

navigate : String -> Task Never msg
navigate path =
  Native.Navigation.navigate path
