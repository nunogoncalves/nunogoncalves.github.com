$.ticTacToe = {
  oImg: 'nought.png',
  xImg: 'cross.png',

  compass: [
    '.northwest',   '.north',   '.northeast',
    '.west',        '.center',  '.east',
    '.southwest',   '.south',   '.southeast'
  ],

  playerImages: {
    oImg: 'img/nought.png',
    xImg: 'img/cross.png'
  },

  playerNames: {
    oImg: "noughts",
    xImg: "crosses"
  },

  nextPlayer: 'oImg',

  winningCombinations: [
      ['northwest', 'north',  'northeast'],
      ['west',      'center', 'east'],
      ['southwest', 'south',  'southeast'],

      ['northwest', 'west',   'southwest'],
      ['north',     'center', 'south'],
      ['northeast', 'east',   'southeast'],

      ['northwest', 'center', 'southeast'],
      ['northeast', 'center', 'southwest']
    ],

  playedCellTemplate: null,
  gameCellTemplate: null,

  closedGames: [],

  load: function() {
    var self          = $.ticTacToe,
        cellTemplate  = $('#player_image_template').html();
        gameTemplate  = $('#inner_game_won').html();

    self.playerCellTemplate = Handlebars.compile(cellTemplate);
    self.gameCellTemplate = Handlebars.compile(gameTemplate);

    $(".inner_game td").on("click", function() { self.clickedCell($(this)) });
    // $(".inner_game td").hover(function() { self.overCell($(this)) });
  },

  restart: function() {
    var self = $.ticTacToe;
    self.nextPlayer = 'oImg';
    $.rules.numberOfPlays = 0;
    self.closedGames = [];
    $('.inner_game.td').html('')
    $('td').removeClass('playedAlready');
    $('table').removeClass('finished');
    $('table').removeClass('playHereNext');
    $('table').closest('td').removeClass('playHereNext');
    $('img').remove();

    // alert dialog
    alertify.success("Restarted");
  },

  showWinner: function() {
    alertify.alert("Player " + $.ticTacToe.playerNames[$.ticTacToe.nextPlayer]);
  },

  overCell: function($cell) {
    $('.inner_game').removeClass('canPlayHere');
    $('.inner_game.' + $cell.data('compass')).addClass('canPlayHere');
  },

  clickedCell: function($cell) {
    var self = $.ticTacToe;
    if ($.rules.canPlayInCell($cell)) {
      self.playInCell($cell);
      self.prepareNextPlay($cell);
      $.rules.numberOfPlays ++;
    }
  },

  playInCell: function($cell) {
    var self = $.ticTacToe,
        rules = $.rules;

    $cell.closest('table').closest('td').removeClass("playHereNext");
    $cell.closest('table').removeClass("playHereNext");

    var context = {
      playerName: self.playerNames[self.nextPlayer],
      playerImage: self.playerImages[self.nextPlayer]
    };

    var html    = self.playerCellTemplate(context);
    $cell.addClass("playedAlready");
    $cell.html(html);

    if (rules.finishedSubGame($cell)) {
      var $closedTable = $cell.closest('table')

      var context = { playerImage: self.playerImages[self.nextPlayer] }
      var html    = self.gameCellTemplate(context);

      $closedTable.addClass('finished');
      $closedTable.append(html);
    };

  },

  prepareNextPlay: function($cell) {
    var $nextAvailableGame,
        self = $.ticTacToe,
        rules = $.rules,
        $nextTableToPlay = $(rules.nextSubGameToPlay($cell).find('td')[0]);

    if (rules.finishedSubGame($nextTableToPlay)) {
      $nextAvailableGame = $(".inner_game:not('.finished')");
    } else {
      $nextAvailableGame = rules.nextSubGameToPlay($cell);
    }
    $('.inner_game').removeClass('playHereNext');
    $('.inner_game').closest('td').removeClass('playHereNext');
    $nextAvailableGame.removeClass('playHereNext');
    $nextAvailableGame.closest('td').removeClass('playHereNext');
    $nextAvailableGame.addClass('playHereNext');
    $nextAvailableGame.closest('td').addClass('playHereNext');
    self.nextPlayer = self.nextPlayer == 'xImg' ? 'oImg' : 'xImg';
    var context = { playerImage: self.playerImages[self.nextPlayer] }
    var html    = self.gameCellTemplate(context);
    $('#next_player').html(html);
  },
}