module Rumble.Process exposing (..)

import Native.Process

type Process a = Process a

abort : Process msg
abort =
  Native.Process.abort
