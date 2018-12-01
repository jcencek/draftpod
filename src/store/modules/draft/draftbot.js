
// pick a card given deck and pack
export function pick(set_code, deck, pack) {
  let ratings = cardRatings(deck, pack);
  return ratings[0].card;
}


// determine the ratings for all cards in a pack
export function cardRatings(deck, pack) {

  // determine the colors used within the deck (consider up 
  // to 3 colors before the 5th pick)
  let num_colors = deck.length <= 4 ? 3 : 2;
  let deck_colors = deckColors(deck, num_colors);

  // color bonus escalates gradually over first 15 picks
  const color_bonus_levels = [0.0, 0.0, 0.5, 0.5, 0.7, 
                              0.8, 1.0, 1.2, 1.4, 1.6,
                              1.6, 1.8, 1.8, 1.8, 2.0];

  // synergy bonus escalates as cards w/ synergy are selected
  const synergy_bonus_levels = [0.0, 0.2, 0.5, 0.5, 0.5, 
                                0.7, 0.7, 0.8, 0.9, 1.0];

  // return ratings                               
  return pack

    // transform card to card w/ rating info
    .map((card) => {

      // set baseline for ratings
      let base_rating = card.rating;
      let color_bonus = 0;
      let synergy = null;
  
      // is the card on-color?
      let on_color = false;
      let card_colors = card.colors;
      if (card_colors.length === 0) {
        on_color = true;
      } else {
        // how many of this card's colors match the deck colors?
        let matching_colors = card_colors.filter((color) =>
          deck_colors.indexOf(color) !== -1
        );
        // on color if >= 66% of colors match (that way it's still 
        // possible that we'll pick a 3-color card)
        on_color = (matching_colors.length / card_colors.length) >= 0.66;
      }
      
      // if it's on-color then apply bonus (bonus levels off after card 15)
      if (on_color) {
        color_bonus = color_bonus_levels[
          Math.min(deck.length, color_bonus_levels.length-1)
        ];
      }

      // check for synergy
      if (card.synergy) {
        
        // how many other cards in the deck share this synergy?
        let synergy_count = deck.filter((deck_card) => { 
          deck_card.synergy === card.synergy 
        }).length;

        // determine synergy bonus (escalates as more cards share the synergy)
        let synergy_bonus = synergy_bonus_levels[
          Math.min(synergy_count, synergy_bonus_levels.length-1)
        ];

        // apply the bonus if we have one
        if (synergy_bonus > 0) {
          synergy = {
            name: card.synergy,
            bonus: synergy_bonus
          }
        }
      }

      // return the card and the various components of the final adjusted rating
      return {
        card: card,
        base_rating: base_rating,
        color_bonus: color_bonus,
        synergy: synergy,
        rating: base_rating + color_bonus + (synergy ? synergy.bonus : 0)
      }
    })

    // order cards by rating
    .sort((a, b) => b.rating - a.rating);

}

// What are the colors of this deck? (multiply cards  of various colors by their
// rating and then return the top numColors)
export function deckColors(deck, numColors = 2) {

  let colorAffinity = deck.reduce((colors, card) => {
    card.colors.forEach((color) => {
      if (!colors.hasOwnProperty(color))
        colors[color] = 0;
      colors[color] += card.rating;
    });
    return colors;
  }, {});

  colorAffinity = Object.keys(colorAffinity).map((color) => {
    return {
      color: color,
      affinity: colorAffinity[color]
    }
  });

  return colorAffinity
    .sort((a,b) => b.affinity - a.affinity)
    .slice(0, numColors)
    .map((color) => color.color);   
}
