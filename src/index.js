import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';


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
let btn = document.getElementById('btn')
let filed = document.getElementById('myText')
let x = document.getElementById("myText").value;
let btn2 = document.getElementById('btn2')
let btn3 = document.getElementById('btn3')


const db = getDatabase()
let refC = ref(db, `users/`)
const dbRef = ref(getDatabase());


let unsubscribe;
btn2.disabled = true;
btn.addEventListener("click", (event) => {
  x = document.getElementById("myText").value;
  refC = ref(db, `users/${x}`)
  if (x == '') {
    window.alert("can nor be empty");
  }
  else {
    console.log(x);
    liveMark()
    btn.disabled = true;
    btn2.disabled = false;
  }
});


btn2.addEventListener('click', (event) => {
  unsubscribe()
  btn.disabled = false;
  btn2.disabled = true;
  filed.value = '';
  map.removeLayer(marker)
  map.removeLayer(circle)
})

btn3.addEventListener('click', (event) => {
  x = document.getElementById("myText").value;
  refC = ref(db, `users/${x}`)
  if (x == '') {
    window.alert("can nor be empty");
  }
  else {
    groupLive();
  }

})
var map = L.map('map',
  {
    zoomControl: false,
  }).setView([33.32190556525824, 44.37579788850953], 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);


L.control.zoom({
  position: 'bottomleft'
}).addTo(map);


let latCoord, longCoord;
let marker, circle, zoomed;



function hopso() {
  onValue(refC, (snapshot) => {
    ID.textContent = snapshot.val().ID
    lang.textContent = snapshot.val().lang
    lat.textContent = snapshot.val().lat
    time.textContent = snapshot.val().time

  })
}



function liveMark() {
  unsubscribe = onValue(refC, (snapshot) => {
    latCoord = Number(snapshot.val().lat)
    longCoord = Number(snapshot.val().lang)
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
    marker = L.marker([latCoord, longCoord]).addTo(map).bindPopup(`<h1>${snapshot.val().ID}<h1/>`)
    circle = L.circle([latCoord, longCoord], 3).addTo(map)

    if (!zoomed) {
      zoomed = map.fitBounds(circle.getBounds())
    }
    map.setView([latCoord, longCoord])
  })
}

const idList = ['helo'];
function groupLive() {
  onValue(refC, (snapshot) => {
    latCoord = Number(snapshot.val().lat)
    longCoord = Number(snapshot.val().lang)
    let devId = snapshot.val().ID;
    for (let i = 0; i < idList.length; i++) {
      if (idList[i] == devId) {
        window.alert("already in track");
        break;
      }
      else {
        idList.push(devId);
        console.log(devId);
        marker = L.marker([latCoord, longCoord]).addTo(map).bindPopup(`<h1>${snapshot.val().ID}<h1/>`)
        circle = L.circle([latCoord, longCoord], 3).addTo(map)

        if (!zoomed) {
          zoomed = map.fitBounds(circle.getBounds())
        }
      }
    }

    //map.setView([latCoord, longCoord])
  })
}