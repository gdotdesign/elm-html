module Rumble.Task exposing (Task, succeed, delay, chain, map)

{-| Handle results of a computation.

@docs Task, delay, succeed, map, chain
-}

import Native.Vendor.Fluture
import Native.Task


{-| Representation of the result of a computation.
-}
type Task error value = Task error value


{-| Task that resolves the given value after the given delay.
-}
delay : Int -> value -> Task Never value
delay delay value =
  Native.Task.timeout delay value


{-| Task that resolve the value immediately.
-}
succeed : value -> Task Never value
succeed value =
  Native.Task.succeed value


{-| Synchronously transform the result of a task.
-}
map : (value -> newValue) -> Task error value -> Task error newValue
map function task =
  Native.Task.map function task


{-| Asynchronously transform the result of a task.
-}
chain : (value -> Task error newValue) -> Task error value -> Task error newValue
chain function task =
  Native.Task.chain function task
