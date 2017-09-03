module Rumble.Update exposing (..)

{-| This module provides methods to help in updating components.

# Update
@docs Update, return

# Side Effects
@docs andThen

# Events
@docs maybeEmit, emit, thenEmit

# Commands
@docs send

# Processes
@docs process, abort
-}

import Rumble.Process as Process exposing (Process)
import Rumble.Task as Task exposing (Task)


{-| Represents an update for a component.
  - commands - Tasks that return messages for sub components
  - parentMessages - Tasks that return messages for the parent component
  - effects - Tasks that return side effects
  - model - The updated model
-}
type alias Update state msg parentMsg command =
  { parentMessages : List (Task Never parentMsg)
  , processes : List (String, Process msg)
  , commands : List (Task Never command)
  , effects : List (Task Never msg)
  , state : state
  }


{-| Builds an update from a model.
-}
return : state -> Update state msg eventMsg command
return state =
  { state = state, effects = [], parentMessages = [], commands = [], processes = [] }


{-| Emits the given event.
-}
emit
  : parentMsg
  -> Update model msg parentMsg command
  -> Update model msg parentMsg command
emit parentMsg data =
  { data | parentMessages = Task.succeed parentMsg :: data.parentMessages }


{-| Emits the given message if exists with the given value.
-}
maybeEmit
  : Maybe (a -> parentMsg)
  -> a
  -> Update state msg parentMsg command
  -> Update state msg parentMsg command
maybeEmit maybeParentMsg value data =
  case maybeParentMsg of
    Just parentMsg ->
      { data | parentMessages = Task.succeed (parentMsg value) :: data.parentMessages }

    Nothing ->
      data


{-| Runs the given task then emits the event returned by it.
-}
thenEmit
  : Task Never event
  -> Update model msg event command
  -> Update model msg event command
thenEmit task data =
  { data | parentMessages = task :: data.parentMessages }


{-| Runs the given task of a side effect.
-}
andThen
  : Task Never msg
  -> Update model msg event command
  -> Update model msg event command
andThen effect data =
  { data | effects = effect :: data.effects }


{-| Runs the given task of a command.
-}
send
  : command
  -> Update model msg event command
  -> Update model msg event command
send command data =
  { data | commands = Task.succeed command :: data.commands }


{-| Starts the given process with the given ID.
-}
process
  : String
  -> Process msg
  -> Update model msg event command
  -> Update model msg event command
process id process data =
  { data | processes = (id, process) :: data.processes }


{-| Aborts the process with the given ID.
-}
abort
  : String
  -> Update model msg event command
  -> Update model msg event command
abort id data =
  { data | processes = (id, Process.abort) :: data.processes }
