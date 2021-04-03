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

    winningElements: [
      ['northwest_center', 'northeast_center'],
      ['west_center', 'east_center'],
      ['southwest_center', 'southeast_center'],

      ['northwest_center', 'southwest_center'],
      ['north_center',     'south_center'],
      ['northeast_center', 'southeast_center'],

      ['northwest_center', 'southeast_center'],
      ['northeast_center', 'southwest_center']
    ],

    allCells: 
    [
      [
          "northwest_northwest",
          "northwest_north",
          "northwest_northeast",
          "northwest_west",
          "northwest_center",
          "northwest_east",
          "northwest_southwest",
          "northwest_south",
          "northwest_southeast",
      ],
      [
          "north_northwest",
          "north_north",
          "north_northeast",
          "north_west",
          "north_center",
          "north_east",
          "north_southwest",
          "north_south",
          "north_southeast",
      ],
      [
          "northeast_northwest",
          "northeast_north",
          "northeast_northeast",
          "northeast_west",
          "northeast_center",
          "northeast_east",
          "northeast_southwest",
          "northeast_south",
          "northeast_southeast",
      ],
      [
          "west_northwest",
          "west_north",
          "west_northeast",
          "west_west",
          "west_center",
          "west_east",
          "west_southwest",
          "west_south",
          "west_southeast",
      ],
      [
          "center_northwest",
          "center_north",
          "center_northeast",
          "center_west",
          "center_center",
          "center_east",
          "center_southwest",
          "center_south",
          "center_southeast",
      ],
      [
          "east_northwest",
          "east_north",
          "center_northeast",
          "center_west",
          "east_center",
          "east_east",
          "east_southwest",
          "east_south",
          "east_southeast",
      ],
      [
          "southwest_northwest",
          "southwest_north",
          "southwest_northeast",
          "southwest_west",
          "southwest_center",
          "southwest_east",
          "southwest_southwest",
          "southwest_south",
          "southwest_southeast",
      ],
      [
          "south_northwest",
          "south_north",
          "south_northeast",
          "south_west",
          "south_center",
          "south_east",
          "south_southwest",
          "south_south",
          "south_southeast",
      ],
      [
          "southeast_northwest",
          "southeast_north",
          "southeast_northeast",
          "southeast_west",
          "southeast_center",
          "southeast_east",
          "southeast_southwest",
          "southeast_south",
          "southeast_southeast"
      ]
  ],

  playedCellTemplate: null,
  gameCellTemplate: null,

  closedGames: [],
  closedGamesWinners: [
    "", "", "", 
    "", "", "", 
    "", "", ""
  ],

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

  debugClickInCell: function(outer, inner) {
    this.clickedCell($("#" + $.ticTacToe.allCells[outer][inner]))
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

    var html = self.playerCellTemplate(context);
    $cell.addClass("playedAlready");
    $cell.html(html);

    if (rules.finishedSubGame($cell)) {
      var $closedTable = $cell.closest('table')


      $closedTable.addClass('finished');
      var html = self.gameCellTemplate(context);
      $closedTable.append(html);

      var classes = $closedTable[0].className.split(" ")
      let positions = [
        'northwest', 'north',  'northeast',
        'west',      'center', 'east',
        'southwest', 'south',  'southeast'
      ]
      var closedGamesWinners = this.closedGamesWinners
      for(i=0;i<=positions.length -1;i++) {
        if (classes.includes(positions[i]) && closedGamesWinners[i] == "") {
          closedGamesWinners[i] = context.playerName
        }
      }
      // return
      // I know I know... just wanted to see this working!
      var width = 20

      // Horizontal
      if (closedGamesWinners[0] == closedGamesWinners[1] && closedGamesWinners[1] == closedGamesWinners[2]) {
        if (closedGamesWinners[0] != "") {
          var color = closedGamesWinners[0] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[0], color, width)
          return
        }
      }
      if (closedGamesWinners[3] == closedGamesWinners[4] && closedGamesWinners[4] == closedGamesWinners[5]) {
        if (closedGamesWinners[3] != "") {
          var color = closedGamesWinners[3] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[1], color, width)
          return
        }
      }
      if (closedGamesWinners[6] == closedGamesWinners[7] && closedGamesWinners[7] == closedGamesWinners[8]) {
        if (closedGamesWinners[6] != "") {
          var color = closedGamesWinners[6] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[2], color, width)
          return
        }
      }

      // Vertical
      if (closedGamesWinners[0] == closedGamesWinners[3] && closedGamesWinners[3] == closedGamesWinners[6]) {
        if (closedGamesWinners[0] != "") {
          var color = closedGamesWinners[0] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[3], color, width)
          return
        }
      }
      if (closedGamesWinners[1] == closedGamesWinners[4] && closedGamesWinners[4] == closedGamesWinners[7]) {
        if (closedGamesWinners[1] != "") {
          var color = closedGamesWinners[1] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[4], color, width)
          return
        }
      }
      if (closedGamesWinners[2] == closedGamesWinners[5] && closedGamesWinners[5] == closedGamesWinners[8]) {
        if (closedGamesWinners[2] != "") {
          var color = closedGamesWinners[2] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[5], color, width)
          return
        }
      }
      
      // Diagonals
      if (closedGamesWinners[0] == closedGamesWinners[4] && closedGamesWinners[4] == closedGamesWinners[8]) {
        if (closedGamesWinners[0] != "") {
          var color = closedGamesWinners[0] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[6], color, width)
          return
        }
      }
      if (closedGamesWinners[2] == closedGamesWinners[4] && closedGamesWinners[4] == closedGamesWinners[6]) {
        if (closedGamesWinners[2] != "") {
          var color = closedGamesWinners[2] == "noughts" ? "#B12716" : "#007EFF" 
          this.connect_winning_element(this.winningElements[7], color, width)
          return
        }
      }
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

  connect_winning_element: function(winner_element, color, thickness) {
    $("#overlay").css("z-index", 10)
    this.connect(winner_element[0], winner_element[1], color, thickness)
  },

  connect: function(div1, div2, color, thickness) {
    var off1 = this.getOffset(document.getElementById(div1));
    var off2 = this.getOffset(document.getElementById(div2));

    var x1 = off1.left + off1.width / 2;
    var y1 = off1.top + off1.height / 2;

    var x2 = off2.left + off2.width / 2;
    var y2 = off2.top + off2.height / 2;

    // distance
    var length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
    // center
    var cx = ((x1 + x2) / 2) - (length / 2);
    var cy = ((y1 + y2) / 2) - (thickness / 2);
    // angle
    var angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
    // make hr
    var htmlLine = "<div style='padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; -moz-transform:rotate(" + angle + "deg); -webkit-transform:rotate(" + angle + "deg); -o-transform:rotate(" + angle + "deg); -ms-transform:rotate(" + angle + "deg); transform:rotate(" + angle + "deg);' />";
    //
    document.getElementById("overlay").innerHTML = htmlLine; 
  },

  getOffset: function( el ) {
    var rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.pageXOffset,
        top: rect.top + window.pageYOffset,
        width: rect.width || el.offsetWidth,
        height: rect.height || el.offsetHeight,
        center: rect.center
    };
  }
}

function debugPlaySteps() {
  var game = $.ticTacToe

  // Ball in center
  game.debugClickInCell(4,3)
  game.debugClickInCell(3,4)

  game.debugClickInCell(4,5)
  game.debugClickInCell(5,4)

  game.debugClickInCell(4,4)

  game.debugClickInCell(0,0)
  game.debugClickInCell(0,2)

  game.debugClickInCell(2,0)
  game.debugClickInCell(0,4)

  game.debugClickInCell(7,0)
  game.debugClickInCell(0,6)

  game.debugClickInCell(6,8)  
  game.debugClickInCell(8,7)

  game.debugClickInCell(7,8)
  game.debugClickInCell(8,4)

  game.debugClickInCell(8,8)
  game.debugClickInCell(8,1)
}