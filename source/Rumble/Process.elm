module Rumble.Process exposing (Process, abort)

{-| Processes.

@docs Process, abort
-}
import Native.Process

{-| Represents a process.
-}
type Process a = Process a


{-| A process to abort a process.
-}
abort : Process msg
abort =
  Native.Process.abort
