module Rumble.Http exposing (..)

import Rumble.Task as Task exposing (Task)
import Native.Http

type alias Request =
  { method : String
  , headers : List (String, String)
  , url : String
  , withCredentials : Bool
  , body : String
  }

fetch : Request -> Task String
fetch request =
  Native.Http.fetch request
