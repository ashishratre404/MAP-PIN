import "./app.css";
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { useState, useEffect } from 'react';
import {Room, Star} from '@material-ui/icons';
import axios from 'axios';
import {format} from 'timeago.js';

function App() {
  const [pins, setPins] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [curPlaceId, setCurPlaceId] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 27.17102,
    longitude: 78.04056,
    zoom:3,
  });

  useEffect(()=>{
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getPins()
  }, [])

  const handleMarkerClick = (id) => {
    setCurPlaceId(id)
  }

  return (
    <div >
      <ReactMapGL 
        initialViewState={{...viewport}}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={nextViewport => setViewport(nextViewport)}
      >
      {pins.map(pin => (
        <>
        <Marker longitude={pin.long} latitude={pin.lat} offsetLeft={-20} offsetTop={-10} >
          <Room style={{fontSize:viewport.zoom * 7, color: "slateblue", cursor:"pointer"}} onClick={() => handleMarkerClick(pin._id)} />
        </Marker>
        {pin._id === curPlaceId && (
              <Popup
                key={pin._id}
                latitude={pin.lat}
                longitude={pin.long}
                closeButton={true}
                closeOnClick={false}
                anchor="left"
                onClose={() => setCurPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{pin.title}</h4>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                  {Array(pin.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
      </>
    ))};
      </ReactMapGL>
    </div>
  );
}

export default App;
