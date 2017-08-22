module Rumble.Task exposing (..)

import Native.Fluture
import Native.Task

type Task a = Task a
type Id = Id

type Error = Error String

delay : Int -> a -> Task a
delay delay value =
  Native.Task.timeout delay value

succeed : value -> Task value
succeed value =
  Native.Task.succeed value

map : (a -> b) -> Task a -> Task b
map function task =
  Native.Task.map function task

andThen : (a -> Task b) -> Task a -> Task b
andThen function task =
  Native.Task.andThen function task
