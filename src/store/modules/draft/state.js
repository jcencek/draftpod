
import { PICKS, DECK } from './constants'


// - move start_time and options into table
// - have a player_index outside of table
// - track which of the players is a bot via a list of indexes inside the table
// - sync the table to firestore
// - players pass their pack into a zone explicitly (bots do it automatically, 
//   but who polks the bot, perhaps the player that passed to them?)
//      - for this would need to introduce a passing zone
// - how to implement pick timer? (perhaps the host forces picks?). or perhaps
//    there is a scheduled server-side function? maybe all clients can 
//    be responsible for noticing the pick_timer and forcing the picks
//    via a call to a firebase function
// 

export default function() {
  return {

    // start time
    start_time: new Date().getTime(), 

    // options
    options: {
      set_code: null,
      set_name: null,
      pick_timer: false,
      pick_ratings: false,
    },

    // table
    table: {
      all_packs: [],
      current_pack: 0,
      current_pick: 0,
      picks_complete: false,
      picks: playerPicks(),
      deck: playerDeck(),
      players: [...Array(7)].map(function() {
        return {
          picks: playerPicks(),
          deck: playerDeck(),
        }
      }),
    },
  }
}

function playerPicks() {
  return {
    pack: [],
    // piles for cards + 1 pile for sideboard
    piles: [...Array(PICKS.PILES+1)].map(() => Array()),
  }
}

function playerDeck() {
  return {
    // piles for cards + 1 pile each for lands/sideboard
    piles: [...Array(DECK.PILES+2)].map(() => Array()),
    lands: {
      basic: {
        R: 0,
        W: 0,
        U: 0,
        B: 0,
        G: 0
      },
      auto: true,
      color_order: null
    }
  }
}