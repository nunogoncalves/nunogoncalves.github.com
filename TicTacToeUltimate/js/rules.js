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
          var selector = "td[data-compass='" + cellClass + "'] img." + $.ticTacToe.playerNames[$.ticTacToe.nextPlayer]
        if ($(innerGameTable).find(selector).length === 1) {
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
    return $(innerGameTable).find("td.playedAlready").length === 9;
  },

  nextSubGameToPlay: function($cell) {
    return $('.inner_game.' + $cell.data('compass'))
  },

  winner: function() {
    var winners = $.ticTacToe.closedGamesWinners;
    var winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    for (var i = 0; i < winningLines.length; i++) {
      var line = winningLines[i];
      var player = winners[line[0]];

      if (player && player === winners[line[1]] && player === winners[line[2]]) {
        return { player: player, line: i };
      }
    }

    return null;
  }
}
