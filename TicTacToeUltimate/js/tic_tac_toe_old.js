$.ticTacToe = {
  oImg: 'nought.png',
  xImg: 'cross.png',

  compass: ['.northwest', '.north', '.northeast',
            '.west', '.center', '.east',
            '.southwest', '.south', '.southeast'],

  playerImages: {
    oImg: 'nought.png',
    xImg: 'cross.png'
  },

  playerNames: {
    oImg: "noughts",
    xImg: "crosses"
  },

  lastPlace: '',

  nextPlayer: 'oImg',

  numberOfPlays: 0,

  winningCombinations: [
      ['northwest', 'north', 'northeast'],
      ['west', 'center', 'east'],
      ['southwest', 'south', 'southeast'],

      ['northwest', 'west', 'southwest'],
      ['north', 'center', 'south'],
      ['northeast', 'east', 'southeast'],

      ['northwest', 'center', 'southeast'],
      ['northeast', 'center', 'southwest']
    ],

  closedGames: [],

  load: function() {
    var self = $.ticTacToe;
    $(".inner_game td").on("click", function() {
      if (self.canPlayInSquare(this)) {
        $(this).html('<img class="' + self.playerNames[self.nextPlayer] + '" src="' + self.playerImages[self.nextPlayer] + '"></img>');
        self.prepareForNextPlay(this);
        self.numberOfPlays ++;
      }
    });
  },

  canPlayInSquare: function(square) {
    if(this.numberOfPlays === 0) { return true; }
    if ($(square).find('img').length !== 0) { return false; }
    if ($($(square)).closest("table").hasClass("playHereNext")) { return true; }

    return false
  },

  prepareForNextPlay: function(clickedTd) {
    var $td = $(clickedTd);
    $(this.compass.join(",")).removeClass("playHereNext");
    if (this.smallerGameAlreadyClosed($(clickedTd).closest(".inner_game"))) {
      $(clickedTd).closest(".inner_game").removeClass("playHereNext");
    } else {
      if (this.closedGames.indexOf($td.data("compass")) !== -1) {
        $(this.compass.join(":not(.wonTable),")).addClass("playHereNext");
        $("." + $td.data("compass")).removeClass("playHereNext");
      } else {
        $("." + $td.data("compass")).addClass("playHereNext");
      }
    }
    this.nextPlayer = this.nextPlayer == 'xImg' ? 'oImg' : 'xImg';
  },

  smallerGameAlreadyClosed: function(innerGameTable) {
    if ($.ticTacToe.winnerAtSmallGame(innerGameTable)) {
      $(innerGameTable).append('<img src="' + $.ticTacToe.playerImages[$.ticTacToe.nextPlayer] + '" class="won"></img>');
      $(innerGameTable).addClass("wonTable")
      $(this.compass.join(",")).addClass("playHereNext");
      $(innerGameTable).removeClass("playHereNext");
      return true;
    } else if (this.tieAtSmallGame(innerGameTable)) {
      return true;
    } else {
      return false;
    }
  },

  winnerAtSmallGame: function(innerGameTable) {
    var winner = false;
    $.each($.ticTacToe.winningCombinations, function(i, winningCombination) {
      var count = 0
      $.each(winningCombination, function(i, cellClass) {
          a = "td[data-compass='" + cellClass + "'] img." + $.ticTacToe.playerNames[$.ticTacToe.nextPlayer]
        if ($(innerGameTable).find(a).length === 1) {
          count++
        }
      })
      if (count == 3) {
        winner = true;
        $.ticTacToe.closedGames.push($(innerGameTable).data("compass"));
        return false;
      }
    })
    return winner;
  },

  tieAtSmallGame: function(innerGameTable) {
    $(innerGameTable).find("img").length === 9
  }
}