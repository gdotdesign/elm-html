module Rumble.Style exposing (..)

{-| Represents a style for a rule or element.
-}
type alias Style =
  List (String, String)


{-| Represents of sub selector. It can either be a normal selector like
"span", "+ span", "> button" etc... or a pseudo selector like "::before",
"::after", etc...
-}
type Selector
  = Child String
  | Children (List String)
  | Pseudo String
  | Pseudos (List String)
  | Self


{-| Represents a CSS rule.
-}
type alias Rule =
  { selector : Selector
  , data : Style
  }

selector : String -> Style -> Rule
selector selector data =
  Rule (Child selector) data

selectors : List String -> Style -> Rule
selectors selectors data =
  Rule (Children selectors) data

pseudo : String -> Style -> Rule
pseudo selector data =
  Rule (Pseudo selector) data

style : Style -> Rule
style data =
  Rule Self data
