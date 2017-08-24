module Rumble.Update exposing (..)

{-| This module provides methods to help in updating components.

# Update
@docs Update, return

# Side Effects
@docs andThen

# Events
@docs emit, thenEmit

# Commands
@docs send
-}

import Rumble.Task as Task exposing (Task)


{-| Represents an update for a component.
  - commands - Tasks that return messages for sub components
  - events - Tasks that return events for the parent component
  - effects - Tasks that return side effects
  - model - The updated model
-}
type alias Update model msg event command =
  { commands : List (Task Never command)
  , events : List (Task Never event)
  , effects : List (Task Never msg)
  , model : model
  }


{-| Builds an update from a model.
-}
return : model -> Update model msg eventMsg command
return model =
  { model = model, effects = [], events = [], commands = [] }


{-| Emits the given event.
-}
emit
  : event
  -> Update model msg event command
  -> Update model msg event command
emit eventMsg data =
  { data | events = Task.succeed eventMsg :: data.events }


{-| Runs the given task then emits the event returned by it.
-}
thenEmit
  : Task Never event
  -> Update model msg event command
  -> Update model msg event command
thenEmit task data =
  { data | events = task :: data.events }


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
