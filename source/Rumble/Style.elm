module Rumble.Style exposing (..)

{-| Functions for styling an element.

# Types
@docs Style, Selector, Rule

# Functions
@docs style, selector, selectors, pseudo
-}

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


{-| Returns a rule for a child selector.
-}
selector : String -> Style -> Rule
selector selector data =
  Rule (Child selector) data


{-| Returns a rule for multiple child selectors using the same data.
-}
selectors : List String -> Style -> Rule
selectors selectors data =
  Rule (Children selectors) data


{-| Returns a rule for a pseudo selector.
-}
pseudo : String -> Style -> Rule
pseudo selector data =
  Rule (Pseudo selector) data


{-| Returns a rule containing the styles for an element.
-}
style : Style -> Rule
style data =
  Rule Self data
