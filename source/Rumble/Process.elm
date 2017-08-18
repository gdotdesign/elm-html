module Rumble.Process exposing (..)

{-| Sometimes you need to cancel some long running task like an HTTP request, to
    facilitate that functionality some tasks can return a process object which
    you can use to cancel it.
-}

import Native.Process

type Process = Process

{-| Cancels the given process.
-}
cancel : Process -> Task Never
cancel =
  Native.Process.cancel
