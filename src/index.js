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

let btn = document.getElementById('btn')
let filed = document.getElementById('myText')
let x = document.getElementById("myText").value;
let btn2 = document.getElementById('btn2')
var select = document.getElementById("menuList");


const db = getDatabase()
let refC = ref(db, `users/`)


//SETUP THE MAP
var map = L.map('map',{ zoomControl: false ,attributionControl:false}).setView([33.32190556525824, 44.37579788850953], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);



let devAry=[];
let idAry=[];


//FILLING THE ARRAYS
function getList() {
  onValue(refC, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let device={
        
        id: childSnapshot.val().ID.toUpperCase(),
        name: childSnapshot.val().name
      }
      devAry.push(device)
      idAry.push(childSnapshot.val().ID.toUpperCase());
    })
  })
}

getList()
console.log(devAry);


//LOAD THE LIST
let option=`<option class="placeHold" value="" disabled selected>Select your option</option>`;

setTimeout(() => {  for(var i=0;i<devAry.length;i++){
  if(devAry[i].name==undefined){
  option+=`<option  value="`+ devAry[i].id +`">`+`<span>unknown  :</span>`+devAry[i].id+"</option> "
  }
  else{
    option+=`<option  value="`+ devAry[i].id +`">`+`<span>${devAry[i].name} :</span>`+devAry[i].id+"</option> "
  }
}

select.innerHTML=option; }, 3000);


//LIST SELECTION CHANGE
select.addEventListener("change", ()=>{
  filed.innerText="";
  var value = select.value;
  filed.value=value;
});

let unsubscribe;
btn2.disabled = true;

// START BUTTON
btn.addEventListener("click", (event) => {
  x = document.getElementById("myText").value.toUpperCase();
  refC = ref(db, `users/${x}`)
if(idAry.includes(x)){
  liveMark()
  select.disabled=true
  btn.disabled = true;
  btn2.disabled = false;
  filed.disabled=true;
}
else if(x==""){
  window.alert("cant be empty");
}
else{
  window.alert("not found");
}
});

// STOP BUTTON
btn2.addEventListener('click', (event) => {
  unsubscribe()
  select.disabled=false
  btn.disabled = false;
  btn2.disabled = true;
  filed.value = '';
  filed.disabled=false;
  map.removeLayer(marker)
  map.removeLayer(circle)
})


let latCoord, longCoord, LastestTime, DeVname, id,speed;
let marker, circle, zoomed;

//UPDATE FUNCTION
function liveMark() {
  unsubscribe = onValue(refC, (snapshot) => {
    latCoord = Number(snapshot.val().lat)
    longCoord = Number(snapshot.val().lang)
    LastestTime = snapshot.val().time;
    speed=snapshot.val().sped;
    id = snapshot.val().ID.toUpperCase();
    DeVname=snapshot.val().name;
    speed=Math.round((speed*3600)/1000);
    
    if (marker) {
      map.removeLayer(marker);
      map.removeLayer(circle);
    }
    marker = L.marker([latCoord, longCoord]).addTo(map).bindPopup(`<h1>${DeVname}<h1/> <h2>${id}</h2>  <h3>${LastestTime}<h3/> <h3>Speed ${speed} KM<h3/>`).openPopup();
    circle = L.circle([latCoord, longCoord], 3).addTo(map)

    

    if (!zoomed) {
      zoomed = map.fitBounds(circle.getBounds())
    }
    map.setView([latCoord, longCoord])
  })
}


