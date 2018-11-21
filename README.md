<h1 align="center">
<br>
 ignite mapbox
 </br>
</h1>
  An ignite plugin for adding mapbox easier
  
  <p align="center">
  
  <img src="https://raw.githubusercontent.com/lvlrSajjad/ignite-boilerplate-andross-typescript/master/gifs/maps.gif" width="100%">
  </p>

  You can install mapbox and link it by this command
   
   ```
ignite add map
```
   and generate a map component with 
   
   ```
ignite generate map MapName
```
   then use it as below 
    
  and you can get your token key with instructions inside mapbox github https://github.com/mapbox/react-native-mapbox-gl
  
  then you can use token key inside `App>Config>MapboxConfig.tsx`
 ### Usage :
  
  ```typescript jsx
  import MapboxGL from '@mapbox/react-native-mapbox-gl';
  import MapboxConfig from "../../Config/MapboxConfig";
  MapboxGL.setAccessToken(MapboxConfig.accessToken); // here you set access token
  ...
  <MapboxGL.MapView
   styleURL={ColorScheme.mapStyleUrl}
   zoomLevel={15}
   centerCoordinate={[51.3890,35.6892]}
   style={{flex:1}}
   >
  </MapboxGL.MapView>
  ```

