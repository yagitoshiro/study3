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

Ti.Geolocation.purpose = "アプリで利用できるGPS機能の理解を深めるため";
var current_position = null;
Titanium.Geolocation.getCurrentPosition(function(e){
  if(e.error){
    alert("申し訳ございません、位置情報を利用することができません");
  }else{
    current_position = e.coords;

    Ti.Geolocation.reverseGeocoder(current_position.latitude, current_position.longitude, function(e){
      Ti.API.info(e);
      if(e.success){
        var annotation = Ti.Map.createAnnotation({
          animate:true,
          pincolor: Titanium.Map.ANNOTATION_GREEN,
          title:'現在地',
          subtitle:e.places[0].address,
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
      }else{
        alert("現在地の住所を取得できませんでした");
      }
    });
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
