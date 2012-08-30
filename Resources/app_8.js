Titanium.UI.setBackgroundColor('#000');

function get_lang(){
  var lang = Ti.Platform.locale;
  if(lang == 'zh_hans'){
    lang = 'zh-CN';
  }
  if(lang == 'zh_hant'){
    lang = 'zh-TW';
  }
  return lang;
}

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
var map = Ti.Map.createView();

var navi_button = Ti.UI.createButton({
  title:'道案内'
});

var start_point = {};
var destication_point = {};

navi_button.addEventListener('click', function(){
  if(destication_point.latitude){
    var webview = Ti.UI.createWebView({
      url:'map.html',
      width:Ti.UI.FILL,
      height:Ti.UI.FILL,
      top:0
    });
    webview.addEventListener('load', function(){
      var start = start_point.latitude + "," + start_point.longitude;
      var end = destication_point.latitude + "," + destication_point.longitude;
      webview.evalJS('load_map('+destication_point.latitude+', '+destication_point.longitude+', '+start_point.latitude+', "'+start_point.longitude+'");');
    });
    map.hide();
    win1.add(webview);
  }else{
    alert('現在地と目的地がセットされていません');
  }
});

win1.leftNavButton = navi_button;

Ti.Geolocation.purpose = "アプリで利用できるGPS機能の理解を深めるため";
var current_position = null;
Titanium.Geolocation.getCurrentPosition(function(e){
  if(e.error){
    alert("申し訳ございません、位置情報を利用することができません");
  }else{
    current_position = e.coords;

    var lang = get_lang();
    var url = "http://maps.google.com/maps/api/geocode/json?latlng=" + current_position.latitude + "," + current_position.longitude + "&sensor=true&language=" + lang;
    var http = Ti.Network.createHTTPClient({timeout:10000});
    http.onload = function(e){

      start_point.latitude = current_position.latitude;
      start_point.longitude = current_position.longitude;

      var response = JSON.parse(http.responseText);
      var annotation = Ti.Map.createAnnotation({
        animate:true,
        pincolor: Titanium.Map.ANNOTATION_GREEN,
        title:'現在地',
        subtitle:response.results[0].formatted_address,
        latitude:current_position.latitude,
        longitude:current_position.longitude
      });

      map.annotations = [annotation];
      map.mapType = Titanium.Map.STANDARD_TYPE;
      map.animate = true;
      map.region = { 
          latitude:current_position.latitude,
          longitude:current_position.longitude,
          latitudeDelta:0.01,
          longitudeDelta:0.01
        };
      map.regionFit = true;
      map.userLocation = false;
      win1.add(map);
      search.addEventListener('cancel', function(e){
        search.blur();
      });
      search.addEventListener('return', function(e){
        var address = e.source.value;
        search.blur();
        var lang = get_lang();
        var forward_url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&language=' + lang + '&sensor=false&mode=walking'
        var forward_http = Ti.Network.createHTTPClient({timeout:10000});
        forward_http.onload = function(e){
          var response = JSON.parse(forward_http.responseText);
          var geo = response.results[0].geometry.location;

          destication_point.latitude = geo.lat;
          destication_point.longitude = geo.lng;

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
            color:'Green'
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
