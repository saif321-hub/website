import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, onValue, ref } from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyDrcMpNuWXfGWDf681jN4Bn48wO4PZeq0k",
  authDomain: "newatt-71b8b.firebaseapp.com",
  databaseURL: "https://newatt-71b8b-default-rtdb.firebaseio.com",
  projectId: "newatt-71b8b",
  storageBucket: "newatt-71b8b.appspot.com",
  messagingSenderId: "848811892519",
  appId: "1:848811892519:web:71f9203863ab3cc3059302"
};
initializeApp(firebaseConfig)
let ID = document.getElementById('ID')
let lang = document.getElementById('lang')
let lat = document.getElementById('lat')
let time = document.getElementById('time')

const db = getDatabase()
const refC = ref(db, 'users/4A9599C406D3B198')
const dbRef = ref(getDatabase());

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([44.5, -0.09]).addTo(map);




let latCoord, longCoord;
let marker, circle, zoomed;



function initLoc() {
  get(child(dbRef, `users/4A9599C406D3B198`)).then((snapshot) => {
    if (snapshot.exists()) {
      latCoord = Number(snapshot.val().lat)
      longCoord = Number(snapshot.val().lang)
      console.log(latCoord, longCoord);
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}
initLoc();




function hopso() {
  onValue(refC, (snapshot) => {
    ID.textContent = snapshot.val().ID
    lang.textContent = snapshot.val().lang
    lat.textContent = snapshot.val().lat
    time.textContent = snapshot.val().time

  })
}
hopso()





function liveMark() {
  onValue(refC, (snapshot) => {
    latCoord = Number(snapshot.val().lat)
    longCoord = Number(snapshot.val().lang)
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
    marker = L.marker([latCoord, longCoord]).addTo(map)
    circle = L.circle([latCoord, longCoord], 3).addTo(map)

    if (!zoomed) {
      zoomed = map.fitBounds(circle.getBounds())
    }
    map.setView([latCoord, longCoord])
    console.log(latCoord, longCoord);
  })
}
liveMark()

