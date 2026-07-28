
const missions=[
 {icon:"🌲",realm:"Forêt des voyelles",title:"La lettre A",target:"A",items:["A","M","O","A","L","E","A","S","I","A","U","N"],story:"Plume : Retrouve tous les A cachés dans la forêt.",speech:"Trouve toutes les lettres A. Appuie sur chaque A, puis sur vérifier ma réponse."},
 {icon:"🐞",realm:"Jardin de Lili",title:"La lettre L",target:"L",items:["L","M","A","L","S","O","L","I","R","L","E","L"],story:"Lili la coccinelle a perdu ses lettres L.",speech:"Trouve toutes les lettres L."},
 {icon:"🐱",realm:"Maison de Chacha",title:"Le son CH",target:"CH",items:["CH","M","OU","CH","L","A","CH","S","ON","CH","OI","CH"],story:"Chacha cherche le son CH pour retrouver son chapeau.",speech:"Trouve tous les sons CH. Ch, comme dans chat."},
 {icon:"🐻",realm:"Grotte d’Oscar",title:"Le son OU",target:"OU",items:["OU","ON","A","OU","CH","L","OU","M","OI","OU","S","OU"],story:"Oscar a besoin du son OU pour ouvrir son pot de miel.",speech:"Trouve tous les sons OU. Ou, comme dans ours."},
 {icon:"🐑",realm:"Prairie magique",title:"Le son ON",target:"ON",items:["ON","OU","M","ON","A","CH","ON","L","OI","ON","R","ON"],story:"Le petit mouton cherche les sons ON dans la prairie.",speech:"Trouve tous les sons ON. On, comme dans mouton."},
 {icon:"🦊",realm:"Forêt de Rouxy",title:"Le son OI",target:"OI",items:["OI","ON","A","OI","OU","L","OI","M","CH","OI","S","OI"],story:"Rouxy cherche les sons OI pour ouvrir la boîte magique.",speech:"Trouve tous les sons OI. Oi, comme dans roi."}
];
const KEY="alice-final-progress";
let completed=new Set(JSON.parse(localStorage.getItem(KEY)||"[]"));
let current=0, selected=new Set(), voices=[];
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

function save(){localStorage.setItem(KEY,JSON.stringify([...completed]))}
function stars(){return completed.size*3}
function updateStars(){$$("[data-stars]").forEach(e=>e.textContent=stars())}
function show(id){$$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));if(id==="map")renderMap();updateStars();scrollTo({top:0,behavior:"smooth"})}

function loadVoices(){if("speechSynthesis" in window)voices=speechSynthesis.getVoices()}
loadVoices(); if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadVoices;
function speak(text){
 if(!("speechSynthesis" in window)){alert("La voix n’est pas disponible dans ce navigateur.");return}
 speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);
 u.lang="fr-FR";u.rate=.82;u.pitch=1.08;u.volume=1;
 const names=["Audrey","Amélie","Amelie","Marie","Virginie","Julie","Céline","Celine"];
 let v=null; for(const name of names){v=voices.find(x=>x.lang?.toLowerCase().startsWith("fr")&&x.name.toLowerCase().includes(name.toLowerCase()));if(v)break}
 v=v||voices.find(x=>x.lang?.toLowerCase()==="fr-fr")||voices.find(x=>x.lang?.toLowerCase().startsWith("fr")); if(v)u.voice=v;
 speechSynthesis.speak(u)
}

function renderMap(){
 const box=$("#realms"); box.innerHTML="";
 missions.forEach((m,i)=>{
  const unlocked=i===0||completed.has(i-1), done=completed.has(i);
  const b=document.createElement("button"); b.className="realm "+(done?"done":unlocked?"open":"locked"); b.disabled=!unlocked;
  b.innerHTML=`<span class="realm-icon">${m.icon}</span><strong>${m.realm}</strong><small>${done?"✅ Mission réussie":unlocked?`Mission ${i+1} · ${m.title}`:"🔒 Termine la mission précédente"}</small>`;
  if(unlocked)b.onclick=()=>openMission(i); box.appendChild(b);
  if(i<missions.length-1){const p=document.createElement("div");p.className="path";p.textContent="••••";box.appendChild(p)}
 });
 const pct=Math.round(completed.size/missions.length*100);$("#progressFill").style.width=pct+"%";
 $("#progressText").textContent=completed.size+(completed.size>1?" missions terminées":" mission terminée")
}
function openMission(i){
 current=i;selected.clear();const m=missions[i];
 $("#missionNumber").textContent=`Mission ${i+1}`;$("#missionTitle").textContent=m.title;$("#storyText").textContent=m.story;
 $("#instruction").innerHTML=`Clique sur tous les <strong>${m.target}</strong>.`;$("#feedback").textContent="";$("#feedback").className="feedback";
 const grid=$("#choices");grid.innerHTML="";
 m.items.forEach((item,n)=>{const b=document.createElement("button");b.className="choice";b.textContent=item;b.setAttribute("aria-label",item);
  b.onclick=()=>{selected.has(n)?selected.delete(n):selected.add(n);b.classList.toggle("selected");speak(item)};grid.appendChild(b)});
 show("game");setTimeout(()=>speak(m.speech),350)
}
$("#checkBtn").onclick=()=>{
 const m=missions[current],buttons=[...$("#choices").children], correct=m.items.map((x,i)=>x===m.target?i:-1).filter(i=>i>=0);
 const all=correct.every(i=>selected.has(i)), noWrong=[...selected].every(i=>m.items[i]===m.target);
 buttons.forEach((b,i)=>{if(m.items[i]===m.target&&selected.has(i))b.classList.add("correct");if(m.items[i]!==m.target&&selected.has(i))b.classList.add("wrong")});
 if(all&&noWrong){
  completed.add(current);save();updateStars();$("#feedback").textContent="Bravo ! Tout est juste !";$("#feedback").className="feedback good";
  speak(`Bravo Alice ! Mission réussie. Flamme gagne trois étoiles.`);
  $("#celebrationText").textContent=`Tu as réussi : ${m.title}.`;
  setTimeout(()=>show("celebration"),850)
 }else{
  $("#feedback").textContent=`Regarde encore bien… Il reste peut-être un ${m.target}.`;$("#feedback").className="feedback bad";
  speak(`Regarde encore bien. Il reste peut-être un ${m.target}.`);setTimeout(()=>buttons.forEach(b=>b.classList.remove("wrong")),700)
 }
};
$$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
$("#startBtn").onclick=()=>{speak("Bienvenue Alice ! Choisis la forêt des voyelles pour commencer.");show("map")};
$("#hearWelcome").onclick=()=>speak("Bonjour Alice ! Je suis Plume. Avec Flamme, nous allons retrouver les lettres magiques !");
$("#hearInstruction").onclick=()=>speak(missions[current].speech);
$("#resetBtn").onclick=()=>{if(confirm("Recommencer toute la progression ?")){completed.clear();save();renderMap();updateStars()}};
updateStars();
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("service-worker.js").catch(()=>{});
