document.addEventListener("DOMContentLoaded", function(e) {
  var loader = document.getElementById("loader");

  // Map infos
  var url = document.location.href;
  var params = getAllUrlParams(url);
  var markerGroup;
  var soliguideMap;
  var mapCenter;

  function updateURLParameter(url, param, paramVal) {
    console.log("updateurlparam");

    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
      tempArray = additionalURL.split("&");
      for (var i = 0; i < tempArray.length; i++) {
        if (tempArray[i].split("=")[0] != param) {
          newAdditionalURL += temp + tempArray[i];
          temp = "&";
        }
      }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
  }

  var greenIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var blueIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var redIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
  var orangeIcon = new L.Icon({
    iconUrl:
      "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var categorieList = {
    "100": "Santé",
    "101": "Addiction",
    "102": "Dépistage",
    "103": "Psychologie",
    "104": "Soins enfants",
    "105": "Généraliste",
    "106": "Dentaire",
    "107": "Suivi grossesse",
    "109": "Vaccination",
    "110": "Infirmerie",
    "111": "Vétérinaire",
    "200": "Formation et emploi",
    "201": "Atelier numérique",
    "202": "Formation français",
    "203": "Accompagnement à l'emploi",
    "204": "Pôle emploi",
    "205": "Chantier d'insertion",
    "206": "Soutien scolaire",

    "300": "Hygiène et bien-être",
    "301": "Douche",
    "302": "Laverie",
    "303": "Bien-être",
    "304": "Toilettes",

    "400": "Conseil",
    "401": "Conseil logement",
    "402": "Permanence juridique",
    "403": "Domiciliation",
    "404": "Accompagnement social",
    "405": "Ecrivain public",
    "406": "Conseil handicap",
    "407": "Conseil administratif",

    "500": "Technologie",
    "501": "Ordinateur",
    "502": "Wifi",
    "503": "Prise",
    "504": "Téléphones",
    "505": "Numérisation de documents",

    "600": "Alimentation",
    "601": "Distribution alimentaire",
    "602": "Restauration assise",
    "603": "Colis Alimentaire",
    "604": "Epicerie Sociale",
    "605": "Fontaine",

    "700": "Accueil",
    "701": "Accueil de jour",
    "702": "Hébergement d'urgence",
    "703": "Hébergement à long terme",
    "704": "Logement bas prix",
    "705": "Espaces de repos",
    "706": "Halte de nuit",
    "707": "Garde d'enfants",

    "800": "Activités",
    "801": "Sport",
    "802": "Musée",
    "803": "Bibliothèque",
    "804": "Activités",
    "805": "Animations et loisirs",

    "900": "Matériel",
    "901": "Bagagerie",
    "902": "Magasin solidaire",
    "903": "Vêtements",
    "904": "Animaux",

    "1100": "Spécialistes",
    "1101": "Allergologie",
    "1102": "Cardiologie",
    "1103": "Dermatologie",
    "1104": "Echographie",
    "1105": "Endocrinologie",
    "1106": "Gastro-entérologie",
    "1107": "Gynécologie",
    "1108": "Kinésithérapie",
    "1109": "Mammographie",
    "1110": "Ophtalmologie",
    "1111": "Oto-rhino-laryngologie",
    "1112": "Nutrition",
    "1113": "Pédicure",
    "1114": "Phlébologie",
    "1115": "Pneumologie",
    "1116": "Radiologie",
    "1117": "Rhumatologie",
    "1118": "Urologie",
    "1119": "Orthophonie",
    "1120": "Stomatologie",
    "1121": "Osthéopathie",
    "1122": "Accupuncture"
  };

  var loadNewMarker = function(cat, lat, lng) {
    updateURLParameter(window.location.href, "cat", cat);
    console.log("load new");

    markerGroup.clearLayers();
    if (cat == 0) {
      $.get(
        "https://apisoliguide.site/lieux/?limit=" +
          params.nbresult +
          "&page=1&distance=5&lat=" +
          params.lat +
          "&lng=" +
          params.lng +
          "&covid=true",
        function(data, textStatus, jqXHR) {
          for (var i = 0; i < data.length; i++) {
            CreateMarker(data[i]);
          }
        }
      );
    } else {
      $.get(
        "https://apisoliguide.site/lieux/?categorie=" +
          cat +
          "&limit=" +
          params.nbresult +
          "&page=1&distance=5&lat=" +
          params.lat +
          "&lng=" +
          params.lng +
          "&covid=true",
        function(data, textStatus, jqXHR) {
          for (var i = 0; i < data.length; i++) {
            CreateMarker(data[i]);
          }
        }
      );
    }
  };

  var GenerateMap = function(id, lat, lng, options) {
    var url = document.location.href;
    var params = getAllUrlParams(url);
    var style = "voyager";
    console.log(params);

    $.get(
      "https://apisoliguide.site/lieux/?categorie=" +
        params.cat +
        "&limit=" +
        params.nbresult +
        "&page=1&distance=5&lat=" +
        params.lat +
        "&lng=" +
        params.lng +
        "&covid=true",
      function(data, textStatus, jqXHR) {
        soliguideMap = L.map("map", {
          scrollWheelZoom: false
        }).setView([0, 0], 0);
        switch (style) {
          case "voyager":
            var CartoDB_Voyager = L.tileLayer(
              "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
              {
                attribution:
                  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 19
              }
            ).addTo(soliguideMap);

            break;
          case "watercolor":
            var Stamen_Watercolor = L.tileLayer(
              "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
              {
                attribution:
                  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: "abcd",
                minZoom: 1,
                maxZoom: 16,
                ext: "jpg"
              }
            ).addTo(soliguideMap);

            break;
          case "classic":
            var Hydda_Full = L.tileLayer(
              "https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
              {
                maxZoom: 18,
                attribution:
                  'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              }
            ).addTo(soliguideMap);

            break;
          case "satelite":
            var Esri_WorldImagery = L.tileLayer(
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              {
                attribution:
                  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              }
            ).addTo(soliguideMap);

            break;
          case "grey":
            var CartoDB_Positron = L.tileLayer(
              "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
              {
                attribution:
                  '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 19
              }
            ).addTo(soliguideMap);

            break;
          case "stamen":
            var Stamen_Terrain = L.tileLayer(
              "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}",
              {
                attribution:
                  'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                subdomains: "abcd",
                minZoom: 0,
                maxZoom: 18,
                ext: "png"
              }
            ).addTo(soliguideMap);

            break;
          default:
        }
        markerGroup = L.featureGroup().addTo(soliguideMap);
        for (var i = 0; i < data.length; i++) {
          CreateMarker(data[i]);
        }

        L.Control.Watermark = L.Control.extend({
          onAdd: function(map) {
            var container = L.DomUtil.create("div");
            var link = L.DomUtil.create("a");
            var img = L.DomUtil.create("img");
            var icon = L.DomUtil.create("i");
            var br = L.DomUtil.create("br");
            var select = L.DomUtil.create("select");
            var button = L.DomUtil.create("button");
            button.innerHTML = "reload";
            button.setAttribute("class", "followMe");
            select.id = "catSelect";
            var br2 = L.DomUtil.create("br");
            var br3 = L.DomUtil.create("br");
            var br4 = L.DomUtil.create("br");
            var instamapW = L.DomUtil.create("a");
            var cat = Object.keys(categorieList);
            // console.log(cat);

            var optionall = L.DomUtil.create("option");
            optionall.value = 0;
            optionall.innerHTML = "choisir un catégorie";
            select.appendChild(optionall);
            for (let i = 0; i < cat.length; i++) {
              // console.log(cat);
              var option = L.DomUtil.create("option");
              option.value = cat[i];
              option.innerHTML = categorieList[cat[i]];
              select.appendChild(option);
            }
            select.addEventListener("change", function() {
              loadNewMarker(this.value);
              // console.log();
            });
            button.addEventListener("change", function() {
              loadNewMarker();
              // console.log();
            });

            instamapW.setAttribute("target", "_blank");
            link.innerHTML = " Ajoutez votre structure";
            link.setAttribute("target", "_blank");
            link.setAttribute("href", "https://soliguide.fr/covid");
            link.setAttribute("class", "followMe");
            img.src = "https://soliguide.fr/images/logo.png";
            img.style.width = "170px";
            img.style.padding = "10px";
            img.style.margin = "auto";
            img.style.border = "2px solid #4A68D6";
            img.style.borderRadius = "10px";
            container.style.textAlign = "center";
            container.style.width = "20vw";
            container.style.borderLeft = "2px solid #4A68D6";
            container.style.backgroundColor = "#fff";
            container.style.position = "relative";
            container.style.display = "block";
            container.style.top = 0;
            container.style.margin = 0;
            container.style.right = 0;
            container.style.height = "100vh";
            container.appendChild(img);
            container.appendChild(br3);
            container.appendChild(br2);
            container.appendChild(link);
            container.appendChild(br4);
            container.appendChild(br);
            container.appendChild(select);
            container.appendChild(button);
            // instamapW.appendChild(img);
            // link.appendChild(icon);
            // link.appendChild(username);
            // instamapW.appendChild(img);

            return container;
          },

          onRemove: function(map) {
            // Nothing to do here
          }
        });

        L.control.watermark = function(opts) {
          return new L.Control.Watermark(opts);
        };

        L.control.watermark({ position: "topright" }).addTo(soliguideMap);
      }
    );
    loader.style.display = "none";

    // yo.addEventListener("change", function(e) {
    //   console.log(this.value);
    // });
  };

  var CreateMarker = function(fiche) {
    // console.log(fiche);
    if (fiche.location) {
      //   var icon = L.icon({
      //     iconUrl: instaMedia.images.low_resolution.url,

      //     iconSize: [
      //       instaMedia.images.low_resolution.width / 7,
      //       instaMedia.images.low_resolution.height / 7
      //     ], // size of the icon
      //     iconAnchor: [
      //       instaMedia.images.low_resolution.width / 7,
      //       instaMedia.images.low_resolution.height / 7
      //     ], // point of the icon which will correspond to marker's location
      //     popupAnchor: [-0, -80]
      //     // popupAnchor:  [(instaMedia.images.low_resolution.width)/4, (instaMedia.images.low_resolution.height)/4] // point from which the popup should open relative to the iconAnchor
      //   });
      // 	var zoomedIcon = L.icon({
      //     iconUrl: instaMedia.images.low_resolution.url,
      //
      //     iconSize:     [instaMedia.images.low_resolution.width/2, instaMedia.images.low_resolution.height/2], // size of the icon
      //     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //     popupAnchor:  [-20, -76] // point from which the popup should open relative to the iconAnchor
      // });
      // console.log(fiche.name);

      var customPopup =
        "<div style='background-color:#fff; border : 2px #4663AB solid; color:#4663AB;padding:20px; border-radius:10px'> <h2>";
      customPopup += fiche.name;
      customPopup += "</h2>";
      if (fiche.info != undefined) {
        customPopup += "<p>";
        if (fiche.info.name != undefined) {
          customPopup += "<h3>";
          customPopup += fiche.info.name;
          customPopup += "</h3>";
        }
        if (fiche.info.description != undefined) {
          customPopup += fiche.info.description;
        }
        if (fiche.info.horaires != undefined || fiche.info.horaires != false) {
          customPopup += "<h3>Horaires Temporairement</h3>";
          customPopup += "<p>";
          customPopup += fiche.info.horaires_description;
          customPopup += "</p>";
        }
        customPopup += "</p>";
      }
      if (fiche.close.closeType == 2) {
        customPopup += "<h3>Fermé Temporairement</h3>";
        customPopup += "<p>";
        customPopup += fiche.close.precision;
        customPopup += "</p>";
      }

      customPopup +=
        "<br/><a class='followMe' href=https://soliguide.fr/fiche/";
      customPopup += fiche.lieu_id;
      customPopup += ">voir sur Soliguide</a></p></div>";

      // specify popup options
      var customOptions = {
        maxWidth: "500",
        className: "custom"
      };

      if (fiche.close.closeType == 0) {
        var openIcon = greenIcon;
      } else {
        if (fiche.close.closeType == 2) {
          var openIcon = orangeIcon;
        } else {
          var openIcon = blueIcon;
        }
      }

      var marker = L.marker(
        [fiche.location.coordinates[1], fiche.location.coordinates[0]],
        { icon: openIcon }
      )
        .bindPopup(customPopup, customOptions)
        .addTo(markerGroup);

      soliguideMap.fitBounds(markerGroup.getBounds(), { padding: [1, 1] });
    }
    soliguideMap.whenReady(function() {
      soliguideMap.on("moveend", function() {
        if (mapCenter != soliguideMap.getCenter()) {
          mapCenter = soliguideMap.getCenter();
          // console.log(mapCenter);
        }
      });
    });
    soliguideMap
      .locate({
        watch: true
      }) /* This will return map so you can do chaining */
      .on("locationfound", function(e) {
        // var marker = L.marker([e.latitude, e.longitude]).bindPopup(
        //   "Your are here :)"
        // );
        var circle = L.circle([e.latitude, e.longitude], e.accuracy / 50, {
          color: "#4663AB",
          fillOpacity: 1
        });
        // soliguideMap.addLayer(marker);
        soliguideMap.addLayer(circle);
      })
      .on("locationerror", function(e) {
        console.log(e);
      });
  };

  GenerateMap(300, "voyager");

  console.log("DOM fully loaded and parsed");
});
