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

var search= Ti.UI.createSearchBar({
  hintText:'住所を入力',
  showCancel:true
});

win1.titleControl = search;

search.addEventListener('return', function(e){
  var address = e.source.value;
  search.blur();
  Ti.Geolocation.forwardGeocoder(address, function(e){
    if(e.success){
      var annotation = Ti.Map.createAnnotation({
        animate:true,
        pincolor: Titanium.Map.ANNOTATION_RED,
        title:'目的地',
        subtitle:address,
        latitude:e.latitude,
        longitude:e.longitude
      });

      var map = Ti.Map.createView({
        annotations:[annotation],
        mapType: Titanium.Map.STANDARD_TYPE,
        animate:true,
        region:{ 
          latitude:e.latitude,
          longitude:e.longitude,
          latitudeDelta:0.01,
          longitudeDelta:0.01
        },
        regionFit:true,
        userLocation:false
      });
      win1.add(map);
    }else{
      alert('位置情報が見つかりませんでした');
    }
    Ti.API.info(e);
  });
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
