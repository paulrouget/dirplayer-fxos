var musicdb;

(function() {
  window.addEventListener('load', function onlocalized() {
    if (!musicdb)
      init();
  });

  function init() {
    musicdb = {
      enumerateAll: function(a, b, v, cb) {
        var flat = [];
        for (var i = 0; i < mixes.length; i++) {
          var mix = JSON.parse(mixes[i]);
          for (var t in mix._PAUL_tracks) {
            var song = mix._PAUL_tracks[t];
            flat.push({
              name: mix.path + "/" + song.uid + ".m4a",
              url: song.track_file_stream_url,
              cover: mix.cover_urls.sq250,
            });
          }
        }
        cb(flat);
      }
    }
    ui.showOverlay(null);
    ui.updateView();
  }

  function _init() {
    musicdb = new MediaDB('music', null, {
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
