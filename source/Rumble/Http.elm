module Rumble.Http exposing (..)

{-| Make Http requests.

# Types
@docs Request

# Building requests
@docs Request, get, onLoad

# Handling progress
@docs Progress, onProgress

# Building request bodies
@docs Body, stringBody, emptyBody

# Process
@docs toProcess
-}

import Rumble.Process exposing (Process)
import Json.Encode as Json
import Native.Http

{-| Represents a request:
  * method - The request method (GET, POST, PUT, etc.)
  * headers - The request headers
  * body - The request body
  * url - The request url
  * withCredentials - Whether or not to send credentials, more info
    [here](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)

  * onUploadProgress - The message to call for upload progress events
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
  , onLoad : Maybe (String -> msg)
  }


{-| Represents a request body.
-}
type Body
  = StringBody String
  -- | FormData FormData TODO: Formdata
  | JsonBody Json.Value
  | EmptyBody


{-| Represents an upload or download progress.
  * Initial -
    The request doesn't started yet.
  * Loaded -
    The request has indeterminate length, the parameter is the loaded bytes
  * LoadedWithTotal -
    The parameters are the loaded bytes and total bytes
-}
type Progress
  = Initial
  | LoadedWithTotal Int Int
  | Loaded Int


{-| Converts a request for sending.
-}
toProcess : Request msg -> Process msg
toProcess request =
  Native.Http.send request


{-| Returns an empty body.
-}
emptyBody : Body
emptyBody =
  EmptyBody


{-| Returns a string body.
-}
stringBody : String -> Body
stringBody =
  StringBody


{-| Sets the onLoad event listener of the request.
-}
onLoad : (String -> msg) -> Request msg -> Request msg
onLoad handler request =
  { request | onLoad = Just handler }


{-| Sets the onProgress event listener of the request.
-}
onProgress : (Progress -> msg) -> Request msg -> Request msg
onProgress handler request =
  { request | onProgress = Just handler }


{-| Builds a get request for the given url.
-}
get : String -> Request msg
get url =
  { withCredentials = False
  , body = EmptyBody
  , method = "GET"
  , headers = []
  , url = url

  , onUploadProgress = Nothing
  , onProgress = Nothing
  , onLoad = Nothing
  }
