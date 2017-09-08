module Ui.Pager exposing
  (Msg(Set), Props, component)

import Json.Decode as Json
import Rumble exposing (..)

type Msg
  = Active Int
  | Set Int
  | End

type alias State =
  { center : List Int
  , left : List Int
  , page : Int
  }

type alias Props msg parentMsg =
  { pages : List (Html msg parentMsg)
  , initialPage : Int
  , onChange : Maybe (Int -> msg)
  }


initialState : State
initialState =
  { center = []
  , left = []
  , page = -1
  }


defaultProps : Props msg parentMsg
defaultProps =
  { initialPage = 0
  , pages = []
  , onChange = Nothing
  }

update : Msg -> Props msg parentMsg -> State -> Update State Msg components msg
update msg props state =
  let
    currentPage =
      if state.page == -1 then
        props.initialPage
      else
        state.page
  in
    case msg of
      Set page ->
        if List.isEmpty state.center
        && List.isEmpty state.left
        && state.page /= page
        then
          return { state | left = [ state.page ], center = [ page ] }
        else
          return state

      End ->
        return { state | left = [] }

      Active page ->
        return { state | center = [], page = page }
          |> emitMaybe props.onChange page


view : Props msg parentMsg -> State -> Html Msg msg
view props state =
  let
    currentPage =
      if state.page == -1 then
        props.initialPage
      else
        state.page

    renderPage index page =
      let
        decoder msg value =
          case Json.decodeValue (Json.at [ "target", "_page" ] Json.string) value of
            Ok _ -> ( Just (Json.succeed msg), { stopPropagation = False, stopImmediatePropagation = False, preventDefault = False} )
            Err _ -> ( Nothing, { stopPropagation = False, stopImmediatePropagation = False, preventDefault = False} )

        (attributes, styles) =
          if List.member index state.left then
            ( [] -- [ on "trasnistionend" (decoder End) ]
            , style [ ( "left", "-100%" ) ]
            )
          else if List.member index state.center then
            ( [] -- [ on "trasnistionend" (decoder (Active index)) ]
            , style [ ( "left", "0%" ) ]
            )
          else if index == currentPage then
            ( [], style [ ( "left", "0%" ) ]
            )
          else
            ( []
            , style
              [ ( "visibility", "hidden" )
              , ( "left", "100%" )
              ]
            )
      in
        node "ui-page"
          (Property "_page" (toString index) :: attributes)
          [ styles ]
          [ embed page ]
  in
    node "ui-pager" [] []
      (List.indexedMap renderPage props.pages)


{-| The input component.
-}
component : Component (Props msg parentMsg) State Msg command msg
component =
  { initialState = initialState
  , defaultProps = defaultProps
  , subscriptions = \_ _ -> []
  , update = update
  , view = view
  }
