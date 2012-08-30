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

      map.addEventListener('click', function(e){
        var detail_win = Ti.UI.createWindow({title:'チェックイン', backgroundColor:'White'});
        if(e.annotation){
          var address = e.annotation.subtitle;
        }else{
          var address = '不明';
        }
        detail_win.add(Ti.UI.createLabel({text:address, width:Ti.UI.SIZE,height:Ti.UI.SIZE,top:20}));
        detail_win.add(Ti.UI.createLabel({text:e.annotation.latitude, width:Ti.UI.SIZE,height:Ti.UI.SIZE,top:70}));
        detail_win.add(Ti.UI.createLabel({text:e.annotation.longitude, width:Ti.UI.SIZE,height:Ti.UI.SIZE,top:120}));
        detail_win.add(Ti.UI.createButton({title:'チェックイン',  width:Ti.UI.SIZE,height:Ti.UI.SIZE,top:170}));
        tab1.open(detail_win);
      });

      win1.add(map);
    };
    http.open('GET', url);
    http.send();
  }
  Ti.API.info(e);
});


var win2 = Titanium.UI.createWindow({  
    title:'Tab 2',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Tab 2',
    window:win2
});

var label2 = Titanium.UI.createLabel({
	color:'#999',
	text:'I am Window 2',
	font:{fontSize:20,fontFamily:'Helvetica Neue'},
	textAlign:'center',
	width:'auto'
});

win2.add(label2);

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

tabGroup.open();
