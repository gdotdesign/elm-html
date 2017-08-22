module Rumble.Update exposing (..)

{-| This module provides methods to help in updating components.

# Update
@docs Update, return

# Side Effects
@docs andThen

# Events
@docs emit, thenEmit
-}

import Rumble.Task as Task exposing (Task)


{-| Represents an update for a component.
-}
type alias Update model msg event =
  { events : List (Task Never event)
  , effects : List (Task Never msg)
  , model : model
  }


{-| Builds an update from a model.
-}
return : model -> Update model msg eventMsg
return model =
  { model = model, effects = [], events = [] }


{-| Emits the given event.
-}
emit : event -> Update model msg event -> Update model msg event
emit eventMsg data =
  { data | events = Task.succeed eventMsg :: data.events }


{-| Runs the given task then emits the event returned by it.
-}
thenEmit : Task Never event -> Update model msg event -> Update model msg event
thenEmit task data =
  { data | events = task :: data.events }


{-| Runs the given task of a side effect.
-}
andThen : Task Never msg -> Update model msg event -> Update model msg event
andThen effect data =
  { data | effects = effect :: data.effects }
