var current_position = {};
Ti.Geolocation.purpose = "アプリで利用できるGPS機能の理解を深めるため";
Titanium.Geolocation.getCurrentPosition(function(e){
  if(e.error){
    alert("申し訳ございません、位置情報を利用することができません");
  }else{
    var lon = e.coords.longitude;
    var lat = e.coords.latitude;
    var altitude = e.coords.altitude;
    var heading = e.coords.heading;
    var accuracy = e.coords.accuracy;
    var speed = e.coords.speed;
    var timestamp = e.coords.timestamp;
    var altitudeAccuracy = e.coords.altitudeAccuracy;
    current_positoon = e;
  }
  Ti.API.info(e);
});

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

var annotations = [];
var lats = [];
var longs = [];
for(var i = 0; i <= 4; i++){
  lats.push(35.395837 + (i / 10));
}
for(var i = 0; i <= 2; i++){
  longs.push(139.224059 + (1.5 * i / 10));
}

//annotations.push(Ti.Map.createAnnotation({pincolor:Ti.Map.ANNOTATION_PURPLE,latitude:35.395837, longitude:139.224059, title:'源実朝首塚'}));
//annotations.push(Ti.Map.createAnnotation({pincolor:Ti.Map.ANNOTATION_PURPLE,latitude:35.442771, longitude:136.86438, title:'首塚・胴塚'}));
for(var i = 0; i <= lats.length; i++){
  var lat = 0;
  var lon = 0;
  if(i == 0){lat = lats[2];lon = longs[0];}
  if(i == 1){lat = lats[0];lon = longs[1];}
  if(i == 2){lat = lats[1];lon = longs[2];}
  if(i == 3){lat = lats[3];lon = longs[2];}
  if(i == 4){lat = lats[4];lon = longs[1];}

  annotations.push(Ti.Map.createAnnotation({pinImage:'/green.png', latitude:lat, longitude:lon, title:i.toString()}));
}

var map = Ti.Map.createView({
  mapType: Titanium.Map.STANDARD_TYPE,
  animate:true,
  annotations:annotations,
  region:{ latitude:35.65861,longitude:139.745447,latitudeDelta:0.05, longitudeDelta:0.05},
  userLocation:true,
  regionFit:true
});
win1.add(map);

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
