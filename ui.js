var computedMixes = {};
function sortInMixes(song) {
  var split = song.name.match(/(.*)\/(.*)/);
  var directory = split[1];
  var fileName = split[2];
  if (!directory || !fileName) {
    return;
  }

  if (!(directory in computedMixes)) {
    computedMixes[directory] = {
      cover: song.cover,
      tracks: [],
    };
  }
  computedMixes[directory].tracks.push(song);
}

var template = document.querySelector("#template");
var ui = {
  showOverlay: function(message) {
    if (message)
      window.alert(message);
  },
  showScanning: function() {},
  showScanned: function() {},
  updateView: function() {
    musicdb.enumerateAll(null, null, 'nextunique',
      function(songs) {
        console.log("Found " + songs.length + " songs");
        songs.forEach(sortInMixes);
        var ul = document.querySelector("ul");
        ul.innerHTML = "";
        for (var mixName in computedMixes) {
          (function(mix) {
            var row = template.cloneNode(true);
            row.removeAttribute("id");
            row.querySelector("img").src = mix.cover;
            row.querySelector("h2").textContent = mixName;
            row.querySelector(".count").textContent = mix.tracks.length;
            row.onclick = function() {
              ui.selectMix(mix, row);
            }
            ul.appendChild(row);
          })(computedMixes[mixName]);
        }
      });
  },
  selectMix: function(mix, row) {
    var playing = document.querySelector(".playing");
    if (playing) {
      if (playing === row)
        return;
      else
        playing.classList.remove("playing");
    }
    row.classList.add("playing");
  },
}


// Install app
if (navigator.mozApps) {
  var checkIfInstalled = navigator.mozApps.getSelf();
  checkIfInstalled.onsuccess = function () {
    if (checkIfInstalled.result) {
      // Already installed
    } else {
      var install = document.querySelector("#install"),
      manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
/*
To install a package instead, exchange the above line to this:
manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/package.manifest";
*/
      install.className = "show-install";
      install.onclick = function () {
        var installApp = navigator.mozApps.install(manifestURL);
/*
To install a package instead, exchange the above line to this:
var installApp = navigator.mozApps.installPackage(manifestURL);
*/
        installApp.onsuccess = function(data) {
          install.style.display = "none";
        };
        installApp.onerror = function() {
          alert("Install failed\n\n:" + installApp.error.name);
        };
      };
    }
  };
} else {
  console.log("Open Web Apps not supported");
}
