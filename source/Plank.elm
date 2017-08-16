module Plank exposing (..)

import Native.Uid
import Native.Inferno
import Native.InfernoCreateElement
import Native.Program
import Native.Html

import Json.Decode as Json
import Promise exposing (Promise)

-- Hidden things
type X = X

type alias Update model msg parentMsg = (model, List (Promise msg), List (Promise parentMsg))

type Attribute msg
  = Property String String
  | Attribute String String
  | Event String (Json.Value -> msg)

type Html msg
  = T String
  | E (Element msg)
  | C X

type alias Component a b c =
  { update : b -> a -> Update a b c
  , view : a -> Html b
  , model : a
  }

type alias Element msg =
  { tag : String
  , styles : List (String, String)
  , attributes : List (Attribute msg)
  , scrollKey : Maybe String
  , contents : List (Html msg)
  }

on : String -> (Json.Value -> msg) -> Attribute msg
on event handler =
  Event event handler

text : String -> Html msg
text value =
  T value

node : String -> List (Attribute msg) -> List (Html msg) -> (Html msg)
node tag attributes contents =
  E
    { tag = tag
    , styles = []
    , attributes = attributes
    , contents = contents
    , scrollKey = Nothing
    }

mount : Component a b d -> String -> (d -> c) -> Html c
mount template id listener =
  C (Native.Html.component template id listener)

root : Component a b d -> Html c
root template =
  C (Native.Html.component template "root" "")

program : Html msg -> Program Never model msg
program =
  Native.Html.program

return : a -> (a, List (Promise b), List c)
return model =
  (model, [], [])

emit : c -> Update a b c -> Update a b c
emit msg (model, promises, emits) =
  (model, promises, (Promise.succeed msg) :: emits)

thenEmit : Promise c -> Update a b c -> Update a b c
thenEmit msg (model, promises, emits) =
  (model, promises, msg :: emits)

andThen : Promise b -> Update a b c -> Update a b c
andThen promise (model, promises, emits) =
  (model, promise :: promises, emits)
