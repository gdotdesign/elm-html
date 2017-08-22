module Rumble.Http exposing (..)

{-| Make Http requests.
-}
import Rumble.Task as Task exposing (Task)
import Json.Encode as Json
import Native.Http


{-| Represents a request:
  * method - The request method (GET, POST, PUT, etc.)
  * headers - The requst headers
  * url - The request url
  * withCredentials - Whether or not to send credentials, more info
    [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
  * body - The request body
  * onProgress - The message to call progress events
  * onFinish - The message to call when the request have finished
-}
type alias Request msg =
  { headers : List (String, String)
  , withCredentials : Bool
  , method : String
  , url : String

  , body : Body

  , onUploadProgress : Maybe (Progress -> msg)
  , onProgress : Maybe (Progress -> msg)
  , onFinish : String -> msg
  }


{-| Represents a request body.
-}
type Body
  = StringBody String
  -- | FormData FormData
  | JsonBody Json.Value
  | EmptyBody


{-| Represents an upload or download progress.
  * transferredBytes - The amount of bytes that have been downloaded or uploaded
  * totalBytes - The amount of bytes of the whole progress
-}
type alias Progress =
  { transferredBytes : Int
  , totalBytes: Int
  }


{-| Sends a request.
-}
send : Request msg -> Task Never msg
send request =
  Native.Http.send request


{-| Returns an empty body.
-}
emptyBody : Body
emptyBody =
  EmptyBody


stringBody : String -> Body
stringBody =
  StringBody
