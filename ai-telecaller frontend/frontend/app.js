const SCREENS={campaign:{title:'New Campaign',bc:'Campaign Setup'},call:{title:'Live Call',bc:'Call Screen'},dashboard:{title:'Dashboard',bc:'Overview'},analytics:{title:'Call Analytics',bc:'Analytics'},insights:{title:'Customer Feel',bc:'Insights'}};
let timerInterval=null,callSec=267;

// Landing → App
function enterApp(screen){
  const gate=document.getElementById('landing-gate');
  const app=document.getElementById('app-shell');
  closeModal();
  gate.classList.add('fade-out');
  setTimeout(()=>{
    gate.style.display='none';
    app.classList.remove('hidden');
    app.classList.add('entering');
    go(screen||'dashboard');
    setTimeout(()=>app.classList.remove('entering'),400);
  },480);
}

// Modal
function openModal(){document.getElementById('start-modal').classList.add('open')}
function closeModal(){document.getElementById('start-modal').classList.remove('open')}
function handleModalClick(e){if(e.target===document.getElementById('start-modal'))closeModal()}

// Nav
function go(screen){
  if(!SCREENS[screen])return;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const el=document.getElementById('screen-'+screen);
  if(el)el.classList.add('active');
  const nb=document.getElementById('nav-'+screen);
  if(nb)nb.classList.add('active');
  document.getElementById('topbar-title').textContent=SCREENS[screen].title;
  document.getElementById('bc-page').textContent=SCREENS[screen].bc;
  if(screen==='call')initCall();else stopTimer();
}

// Call screen
function initCall(){buildWaveform();startTimer();setTimeout(resolveTyping,2800)}

function buildWaveform(){
  const wf=document.getElementById('waveform');if(!wf)return;
  wf.innerHTML='';
  for(let i=0;i<28;i++){
    const b=document.createElement('div');b.className='wf-bar';
    const h=Math.random()*18+6;
    b.style.cssText=`height:${h}px;animation-delay:${(i*.06).toFixed(2)}s;animation-duration:${(.8+Math.random()*.8).toFixed(2)}s`;
    wf.appendChild(b);
  }
}

function startTimer(){
  stopTimer();
  timerInterval=setInterval(()=>{
    callSec++;
    const m=String(Math.floor(callSec/60)).padStart(2,'0');
    const s=String(callSec%60).padStart(2,'0');
    const el=document.getElementById('call-timer');
    if(el)el.textContent=`${m}:${s}`;
  },1000);
}

function stopTimer(){if(timerInterval){clearInterval(timerInterval);timerInterval=null}}

function resolveTyping(){
  const t=document.getElementById('ai-typing');if(!t)return;
  t.querySelector('.msg-bubble').innerHTML='We support all major CRMs — Salesforce, HubSpot, Pipedrive, and Zoho. We also have a REST API. Most teams are live within 2 hours. Want to see the Salesforce integration live?';
  t.classList.remove('typing');
  const win=document.getElementById('chat-win');
  if(win)win.scrollTop=win.scrollHeight;
  setTimeout(()=>{
    const cp=document.getElementById('cp-fill');if(cp)cp.style.width='84%';
    const cv=document.getElementById('cp-val');if(cv)cv.textContent='84%';
  },600);
}

document.addEventListener('DOMContentLoaded',()=>{
  // chat override
  const input=document.getElementById('call-override');
  const send=document.querySelector('.call-send');
  function sendMsg(){
    if(!input||!input.value.trim())return;
    const win=document.getElementById('chat-win');
    const msg=document.createElement('div');
    msg.className='msg human';
    msg.innerHTML=`<div class="msg-time">${ts()}</div><div class="msg-bubble">${esc(input.value.trim())}</div><div class="msg-av">SP</div>`;
    const typing=document.getElementById('ai-typing');
    if(win&&typing)win.insertBefore(msg,typing);
    input.value='';
    if(win)win.scrollTop=win.scrollHeight;
  }
  if(send)send.addEventListener('click',sendMsg);
  if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg()});

  // voice opt
  document.querySelectorAll('.voice-opt').forEach(o=>{
    o.addEventListener('click',()=>{
      document.querySelectorAll('.voice-opt').forEach(x=>x.classList.remove('selected'));
      o.classList.add('selected');
    });
  });
  // suggestion
  document.querySelectorAll('.sug-btn').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.sug-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
    });
  });
});

function ts(){const n=new Date();return`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
