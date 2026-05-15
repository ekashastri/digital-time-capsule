function signup(){
let u=username.value.trim();
let p=password.value.trim();

if(!u||!p){alert("Enter details");return;}

if(localStorage.getItem(u)){
alert("User exists");return;
}

localStorage.setItem(u,JSON.stringify({password:p,capsules:[]}));
alert("Account created");
}

function login(){
let u=username.value.trim();
let p=password.value.trim();

let data=localStorage.getItem(u);

if(!data){alert("User not found");return;}

data=JSON.parse(data);

if(data.password!==p){alert("Wrong password");return;}

localStorage.setItem("currentUser",u);
window.location="dashboard.html";
}

function logout(){
localStorage.removeItem("currentUser");
window.location="login.html";
}

function togglePassword(){
password.type=password.type==="password"?"text":"password";
}

function saveCapsule(){
let user=localStorage.getItem("currentUser");
let data=JSON.parse(localStorage.getItem(user));

let file=fileData.files[0];
let reader=new FileReader();

function store(f,t){
data.capsules.push({
title:title.value,
text:textData.value,
file:f,
type:t,
unlock:unlockTime.value
});
localStorage.setItem(user,JSON.stringify(data));
alert("Saved");
}

if(file){
reader.onload=()=>store(reader.result,file.type);
reader.readAsDataURL(file);
}else{
store(null,null);
}
}

function showPopup(content){
popupBody.innerHTML=content;
popup.classList.remove("hidden");
}

function closePopup(){
popup.classList.add("hidden");
}

function loadCapsules(){
let user=localStorage.getItem("currentUser");
let data=JSON.parse(localStorage.getItem(user));

if(!data||data.capsules.length===0){
capsules.innerHTML="<p>No capsules</p>";return;
}

capsules.innerHTML="";

data.capsules.forEach((c,i)=>{
let unlock=new Date(c.unlock);
let locked=new Date()<unlock;

let div=document.createElement("div");
div.className="capsule";

div.innerHTML=`
<h3>${c.title}</h3>
<p>${locked?"🔒 Locked":"🔓 Open"}</p>
<p>${unlock.toLocaleString()}</p>
<p id="t${i}"></p>
`;

capsules.appendChild(div);

let t=document.getElementById(`t${i}`);

setInterval(()=>{
let diff=unlock-new Date();
if(diff<=0){t.innerHTML="Open";return;}
let s=Math.floor(diff/1000)%60;
let m=Math.floor(diff/60000)%60;
let h=Math.floor(diff/3600000);
t.innerHTML=`${h}h ${m}m ${s}s`;
},1000);

div.onclick=()=>{
if(locked){
showPopup(`<h3>Locked</h3><p>Unlocks on ${unlock}</p>`);
}else{
let preview="";
if(c.type?.startsWith("image"))preview=`<img src="${c.file}" width="100%">`;
showPopup(`<h3>${c.title}</h3><p>${c.text}</p>${preview}`);
}
};
});
}

if(document.getElementById("capsules")) loadCapsules();