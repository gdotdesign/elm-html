module Rumble.Shared exposing (..)

{-| Represents a style for a rule or element.
-}
type alias Style =
  List (String, String)


{-| Represents of sub selector. It can either be a normal selector like
"span", "+ span", "> button" etc... or a pseudo selector like "::before",
"::after", etc...
-}
type Rule
  = Child String
  | Children String
  | Pseudo String
  | Pseudos (List String)


{-| Represents a CSS rule.
-}
type alias Rule =
  { selector : Selector
  , data : List Style
  }
