module Rumble.Http exposing (..)

import Rumble.Task as Task exposing (Task)
import Native.Http

type alias Request msg =
  { method : String
  , headers : List (String, String)
  , url : String
  , withCredentials : Bool
  , body : String
  , onProgress : (Progress -> msg)
  , onFinish : (String -> msg)
  }

type alias Progress =
  { total: Int
  , loaded : Int
  }

fetch : Request msg -> Task msg
fetch request =
  Native.Http.fetch request
