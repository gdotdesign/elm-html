module Promise exposing (..)

import Native.Promise

type Promise a = Promise a

type Error = Error String

timeout : Int -> Promise ()
timeout delay =
  Native.Promise.timeout delay

new : (() -> a) -> (() -> String) -> Promise a
new resolve reject =
  Native.Promise.new resolve reject

all : List (Promise a) -> Promise (List a)
all promises =
  Native.Promise.all promises

succeed : value -> Promise value
succeed value =
  Native.Promise.resolve value

fail : String -> Promise value
fail value =
  Native.Promise.reject value

map : (a -> b) -> Promise a -> Promise b
map function promise =
  Native.Promise.map function promise

catch : (Error -> b) -> Promise a -> Promise b
catch function promise =
  Native.Promise.catch function promise
