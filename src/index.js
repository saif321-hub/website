import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
//saif saeed

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

btn3.hidden=true;

const db = getDatabase()
let refC = ref(db, `users/`)
const dbRef = ref(getDatabase());


let unsubscribe;
btn2.disabled = true;
btn.addEventListener("click", (event) => {
  x = document.getElementById("myText").value.toUpperCase();
  console.log(x);
  refC = ref(db, `users/${x}`)
  if (x == '') {
    window.alert("can nor be empty");
  }
  else {
    liveMark()
    select.disabled=true
    btn.disabled = true;
    btn2.disabled = false;
  }
});


btn2.addEventListener('click', (event) => {
  unsubscribe()
  select.disabled=false
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


//////////

var map = L.map('map',{ zoomControl: false ,attributionControl:false}).setView([33.32190556525824, 44.37579788850953], 13);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);


/*var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);


var drawControl = new L.Control.Draw({
  position: 'bottomleft',
  edit: {
    featureGroup: drawnItems,
    remove: true,
  },

})
map.addControl(drawControl);

map.on("draw:created", function (e) {
  var type = e.layertype;
  var layer = e.layer;
  //console.log(e);
  drawnItems.addLayer(layer);
})
*/
/////////



let latCoord, longCoord, LastestTime, curruntTime, id,speed;
let marker, circle, zoomed;

curruntTime = new Date()

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
    LastestTime = snapshot.val().time;
    speed=snapshot.val().sped;
    id = snapshot.val().ID.toUpperCase();
    console.log(speed);
    speed=Math.round((speed*3600)/1000);
    
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
    marker = L.marker([latCoord, longCoord]).addTo(map).bindPopup(`<h1>${id}<h1/>  <h3>${LastestTime}<h3/> <h3>Speed ${speed} KM<h3/>`)
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
        //window.alert("already in track");
        break;
      }
      else {
        idList.push(devId);
        marker = L.marker([latCoord, longCoord]).addTo(map).bindPopup(`<h1>${id}<h1/>  <h3>${LastestTime}<h3/>`)
        circle = L.circle([latCoord, longCoord], 3).addTo(map)

        if (!zoomed) {
          zoomed = map.fitBounds(circle.getBounds())
        }
      }
    }


  })
}

let idAry=[];
let ref2 = ref(db, `users/`)
function getList() {
  onValue(ref2, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      idAry.push(childSnapshot.val().ID.toUpperCase());
    })
  })
}
getList()

console.log(idAry.length);
console.log(idAry);
let option=``;
setTimeout(() => {  for(var i=0;i<idAry.length;i++){
  option+=`<option value="`+ idAry[i] +`">`+idAry[i]+"</option> "
}
document.getElementById('month').innerHTML=option; }, 3000);
var select = document.getElementById("month");
select.addEventListener("change", ()=>{
  filed.innerText="";
  var value = select.value;
  filed.value=value;
});