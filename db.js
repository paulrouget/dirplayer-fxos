var musicdb;

(function() {
  window.addEventListener('localized', function onlocalized() {
    if (!musicdb)
      init();
  });

  function init() {
    musicdb = new MediaDB('music', null, {},
      batchSize: 1,
      autoscan: false,
      version: 1
    });

    musicdb.onunavailable = function(event) {
      var why = event.detail;
      if (why === MediaDB.NOCARD)
        ui.showOverlay('no card');
      else if (why === MediaDB.UNMOUNTED)
        ui.showOverlay('cable plugged in');
      playerView.stop();
    }

    musicdb.onready = function() {
      ui.showOverlay(null);
      ui.updateView();
      musicdb.scan();
    };

    musicdb.onscanstart = function() {
      ui.showScanning();
    }

    musicdb.onscanend = function() {
      ui.showScanned();
      ui.updateView();
    };
  }
})();
