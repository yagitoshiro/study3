Ti.Geolocation.purpose = "アプリで利用できるGPS機能の理解を深めるため";

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

var map = Ti.Map.createView({
  mapType: Titanium.Map.STANDARD_TYPE,
  animate:true,
  region:{ latitude:35.65861,longitude:139.745447,latitudeDelta:0.05, longitudeDelta:0.05},
  userLocation:false,
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

