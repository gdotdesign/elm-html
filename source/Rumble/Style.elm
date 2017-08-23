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
  | Children String
  | Pseudo String
  | Pseudos (List String)
  | Self


{-| Represents a CSS rule.
-}
type alias Rule =
  { selector : Selector
  , data : Style
  }


style : Style -> Rule
style data =
  { selector = Self
  , data = data
  }
