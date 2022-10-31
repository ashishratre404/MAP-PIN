import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { useState, useEffect } from "react";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/register/Register";
import Login from "./components/login/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUeser, setCurrentUeser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [curPlaceId, setCurPlaceId] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 27.17102,
    longitude: 78.04056,
    zoom: 3,
  });

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    console.log(lat, long);
    setCurPlaceId(id);
    setViewport({
      latitude: lat,
      longitude: long,
      zoom: 3,
    });
  };

  const handleAndClick = (e) => {
    setNewPlace({
      lat: e.lngLat.lat,
      long: e.lngLat.lng,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUeser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () =>{
    myStorage.removeItem("user");
    setCurrentUeser(null);
  }

  return (
    <div>
      <ReactMapGL
        initialViewState={{ ...viewport }}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        style={{ width: "100vw", height: "100vh"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        onDblClick={handleAndClick}
        transitionDuration="200"
      >
        {pins.map((pin) => (
          <>
            <Marker
              longitude={pin.long}
              latitude={pin.lat}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <Room
                style={{
                  fontSize: viewport.zoom * 7,
                  color: pin.username === currentUeser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
              />
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
        ))}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => setNewPlace(null)}
          >
            <form onSubmit={handleSubmit}>
              <label>Title</label>
              <input
                placeholder="Enter a title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <label>Review</label>
              <textarea
                placeholder="Review for this place"
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className="submitBtn" type="submit">
                Add Pin
              </button>
            </form>
          </Popup>
        )}
        {currentUeser ? (
          <button className="button logout" onClick={handleLogout}>Logout</button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
            <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUeser={setCurrentUeser}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
