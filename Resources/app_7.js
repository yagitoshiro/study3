Titanium.UI.setBackgroundColor('#000');

var tabGroup = Titanium.UI.createTabGroup();

var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:'#fff'
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});
var search= Ti.UI.createSearchBar({
  hintText:'住所を入力',
  showCancel:true
});

win1.titleControl = search;
var map = null;

Ti.Geolocation.purpose = "アプリで利用できるGPS機能の理解を深めるため";
var current_position = null;
Titanium.Geolocation.getCurrentPosition(function(e){
  if(e.error){
    alert("申し訳ございません、位置情報を利用することができません");
  }else{
    current_position = e.coords;

    var lang = Ti.Platform.locale;
    if(lang == 'zh_hans'){
      lang = 'zh-CN';
    }
    if(lang == 'zh_hant'){
      lang = 'zh-TW';
    }
    var url = "http://maps.google.com/maps/api/geocode/json?latlng=" + current_position.latitude + "," + current_position.longitude + "&sensor=true&language=" + lang;
    var http = Ti.Network.createHTTPClient({timeout:10000});
    http.onload = function(e){
      var response = JSON.parse(http.responseText);
      var annotation = Ti.Map.createAnnotation({
        animate:true,
        pincolor: Titanium.Map.ANNOTATION_GREEN,
        title:'現在地',
        subtitle:response.results[0].formatted_address,
        latitude:current_position.latitude,
        longitude:current_position.longitude
      });

      var map = Ti.Map.createView({
        annotations:[annotation],
        mapType: Titanium.Map.STANDARD_TYPE,
        animate:true,
        region:{ 
          latitude:current_position.latitude,
          longitude:current_position.longitude,
          latitudeDelta:0.01,
          longitudeDelta:0.01
        },
        regionFit:true,
        userLocation:false
      });
      win1.add(map);
      search.addEventListener('return', function(e){
        var address = e.source.value;
        search.blur();
        var lang = Ti.Platform.locale;
        if(lang == 'zh_hans'){
          lang = 'zh-CN';
        }
        if(lang == 'zh_hant'){
          lang = 'zh-TW';
        }
        var forward_url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&language=' + lang + '&sensor=false'
        Ti.API.info(url);
        var forward_http = Ti.Network.createHTTPClient({timeout:10000});
        forward_http.onload = function(e){
          var response = JSON.parse(forward_http.responseText);
          var geo = response.results[0].geometry.location;
          var forward_annotation = Ti.Map.createAnnotation({
            animate:true,
            pincolor: Titanium.Map.ANNOTATION_RED,
            title:'目的地',
            subtitle:address,
            latitude:geo.lat,
            longitude:geo.lng
          });
          map.addAnnotation(forward_annotation);
          map.setRegion({latitude:geo.lat,longitude:geo.lng, latitudeDeta:0.1, longitudeDelta:0.1});
          map.addRoute({
            name:'道順',
            points:[{latitude:geo.lat, longitude:geo.lng}, {latitude:current_position.latitude,longitude:current_position.longitude}],
            color:'Red'
          });
        };
        forward_http.open('GET', forward_url);
        forward_http.send();
      });  
    };
    http.open('GET', url);
    http.send();
  }
  Ti.API.info(e);
});

tabGroup.addTab(tab1);  

tabGroup.open();
