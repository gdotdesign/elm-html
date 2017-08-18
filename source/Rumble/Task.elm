module Rumble.Task exposing (..)

import Native.FunTask
import Native.Task

type Task a = Task a

type Error = Error String

delay : Int -> Task ()
delay delay =
  Native.Task.timeout delay

new : (() -> a) -> (() -> String) -> Task a
new resolve reject =
  Native.Task.new resolve reject

all : List (Task a) -> Task (List a)
all promises =
  Native.Task.all promises

succeed : value -> Task value
succeed value =
  Native.Task.succeed value

fail : String -> Task value
fail value =
  Native.Task.reject value

map : (a -> b) -> Task a -> Task b
map function promise =
  Native.Task.map function promise

andThen : (a -> Task b) -> Task a -> Task b
andThen function promise =
  Native.Task.andThen function promise

catch : (Error -> b) -> Task a -> Task b
catch function promise =
  Native.Task.catch function promise
