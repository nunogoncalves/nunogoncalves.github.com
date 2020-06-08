$.rules = {

  numberOfPlays: 0,

  canPlayInCell: function($cell) {
    var self = $.rules;
    //can play if cell is first move,
    if (self.numberOfPlays === 0) { return true; }
    //is still blank
    if (self.alreadyPlayedInThisCell($cell)) { return false; }

    //table is not closed yet
    if (self.finishedSubGame($cell) || !self.canPlayInSubGame($cell) ) { return false; }

    return true;
  },

  alreadyPlayedInThisCell: function($cell) {
    return $cell.hasClass("playedAlready");
  },

  finishedSubGame: function($cell) {
    var innerGameTable = $cell.closest('table');
    if ($.rules.winnerAtSmallGame(innerGameTable)) {
      $(innerGameTable).addClass("wonTable")
      return true;
    } else if (this.tieAtSmallGame(innerGameTable)) {
      return true;
    } else {
      return false;
    }
  },

  canPlayInSubGame: function($cell) {
    var $table = $cell.closest('table');
    if ($table.hasClass('finished')) { return true };
    return $table.closest('td').hasClass('playHereNext');
  },

  winnerAtSmallGame: function(innerGameTable) {
    if ($(innerGameTable).hasClass('finished')) {
      return true;
    }

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
  },

  nextSubGameToPlay: function($cell) {
    return $('.inner_game.' + $cell.data('compass'))
  },
}