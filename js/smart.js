/* Clear Reps · the "smart" layer: rolling muscle load, what needs work, plan adjustments and the
   before/after explanations. Loaded before app.js; everything here runs only when called, so it can use
   app.js globals (EX, MUSCLES, S, phaseFor, …). */

/* ---------- rolling 7-day muscle load ----------
   Each logged set counts 1 for its main muscles and 0.5 for helpers, fading linearly to 0 over 7 days.
   So the map "resets" gradually, a day at a time, instead of on Mondays. */
const LOAD_DAYS = 7;
function setTimeMs(w){ const t=Date.parse(w.finishedAt||w.startedAt||""); return isFinite(t)?t:Date.parse(w.date+"T12:00:00"); }
function muscleLoad(opts={}){
  const now=opts.now||Date.now(), skip=opts.skipId;
  const load={}, raw={}, last={};
  Object.keys(MUSCLES).forEach(k=>{ load[k]=0; raw[k]=0; last[k]=null; });
  const all=[...doneWorkouts(), ...(S.active&&!opts.noActive?[S.active]:[])];
  all.forEach(w=>{
    if(w.id===skip) return;
    const age=(now-setTimeMs(w))/864e5; if(age<-1||age>LOAD_DAYS) return;
    const f=Math.max(0,Math.min(1,1-Math.max(0,age)/LOAD_DAYS));
    (w.sets||[]).filter(s=>s.done).forEach(s=>{ const e=EX[s.ex]; if(!e) return;
      const add=(m,v)=>{ if(!(m in load)) return; load[m]+=v*f; raw[m]+=v; if(last[m]===null||age<last[m]) last[m]=Math.max(0,age); };
      e.m.forEach(m=>add(m,1)); e.s.forEach(m=>add(m,.5));
    });
  });
  return {load,raw,last};
}
/* the target band moves with the phase: lighter while easing back in */
function loadBand(){
  const ph=phaseFor(currentWeek());
  /* tuned to the full-body round: a muscle trained every other workout, a few times a week, lands in the green.
     A rule of thumb for the picture, not a prescription. */
  if(ph.key==="build") return {lo:2,hi:7,ph};
  return {lo:1.5,hi:6,ph};
}
/* blue (light) → green (right amount) → orange → red (overworked) */
const LOAD_STOPS=[[0,"#C9D7FF"],[.45,"#3366FF"],[1,"#12A365"],[1.5,"#12A365"],[1.85,"#F2A516"],[2.3,"#E5484D"]];
function mixHex(a,b,t){ const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)); const A=p(a),B=p(b); return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join(""); }
function loadColor(L,band){
  /* x: 1 = bottom of the right amount, 1.5 = top of it */
  const x = L<band.lo ? L/band.lo : 1+.5*(L-band.lo)/(band.hi-band.lo);
  for(let i=1;i<LOAD_STOPS.length;i++){ const [x0,c0]=LOAD_STOPS[i-1],[x1,c1]=LOAD_STOPS[i]; if(x<=x1) return mixHex(c0,c1,Math.max(0,(x-x0)/(x1-x0))); }
  return LOAD_STOPS.at(-1)[1];
}
const STATUS_TXT={none:"Not trained",light:"Light",building:"Building",good:"Right amount",high:"A lot",over:"Overworked"};
function muscleStatus(opts){
  const {load,raw,last}=muscleLoad(opts), band=loadBand(), out={}, sore=soreRecent(48);
  Object.keys(MUSCLES).forEach(m=>{
    const L=load[m], r=raw[m];
    const k = L<.4?"none": L<band.lo*.5?"light": L<band.lo?"building": L<=band.hi?"good": L<=band.hi*1.35?"high":"over";
    const recovering = (last[m]!==null && last[m]<1.5 && L>=band.lo*.45) || !!sore[m];
    out[m]={k,L,raw:r,last:last[m],recovering,sore:sore[m]?.l||0,color:k==="none"?null:loadColor(L,band)};
  });
  return {mus:out,band};
}
/* levels object for bodyFig: colour per muscle, ranked so the strongest colour wins on shared areas */
const RANK={none:0,light:1,building:2,good:3,high:4,over:5};
function statusLevels(st){ const o={}; Object.entries(st.mus).forEach(([m,v])=>{ if(v.k!=="none") o[m]={col:v.color,rank:RANK[v.k]}; }); return o; }
const mNames = ms => { const n=ms.map((m,i)=>{ const t=MUSCLES[m]?.n||m; return i?t.toLowerCase():t; }); return n.length<=1?(n[0]||""):n.slice(0,-1).join(", ")+" and "+n.at(-1); };
/* the plain-language read on the body: what needs work, what's recovering, what's overdone */
const BIG = ["chest","lats","upper_back","shoulders","quads","hamstrings","glutes"];
function bodyInsight(st){
  const m=st.mus;
  const over=Object.keys(m).filter(k=>m[k].k==="over"), high=Object.keys(m).filter(k=>m[k].k==="high");
  const rec=Object.keys(m).filter(k=>m[k].recovering&&!over.includes(k));
  const needs=BIG.filter(k=>["none","light"].includes(m[k].k)&&!m[k].recovering);
  const good=Object.keys(m).filter(k=>m[k].k==="good");
  return {over,high,rec,needs,good};
}
function insightLines(ins){
  const row=(c,h,t,sub)=>`<li><i class="dot" style="background:${c}"></i><span><b>${h}</b> ${esc(t)}${sub?` <span class="muted">${esc(sub)}</span>`:""}</span></li>`;
  const out=[];
  if(ins.needs.length) out.push(row("#3D7DFF","Could use more:",mNames(ins.needs.slice(0,4))+".","Little in the last 7 days."));
  if(ins.rec.length) out.push(row("#F2A516","Recovering:",mNames(ins.rec.slice(0,4))+".","Trained in the last day or sore."));
  if(ins.over.length) out.push(row("#E5484D","Overworked:",mNames(ins.over)+".","Rest them a few days."));
  if(ins.good.length&&out.length<3) out.push(row("#12A365","Right amount:",mNames(ins.good.slice(0,4))+".",""));
  if(!out.length) out.push(row("#C9D7FF","Fresh start.","Nothing logged in the last 7 days.",""));
  return `<ul class="insight">${out.join("")}</ul>`;
}
function loadLegend(){
  const band=loadBand();
  return `<div class="loadkey"><div class="loadbar" style="background:linear-gradient(90deg,${loadColor(band.lo*.2,band)},${loadColor(band.lo*.8,band)},${loadColor((band.lo+band.hi)/2,band)},${loadColor(band.hi*1.25,band)},${loadColor(band.hi*2,band)})"></div>
    <div class="loadlbl"><span>Light</span><span>Right amount</span><span>Overworked</span></div></div>`;
}

/* ---------- plan adjustments ----------
   Before a planned workout, each exercise's set count is nudged by how its main muscles stand this week. */
function planAdjust(day,res,ph,st){
  st=st||muscleStatus({noActive:true});
  const adj=[], ret=returnState(); /* after a break everything looks "under-trained"; don't add sets then */
  res.ex.forEach((id,i)=>{
    const e=EX[id]; if(!e) return;
    const base=setsFor(day,day.ex[i],ph); let n=base, type="", mus=[];
    const prim=e.m.filter(m=>st.mus[m]);
    const over=prim.filter(m=>st.mus[m].k==="over"), rec=prim.filter(m=>st.mus[m].recovering), high=prim.filter(m=>st.mus[m].k==="high");
    const low=prim.length&&prim.every(m=>["none","light"].includes(st.mus[m].k)&&!st.mus[m].recovering);
    if(over.length){ n=Math.max(1,base-1); type="over"; mus=over; }
    else if(rec.length&&base>1){ n=base-1; type="rec"; mus=rec; }
    else if(high.length&&base>2){ n=base-1; type="high"; mus=high; }
    if(n!==base) adj.push({ex:id,from:base,to:n,type,mus,why:ADJ_WHY[type](mus)});
  });
  return adj;
}
const ADJ_WHY={
  over:m=>`${mNames(m)}: already overworked in the last 7 days.`,
  rec:m=>`${mNames(m)}: still recovering (trained in the last day or reported sore).`,
  high:m=>`${mNames(m)}: already had a lot in the last 7 days.`,
  low:m=>`${mNames(m)}: little or no work this week.`
};
const ADJ_HEAD={low:"One extra set",rec:"One set less",over:"One set less",high:"One set less"};
/* group the changes so the explanation stays short */
function adjustLines(list){
  const groups={};
  (list||[]).forEach(a=>{ if(!EX[a.ex]) return; const t=a.type||(a.to>a.from?"low":"rec"); (groups[t]=groups[t]||{ex:[],mus:new Set()}); groups[t].ex.push(EX[a.ex].n); (a.mus||[]).forEach(m=>groups[t].mus.add(m)); });
  return ["low","rec","high","over"].filter(t=>groups[t]).map(t=>{ const g=groups[t];
    return `<li><b>${ADJ_HEAD[t]}:</b> ${esc(g.ex.join(", "))}. <span class="muted">${esc(ADJ_WHY[t]([...g.mus]))}</span></li>`; });
}
/* ---------- prefill from last time ----------
   Each set starts from the matching set last time (set 2 from set 2…), with the level-up applied. */
function plannedSets(id,n,wf){
  const e=EX[id], t=targetFor(id), last=lastSetsFor(id,S.active?.id), out=[];
  for(let j=0;j<n;j++){
    const ls=last?.sets[Math.min(j,last.sets.length-1)];
    let w=t.w===""?"":t.w, r=t.r;
    if(ls&&!t.up){
      if(e.inc>0&&+ls.w>0) w=+ls.w;
      const lr=+ls.r||0; if(lr>0) r=Math.min(Math.max(lr+1,e.r[0]),e.r[1]);
    }
    if(e.inc===0) w=0; else w=applyWf(id,w,wf??returnState()?.factor);
    out.push({k:uid(),ex:id,w,r,pw:w,rir:"",done:false});
  }
  return out;
}
function lastTimeLine(id){
  const e=EX[id], last=lastSetsFor(id,S.active?.id); if(!last) return "";
  const u=e.timed?"s":"";
  const sets=last.sets.map(s=>`${e.inc===0?"":fmtKg(s.w)+"×"}${s.r}${u}`).join(" · ");
  return `<p class="lasttime"><span>Last time · ${esc(fmtDate(last.date))}</span><b class="num">${esc(sets)}${e.inc===0?"":" kg"}</b></p>`;
}

/* ---------- debriefs ---------- */
function preBrief(w,day){
  const ph=phaseFor(w.n??currentWeek()), st=muscleStatus({skipId:w.id}), ins=bodyInsight(st), free=w.dayId==="free";
  const items=[];
  if(free) items.push(`<li><b>Your own workout${(w.plan||[]).length?": "+esc(w.plan.join(" + ")):""}.</b> Starts empty. Add each exercise as you get to it. The warm-up matches what you picked.</li>`);
  items.push(`<li><b>${esc(ph.name)}:</b> ${free?"":day.custom||ph.sets<3?`${ph.sets} sets each, `:`${ph.sets} sets on the three main lifts, 2 on the finishers, `}stop each set with ${esc(ph.rir)} reps left in the tank. <span class="muted">Trainers call this reps in reserve.</span></li>`);
  (w.learn||[]).forEach(n=>items.push(`<li>${n.t}</li>`));
  items.push(...adjustLines(w.adjust));
  const gear=Object.entries(w.swaps||{}).filter(([nw,orig])=>EX[nw]&&EX[orig]&&!(w.userSwaps||{})[nw]);
  if(gear.length) items.push(`<li><b>Swapped for your gym:</b> ${esc(gear.map(([nw,orig])=>`${EX[nw].n} instead of ${EX[orig].n}`).join(", "))}.</li>`);
  const ups=day.ex.filter(id=>targetFor(id).up);
  if(ups.length) items.push(`<li><b>Weight goes up:</b> ${esc(ups.map(id=>`${EX[id].n} (${targetFor(id).short.split(" · ")[0]})`).join(", "))}. <span class="muted">Every set hit the top of the range last time.</span></li>`);
  if(free&&!(w.plan||[]).length&&ins.needs.length) items.push(`<li><b>Good picks today:</b> ${esc(mNames(ins.needs.slice(0,3)))}. <span class="muted">Least work in the last 7 days. Worth telling your trainer.</span></li>`);
  if(free&&ins.rec.length) items.push(`<li><b>Go easier on:</b> ${esc(mNames(ins.rec.slice(0,3)))}. <span class="muted">Trained in the last day.</span></li>`);
  return `<details class="brief" ${S.briefShut?"":"open"}><summary><span class="eyebrow">Before you start</span><b>Today's plan, explained</b><span class="chev">›</span></summary>
    <ul>${items.join("")}</ul>
    <div class="brief-map">${bodyFig(free?ownLevels(w):plannedLevels(w),{cls:"mini"})}<div><p class="small" style="margin:0 0 4px"><b>What today works</b></p><p class="tiny muted" style="margin:0">${free?"Your plan for now. Fills in as you add exercises.":"Darker means more sets."}</p></div></div></details>`;
}
/* compare each exercise with last time and say what happens next time, and why */
function postBrief(w){
  const done=(w.sets||[]).filter(s=>s.done), ids=[...new Set(done.map(s=>s.ex))].filter(id=>EX[id]);
  if(!ids.length) return "";
  const rows=ids.map(id=>{
    const e=EX[id], ss=done.filter(s=>s.ex===id), last=lastSetsFor(id,w.id), u=e.timed?"s":"", bw=e.inc===0;
    const best=ss.reduce((a,s)=>e1rm(+s.w||0,+s.r||0)>e1rm(+a.w||0,+a.r||0)?s:a,ss[0]);
    const topW=Math.max(...ss.map(s=>+s.w||0)), topR=Math.max(...ss.map(s=>+s.r||0));
    let now="", tag="";
    if(!last){ now="First time logged. This is your starting point."; tag="new"; }
    else {
      const lw=Math.max(...last.sets.map(s=>+s.w||0)), lr=Math.max(...last.sets.map(s=>+s.r||0));
      if(bw){ now=topR>lr?`Best ${topR}${u}, up from ${lr}${u}.`:topR<lr?`Best ${topR}${u}, last time ${lr}${u}.`:`Matched last time: ${topR}${u}.`; tag=topR>lr?"up":topR<lr?"down":"same"; }
      else if(topW>lw){ now=`Up to ${fmtKg(topW)} kg from ${fmtKg(lw)} kg.`; tag="up"; }
      else if(topW<lw){ now=`${fmtKg(topW)} kg, lighter than last time's ${fmtKg(lw)} kg.`; tag="down"; }
      else { const lrs=last.sets.reduce((a,s)=>a+(+s.r||0),0), rs=ss.reduce((a,s)=>a+(+s.r||0),0); now=rs>lrs?`Same ${fmtKg(topW)} kg, ${rs-lrs} more reps in total.`:rs<lrs?`Same ${fmtKg(topW)} kg, ${lrs-rs} fewer reps.`:`Same as last time: ${fmtKg(topW)} kg.`; tag=rs>lrs?"up":rs<lrs?"down":"same"; }
    }
    /* next time, using the same rule the app will apply */
    const atTop=ss.filter(s=>(+s.w||0)===topW), allTop=atTop.length>=Math.min(2,ss.length)&&atTop.every(s=>(+s.r||0)>=e.r[1]);
    const tough=ss.some(s=>s.feel==="tough"&&(+s.r||0)<e.r[0]), easy=ss.filter(s=>s.feel==="easy").length>=Math.ceil(ss.length/2);
    let next;
    if(bw) next=allTop?`Next time: aim past ${e.r[1]}${u}, you hit the top of the range.`:`Next time: one more ${e.timed?"second or two":"rep"} per set.`;
    else if(allTop||easy) next=`Next time: ${fmtKg(topW+wStep(id))} kg. ${allTop?`Every set reached ${e.r[1]} reps, the top of the range,`:"Most sets felt easy,"} so it's time to add weight.`;
    else if(tough) next=`Next time: stay at ${fmtKg(topW)} kg. Some sets fell short of ${e.r[0]} reps, so build reps first.`;
    else next=`Next time: ${fmtKg(topW)} kg again, one more rep per set. Weight goes up once every set hits ${e.r[1]}.`;
    const arrow={up:"↑",down:"↓",same:"=",new:"★"}[tag];
    return `<li><div class="pb-h"><b>${esc(e.n)}</b><span class="pb-t t-${tag}">${arrow}</span></div><span>${esc(now)}</span><span class="muted">${esc(next)}</span></li>`;
  }).join("");
  const st=muscleStatus(), ins=bodyInsight(st);
  return `<section class="card brief post"><div class="eyebrow">Debrief</div><h3>What happened, and what's next</h3>
    <ul class="pblist">${rows}</ul>
    <div class="brief-map">${bodyFig(statusLevels(st),{cls:"mini"})}<div><p class="small muted" style="margin:0 0 6px">Your muscles over the last 7 days, including today</p>${insightLines(ins)}</div></div>
    <p class="tiny muted">Your next workout eases off anything that is still recovering or overworked. It never piles extra sets on.</p></section>`;
}

/* ---------- swap ---------- */
function swapOptions(id){
  const e=EX[id], g=availSet(), list=S.active?sessionDay(S.active).ex:[];
  const prim=e.m[0], out=[];
  (e.alts||[]).forEach(a=>{ if(EX[a]&&!list.includes(a)) out.push(a); });
  Object.keys(EX).forEach(k=>{ const x=EX[k]; if(k===id||out.includes(k)||list.includes(k)||x.placeholder) return; if(prim&&x.m.includes(prim)) out.push(k); });
  return out.filter(k=>!atHome()||exOK(k,g)).sort((a,b)=>(exOK(b,g)-exOK(a,g))||((e.alts||[]).includes(b)-(e.alts||[]).includes(a))).slice(0,6);
}
function swapSheet(i){
  const w=S.active, day=sessionDay(w), id=day.ex[i], e=EX[id]; if(!e) return;
  const opts=swapOptions(id), orig=w.swaps?.[id];
  const rows=opts.map(k=>{ const x=EX[k], ok=exOK(k);
    return `<button class="swaprow" data-act="swap-to" data-i="${i}" data-to="${esc(k)}">${x.lib&&x.lc!=null?`<img src="${photoSrc(x.lib,0)}" alt="" loading="lazy" onerror="phErr(this)">`:`<span class="swfig">${bodyFig(exLevels(k),{cls:"mini"})}</span>`}
      <span class="tt"><b>${esc(x.n)}</b><small>${esc(x.m.map(m=>MUSCLES[m]?.n).join(", "))}${x.eq?" · "+esc(x.eq):""}${ok?"":" · not in My gym"}</small></span><span class="chev">›</span></button>`; }).join("");
  openSheet(`<div class="stack-l"><div><div class="eyebrow">Swap</div><h2>Instead of ${esc(e.n)}</h2><p class="small muted">Same main muscle${e.m[0]?" ("+esc(MUSCLES[e.m[0]]?.n||"")+")":""}. Logged sets stay in your history and you can swap back any time.</p></div>
    ${orig&&EX[orig]?`<button class="btn block" data-act="swap-to" data-i="${i}" data-to="${esc(orig)}">↺ Swap back to ${esc(EX[orig].n)}</button>`:""}
    ${e.swap&&!/^ask|easier|both legs|hands on|bend your/i.test(e.swap)&&!opts.some(k=>EX[k].n.toLowerCase()===e.swap.toLowerCase())?`<p class="tiny muted">Suggested: ${esc(e.swap)}</p>`:""}
    <div class="swaplist">${rows||`<p class="small muted">No close match saved. Search the library instead.</p>`}</div>
    <button class="btn block" data-act="swap-lib" data-i="${i}">Search the library</button>
    <button class="btn ghost block" data-act="close-sheet">Cancel</button></div>`);
}
function replaceEx(i,to){
  const w=S.active, ex=[...sessionDay(w).ex], from=ex[i]; if(!from||!EX[to]||from===to) return;
  if(ex.includes(to)){ toast("Already in this workout"); return; }
  const ph=phaseFor(w.n??currentWeek());
  const undone=w.sets.filter(s=>s.ex===from&&!s.done).length, doneN=w.sets.filter(s=>s.ex===from&&s.done).length;
  const n=undone||(doneN?0:ph.sets)||ph.sets;
  w.sets=w.sets.filter(s=>s.ex!==from||s.done);
  ex[i]=to; w.exList=ex;
  w.sets.push(...plannedSets(to,Math.max(1,n)));
  w.swaps=w.swaps||{}; w.userSwaps=w.userSwaps||{};
  const root=w.swaps[from]||from; delete w.swaps[from]; delete w.userSwaps[from];
  if(to!==root){ w.swaps[to]=root; w.userSwaps[to]=true; }
  w.missing=(w.missing||[]).filter(x=>x!==from);
  w.groups=(w.groups||[]).map(g=>g.map(x=>x===from?to:x));
  w.adjust=(w.adjust||[]).filter(a=>a.ex!==from);
  S.hint=""; closeSheet(); render(); saveActiveSoon();
  toast(to===root?`Back to ${EX[to].n}`:`Swapped to ${EX[to].n}`);
}

/* ---------- timer chime ----------
   A short soft two-note chime, made in code. Played through an <audio> element (unlocked on the first tap)
   so it isn't blocked when it fires later from the timer. */
let chimeEl=null, chimeReady=false;
function chimeURL(){
  const sr=22050, dur=.9, n=Math.floor(sr*dur), data=new Int16Array(n);
  const notes=[[880,0],[1318.5,.16]];
  for(let i=0;i<n;i++){ const t=i/sr; let v=0; notes.forEach(([f,st])=>{ const tt=t-st; if(tt>=0){ const env=Math.min(1,tt/.008)*Math.exp(-tt*5.5); v+=Math.sin(2*Math.PI*f*tt)*env*.32+Math.sin(4*Math.PI*f*tt)*env*.05; } }); data[i]=Math.max(-1,Math.min(1,v))*32767; }
  const buf=new ArrayBuffer(44+n*2), dv=new DataView(buf), wr=(o,s)=>[...s].forEach((c,i)=>dv.setUint8(o+i,c.charCodeAt(0)));
  wr(0,"RIFF"); dv.setUint32(4,36+n*2,true); wr(8,"WAVE"); wr(12,"fmt "); dv.setUint32(16,16,true); dv.setUint16(20,1,true); dv.setUint16(22,1,true);
  dv.setUint32(24,sr,true); dv.setUint32(28,sr*2,true); dv.setUint16(32,2,true); dv.setUint16(34,16,true); wr(36,"data"); dv.setUint32(40,n*2,true);
  new Int16Array(buf,44).set(data);
  return URL.createObjectURL(new Blob([buf],{type:"audio/wav"}));
}
function unlockChime(){
  if(chimeReady) return;
  try{ chimeEl=chimeEl||new Audio(chimeURL()); chimeEl.preload="auto"; chimeEl.muted=true;
    const p=chimeEl.play(); if(p&&p.then) p.then(()=>{ chimeEl.pause(); chimeEl.currentTime=0; chimeEl.muted=false; chimeReady=true; }).catch(()=>{ chimeEl.muted=false; });
    else { chimeEl.pause(); chimeEl.muted=false; chimeReady=true; } }catch(e){}
}
function chime(){
  try{ if(chimeEl){ chimeEl.muted=false; chimeEl.currentTime=0; const p=chimeEl.play(); if(p&&p.catch) p.catch(()=>{}); } }catch(e){}
  try{ navigator.vibrate&&navigator.vibrate([120,80,120]); }catch(e){}
}
addEventListener("pointerdown",unlockChime,{capture:true,passive:true});

/* ---------- iOS home-screen app: keep the bottom bar pinned after the keyboard closes ---------- */
(function(){
  const vv=window.visualViewport; if(!vv) return;
  const root=document.documentElement;
  const fix=()=>{
    const gap=window.innerHeight-vv.height-vv.offsetTop;
    const kb=gap>120; /* keyboard open */
    root.classList.toggle("kb",kb);
    root.style.setProperty("--vvfix",kb?"0px":Math.min(0,Math.round(gap))+"px");
  };
  vv.addEventListener("resize",fix); vv.addEventListener("scroll",fix); addEventListener("orientationchange",()=>setTimeout(fix,300));
  /* after typing, iOS sometimes leaves the page shifted: nudge it back */
  document.addEventListener("focusout",e=>{ if(/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||"")) setTimeout(()=>{ if(!/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||"")){ window.scrollTo(window.scrollX,window.scrollY); fix(); } },120); });
  fix();
})();

/* ---------- workout maps: only the muscles worked, darker = more sets ---------- */
function setsPerMuscle(pairs){ const c={}; pairs.forEach(([id,n])=>{ const e=EX[id]; if(!e) return; e.m.forEach(m=>c[m]=(c[m]||0)+n); e.s.forEach(m=>c[m]=(c[m]||0)+n/2); }); return c; }
function intensityLevels(cnt){ const o={}; Object.entries(cnt).forEach(([m,n])=>{ if(n>0) o[m]=Math.min(1,.15+n/6*.85); }); return o; }
const doneLevels = w => intensityLevels(setsPerMuscle((w.sets||[]).filter(s=>s.done).map(s=>[s.ex,1])));
const plannedLevels = w => intensityLevels(setsPerMuscle(sessionDay(w).ex.map(id=>[id,(w.sets||[]).filter(s=>s.ex===id).length||1])));
function intensityKey(){ return `<div class="heatkey"><span><i style="background:${fillFor(.2)}"></i>A little</span><span><i style="background:${fillFor(1)}"></i>A lot · 6+ sets</span></div>`; }

/* ---------- past workout: full view ---------- */
function workoutDetail(wid){
  const w=S.workouts.find(x=>x.id===wid); if(!w) return;
  S.detailId=wid;
  const done=(w.sets||[]).filter(s=>s.done), ids=[...new Set(done.map(s=>s.ex))];
  const can=S.dbState==="on"&&S.canWrite, saved=S.savedAs.has(w.id);
  const start=Date.parse(w.startedAt||""), end=Date.parse(w.finishedAt||"");
  const mins=w.durationMin||(isFinite(start)&&isFinite(end)?Math.max(1,Math.round((end-start)/6e4)):null);
  const time=isFinite(start)?new Date(start).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"}):"";
  const vol=done.reduce((a,s)=>a+(+s.w||0)*(+s.r||0)*(EX[s.ex]&&perHand(EX[s.ex])?2:1),0);
  const cnt=setsPerMuscle(done.map(s=>[s.ex,1]));
  const musRows=Object.entries(cnt).filter(([,n])=>n>=1).sort((a,b)=>b[1]-a[1]).map(([m,n])=>`<span class="mchip on">${esc(MUSCLES[m]?.n||m)} <b class="num">${Number.isInteger(n)?n:n.toFixed(1)}</b></span>`).join("");
  const feelTxt={4:"Easy",7:"Just right",9:"Brutal"}[w.rpe];
  const exCards=ids.map(id=>{
    const e=EX[id]; if(!e) return "";
    const ss=done.filter(s=>s.ex===id), bw=e.inc===0, u=e.timed?"s":"";
    const prev=(()=>{ for(const x of doneWorkouts()){ if(x.id===w.id) continue; if((x.date+(x.finishedAt||""))>=(w.date+(w.finishedAt||""))) continue; const p=(x.sets||[]).filter(s=>s.ex===id&&s.done); if(p.length) return {date:x.date,sets:p}; } return null; })();
    const top=Math.max(...ss.map(s=>bw?+s.r||0:+s.w||0)), ptop=prev?Math.max(...prev.sets.map(s=>bw?+s.r||0:+s.w||0)):null;
    const tag=prev==null?["new","★ First time"]:top>ptop?["up",`↑ from ${bw?ptop+u:fmtKg(ptop)+" kg"}`]:top<ptop?["down",`↓ from ${bw?ptop+u:fmtKg(ptop)+" kg"}`]:["same","= same as last time"];
    const thumb=e.lib&&e.lc!=null?`<img src="${photoSrc(e.lib,1)}" alt="" loading="lazy" onerror="phErr(this)">`:`<span class="swfig">${bodyFig(exLevels(id),{cls:"mini"})}</span>`;
    return `<div class="wdex"><button class="wdex-h" data-act="ex-info" data-ex="${esc(id)}">${thumb}<span class="tt"><b>${esc(e.n)}</b><small>${esc(e.m.map(m=>MUSCLES[m]?.n).join(", "))}</small></span><span class="pb-t t-${tag[0]}" title="${esc(tag[1])}">${{new:"★",up:"↑",down:"↓",same:"="}[tag[0]]}</span></button>
      <div class="wdsets">${ss.map((s,i)=>`<span class="wdset"><i class="num">${i+1}</i><b class="num">${bw?"":fmtKg(s.w)+" kg × "}${s.r}${u}</b>${s.feel?`<span class="dotf f-${s.feel}" title="${esc(s.feel)}"></span>`:""}</span>`).join("")}</div>
      <p class="tiny muted">${esc(tag[1])}${prev?` (${fmtDate(prev.date)})`:""}${!bw&&perHand(e)?" · kg per dumbbell":""}</p></div>`;
  }).join("");
  openSheet(`<div class="stack-l wdetail">
    <div><div class="eyebrow">${esc(fmtDate(w.date))}${time?" · "+esc(time):""}</div><h2>${esc(histName(w))}</h2></div>
    <div class="facts"><div><b>${mins??"–"}</b><span>minutes</span></div><div><b>${done.length}</b><span>sets</span></div><div><b>${vol?Math.round(vol).toLocaleString():ids.length}</b><span>${vol?"kg lifted":"exercises"}</span></div></div>
    ${feelTxt?`<p class="small"><b>Felt:</b> ${feelTxt}</p>`:""}
    <div class="figcard">${bodyFig(sessionGrad(w))}${sessionKey()}<div class="mchips">${musRows}</div><p class="tiny muted center">Sets per muscle · helpers count half</p></div>
    ${soreMuscles(w).length&&S.canWrite?`<div class="card sorecard"><h3>Soreness after</h3><p class="small muted" style="margin:0">${w.soreAt?`Logged ${esc(fmtDate(w.soreAt.slice(0,10)))}. `:""}Tap once for a bit sore, twice for very sore.</p>${soreChips(w,S.soreDraft?.[w.id])}<div class="row"><button class="btn" data-act="sore-save" data-id="${esc(w.id)}">Save soreness</button></div></div>`:""}
    ${hrDetail(w)}
    <div><h3>Exercises</h3><div class="wdlist">${exCards||`<p class="small muted">No sets logged.</p>`}</div></div>
    ${w.notes?`<div class="note">“${esc(w.notes)}”</div>`:""}
    ${done.length&&can?`<div class="row"><button class="btn" data-act="redo" data-id="${esc(w.id)}">↻ Do again</button><button class="btn" data-act="save-as-day" data-id="${esc(w.id)}" ${saved?"disabled":""}>${saved?"Saved ✓":"Save as a workout"}</button></div>`:""}
    ${S.canWrite?`<div class="row"><button class="pill" data-act="ed-open" data-id="${esc(w.id)}">✎ Edit</button><button class="link" data-act="del-workout" data-id="${esc(w.id)}">Delete</button></div>`:""}
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}

/* ---------- My own workout: starts empty; you pick what you plan to train ---------- */
const OWN_GROUPS = [["Legs",["quads","hamstrings","calves"]],["Glutes",["glutes"]],["Chest",["chest"]],["Back",["lats","upper_back","lower_back"]],["Shoulders",["shoulders","rear_delts"]],["Arms",["biceps","triceps"]],["Core",["abs"]]];
const OWN_WARM = {
  Legs:["Bodyweight squats × 10","Leg swings, 10 each leg"],
  Glutes:["Glute bridges × 10","Hip circles, 5 each way"],
  Chest:["Wall or incline push-ups × 10","Arm swings across the chest × 15"],
  Back:["Cat-cow × 8","Band pull-aparts or arm pulls back × 15"],
  Shoulders:["Arm circles, 10 each way","Shoulder rolls × 10"],
  Arms:["Wrist and elbow circles, 10 each way","Light curls or arm swings × 15"],
  Core:["Dead bug × 6 each side","Bird dog × 6 each side"]
};
const OWN_BASE = ["Cat-cow × 8","Arm circles, 10 each way","Bodyweight squats × 10"];
function ownWarm(groups){
  const g=(groups||[]).filter(x=>OWN_WARM[x]);
  if(!g.length) return OWN_BASE.concat(["Leg swings, 10 each leg","Glute bridges × 10"]);
  const out=[]; g.forEach(x=>OWN_WARM[x].forEach(t=>{ if(!out.includes(t)) out.push(t); }));
  return out.slice(0,6);
}
const ownMuscles = groups => (groups||[]).flatMap(g=>(OWN_GROUPS.find(x=>x[0]===g)||[0,[]])[1]);
function ownLevels(w){
  const done=(w.sets||[]).some(s=>s.done)||(w.exList||[]).length;
  if(done) return plannedLevels(w);
  const o={}; ownMuscles(w.plan).forEach(m=>o[m]=.3); return o;
}
/* a few good first picks for the planned groups, from your program and what you've done before */
function ownSuggest(w,n=6){
  const mus=new Set(ownMuscles(w.plan)); if(!mus.size) return [];
  const have=new Set(sessionDay(w).ex), g=availSet(), seen=new Set(doneWorkouts().flatMap(x=>(x.sets||[]).filter(s=>s.done).map(s=>s.ex)));
  return Object.keys(EX).filter(k=>{ const e=EX[k]; return !e.placeholder&&!have.has(k)&&e.m.some(m=>mus.has(m))&&exOK(k,g)&&(atHome()?e.home||e.inc===0:!e.home); })
    .sort((a,b)=>(seen.has(b)-seen.has(a))||((EX[b].lib?1:0)-(EX[a].lib?1:0))).slice(0,n);
}
function ownCard(can){
  const sel=new Set(S.ownGroups||S.settings?.ownGroups||[]);
  return `<section class="card owncard"><div class="eyebrow">Or</div><h3>My own workout</h3>
    <p class="small muted" style="margin:0">Start empty and add each exercise as you do it. What are you planning to train?</p>
    <div class="mchips">${OWN_GROUPS.map(([g])=>`<button class="mchip ${sel.has(g)?"on":""}" data-act="own-g" data-g="${g}" aria-pressed="${sel.has(g)}">${g}</button>`).join("")}</div>
    <button class="btn block ${sel.size?"primary":""}" data-act="own-start" ${can?"":"disabled"}>${sel.size?`Start · ${[...sel].join(" + ")}`:"Start without a plan"}</button></section>`;
}

/* ---------- inside one workout: same blue → green → red scale, judged per session ----------
   Roughly 2–5 sets per muscle in one workout while easing back in (3–8 when building) is the useful range;
   past that, extra sets add tiredness more than results. */
function sessionBand(){ const ph=phaseFor(currentWeek()); return ph.key==="build"?{lo:3,hi:8,ph}:{lo:2,hi:5,ph}; }
function sessionCounts(w){ const c={}; (w.sets||[]).filter(s=>s.done).forEach(s=>{ const e=EX[s.ex]; if(!e) return; e.m.forEach(m=>c[m]=(c[m]||0)+1); e.s.forEach(m=>c[m]=(c[m]||0)+.5); }); return c; }
function sessionKind(n,b){ return n<b.lo*.5?"light":n<b.lo?"building":n<=b.hi?"good":n<=b.hi*1.35?"high":"over"; }
function sessionGrad(w,withPlan){
  const b=sessionBand(), c=sessionCounts(w), lv={};
  Object.entries(c).forEach(([m,n])=>{ if(n>0){ const k=sessionKind(n,b); lv[m]={col:loadColor(n,b),rank:RANK[k]}; } });
  if(withPlan) sessionDay(w).ex.forEach(id=>{ const e=EX[id]; if(!e) return; [...e.m,...e.s].forEach(m=>{ if(!lv[m]) lv[m]="plan"; }); });
  return lv;
}
function sessionKey(plan){
  const b=sessionBand();
  return `<div class="loadkey"><div class="loadbar" style="background:linear-gradient(90deg,${loadColor(b.lo*.2,b)},${loadColor(b.lo*.8,b)},${loadColor((b.lo+b.hi)/2,b)},${loadColor(b.hi*1.25,b)},${loadColor(b.hi*2,b)})"></div>
    <div class="loadlbl"><span>A little</span><span>Right amount</span><span>Too much</span></div>${plan?`<div class="heatkey" style="margin-top:4px"><span><i style="background:var(--m-plan)"></i>Still to do</span></div>`:""}</div>`;
}
/* one plain line: which muscles have had enough today */
function sessionLine(w){
  const b=sessionBand(), c=sessionCounts(w), by={good:[],high:[],over:[]};
  Object.entries(c).forEach(([m,n])=>{ const k=sessionKind(n,b); if(by[k]) by[k].push(m); });
  const out=[];
  if(by.over.length) out.push(`<b style="color:#E5484D">Too much:</b> ${esc(mNames(by.over))}. More sets now mostly add fatigue.`);
  if(by.high.length) out.push(`<b style="color:#C98500">Plenty:</b> ${esc(mNames(by.high))}.`);
  if(by.good.length) out.push(`<b style="color:#12A365">Right amount:</b> ${esc(mNames(by.good))}.`);
  return out.length?`<p class="small" style="margin:6px 0 0">${out.join(" ")}</p>`:"";
}

/* ---------- soreness check-in ----------
   Saved on the workout as sore:{muscle:1|2} (1 = a bit, 2 = very). Sore muscles count as still recovering,
   so the next planned workout gives them a set less, and the brief says why. */
const SORE_TXT=["","A bit sore","Very sore"];
function soreRecent(hours=72){
  const now=Date.now(), out={};
  doneWorkouts().forEach(w=>{ const t=Date.parse(w.soreAt||""); if(!w.sore||!isFinite(t)||now-t>hours*36e5) return; Object.entries(w.sore).forEach(([m,l])=>{ if(l>0&&(!out[m]||l>out[m].l)) out[m]={l,at:t}; }); });
  return out;
}
const soreMuscles = w => { const c=sessionCounts(w); return Object.keys(MUSCLES).filter(m=>c[m]>=1); };
function soreChips(w,draft){
  const cur=draft||w.sore||{};
  return `<div class="mchips sorechips">${soreMuscles(w).map(m=>{ const l=cur[m]||0; return `<button class="mchip sore-${l}" data-act="sore-t" data-id="${esc(w.id)}" data-m="${m}">${esc(MUSCLES[m].n)}${l?` · ${l===2?"very":"a bit"}`:""}</button>`; }).join("")}</div>`;
}
/* Home card: shows for 2 days after a workout until answered */
function soreCard(){
  const now=Date.now();
  const w=doneWorkouts().find(x=>{ const t=Date.parse(x.finishedAt||""); return isFinite(t)&&now-t<48*36e5&&now-t>2*36e5; });
  if(!w||!soreMuscles(w).length) return "";
  const t=Date.parse(w.finishedAt), when=new Date(t).toDateString()===new Date().toDateString()?"earlier today":"yesterday";
  const asked=w.soreAt&&now-Date.parse(w.soreAt)<12*36e5;
  if(asked&&!S.soreOpen) return "";
  const draft=S.soreDraft?.[w.id];
  return `<section class="card sorecard"><div class="eyebrow">Check-in</div><h3>Anything sore from ${esc(when)}'s workout?</h3>
    <p class="small muted" style="margin:0">Tap once for a bit sore, twice for very sore. Sore muscles get a lighter next session.</p>
    ${soreChips(w,draft)}
    <div class="row"><button class="btn primary" data-act="sore-save" data-id="${esc(w.id)}">Save</button><button class="btn" data-act="sore-none" data-id="${esc(w.id)}">Nothing's sore</button></div></section>`;
}
async function saveSore(id,sore){
  const w=S.workouts.find(x=>x.id===id); if(!w) return;
  const clean=Object.fromEntries(Object.entries(sore||{}).filter(([,l])=>l>0));
  const upd={...w,sore:clean,soreAt:new Date().toISOString()};
  const {id:_,...body}=upd;
  try{ await Store.put("workouts",id,body); S.workouts=S.workouts.map(x=>x.id===id?upd:x); if(S.soreDraft) delete S.soreDraft[id]; S.soreOpen=false; render(); if(S.detailId===id) workoutDetail(id);
    toast(Object.keys(clean).length?"Saved. Next session goes easier on "+mNames(Object.keys(clean)).toLowerCase():"Saved. All good"); }
  catch(e){ toast("Couldn't save. Try again."); }
}

/* =====================================================================================
   LEARNING LAYER: reads your history and adjusts. Everything here is plain rules on your
   own data (no AI), and every change it makes is explained in the before-you-start brief.
   ===================================================================================== */

/* time off: days since the last finished workout */
function daysOff(){ const w=doneWorkouts().find(x=>x.id!==S.active?.id); if(!w) return null; return Math.max(0,daysBetween(w.date,todayISO())); }
/* sessions finished since coming back from a break of 10+ days (to ease in over 1–2 sessions) */
function returnState(){
  const ws=doneWorkouts().filter(x=>x.id!==S.active?.id).slice().reverse(); /* oldest first */
  const off=daysOff(); if(off===null) return null;
  if(off>=10) return {off,since:0,factor:off>=21?.85:.9,sessions:off>=21?2:1};
  /* already back: find the last 10+ day gap and count sessions after it */
  for(let i=ws.length-1;i>0;i--){ const gap=daysBetween(ws[i-1].date,ws[i].date); if(gap>=10){ const since=ws.length-i; const sessions=gap>=21?2:1; return since<sessions?{off:gap,since,factor:gap>=21?.9:1,sessions}:null; } }
  return null;
}
/* your own effort scale, per exercise: how your Easy / Good / Tough taps trend at a weight */
function feelTrend(id,n=3){
  const out=[]; for(const w of doneWorkouts()){ if(w.id===S.active?.id) continue; const ss=(w.sets||[]).filter(s=>s.ex===id&&s.done); if(ss.length) out.push(ss); if(out.length>=n) break; }
  const all=out.flat(), f=k=>all.filter(s=>s.feel===k).length;
  return {sessions:out, easy:f("easy"), good:f("good"), tough:f("tough"), n:all.length};
}
/* stalled: 3 sessions in a row with the same top weight and no more total reps */
function stalled(id){
  const e=EX[id]; if(!e||e.inc===0) return false;
  const t=feelTrend(id,3).sessions; if(t.length<3) return false;
  const top=ss=>Math.max(...ss.map(s=>+s.w||0)), reps=ss=>ss.reduce((a,s)=>a+(+s.r||0),0);
  return t.every(ss=>top(ss)===top(t[0])) && reps(t[0])<=reps(t[2]);
}
/* whole-session feel: your last 2–3 "how was it overall" answers */
function sessionFeelTrend(){
  const r=doneWorkouts().filter(w=>w.rpe).slice(0,3).map(w=>w.rpe);
  if(r.length>=2&&r.slice(0,2).every(v=>v>=9)) return "hard";
  if(r.length>=3&&r.every(v=>v<=4)) return "easy";
  return null;
}
/* soreness pattern: for each exercise, how often the muscles it works were reported sore after */
function sorePattern(){
  const by={};
  doneWorkouts().forEach(w=>{ if(!w.soreAt) return; const sore=w.sore||{}; const ids=[...new Set((w.sets||[]).filter(s=>s.done).map(s=>s.ex))];
    ids.forEach(id=>{ const e=EX[id]; if(!e) return; const hit=e.m.some(m=>sore[m]>0); (by[id]=by[id]||{n:0,sore:0}); by[id].n++; if(hit) by[id].sore++; }); });
  return by;
}
/* readiness from Apple Health: short sleep or a raised resting heart rate */
function lowReadiness(){ try{ const r=readiness(); return r&&r.k==="easy"?r:null; }catch(e){ return null; } }

/* the rules, applied to a planned session's sets and weights */
function learnAdjust(ids,baseSets){
  const notes=[], sets={...baseSets}, wf={}, ph=phaseFor(currentWeek());
  const ret=returnState();
  if(ret){ ids.forEach(id=>{ sets[id]=Math.max(1,sets[id]-1); if(ret.factor<1) wf[id]=ret.factor; });
    notes.push({k:"return",t:`<b>Welcome back.</b> ${ret.since?`Session ${ret.since+1} of ${ret.sessions}`:`${ret.off} days off`}, so one set less on everything${ret.factor<1?` and weights about ${Math.round((1-ret.factor)*100)}% lighter`:""}. Your body keeps most of its strength, this just lets the joints catch up.`}); }
  const sf=sessionFeelTrend();
  if(!ret&&sf==="hard"){ const tail=ids.slice(-2); tail.forEach(id=>sets[id]=Math.max(1,sets[id]-1)); notes.push({k:"hard",t:`<b>Last two sessions felt brutal.</b> One set less on the last two exercises today.`}); }
  if(!ret&&sf==="easy"&&ph.key!=="deload"){ ids.slice(0,2).forEach(id=>sets[id]=Math.min(5,sets[id]+1)); notes.push({k:"easy",t:`<b>Your last three sessions felt easy.</b> One extra set on the first two exercises.`}); }
  const rd=lowReadiness();
  if(rd&&!ret){ const tail=ids.slice(-2); tail.forEach(id=>sets[id]=Math.max(1,sets[id]-1)); notes.push({k:"ready",t:`<b>Recovery looks low</b>${rd.sleep!=null&&rd.sleep<6?` (${(+rd.sleep).toFixed(1)} h sleep)`:""}${rd.delta!=null&&rd.delta>=5?` (resting heart rate +${Math.round(rd.delta)})`:""}. One set less on the last two exercises; stop sets at Good.`}); }
  ids.forEach(id=>{ const e=EX[id]; if(!e||e.inc===0) return; const ft=feelTrend(id,2);
    if(ft.n>=4&&ft.tough/ft.n>=.5&&!ret){ wf[id]=Math.min(wf[id]||1,.92); notes.push({k:"tough",id,t:`<b>${esc(e.n)}:</b> most sets felt tough the last two times, so about 8% lighter today to rebuild reps.`}); }
    else if(stalled(id)&&!ret){ wf[id]=Math.min(wf[id]||1,.9); notes.push({k:"stall",id,t:`<b>${esc(e.n)} has stalled</b> for three sessions. Dropping about 10% and building back up usually breaks it. If it stalls again, try a swap.`}); }
  });
  return {sets,wf,notes};
}
/* lighten by a factor, always at least one weight step, never below one step */
const applyWf=(id,w,f)=>{ if(!(f<1)||!(+w>0)) return w; const st=wStep(id); return +Math.max(st,Math.min(Math.round(+w*f/st)*st,+w-st)).toFixed(2); };

/* what the app has learned, in plain words, for the Progress tab */
function learnedCard(){
  const ws=doneWorkouts(); if(ws.length<1) return "";
  const rows=[];
  const off=daysOff(), ret=returnState();
  if(ret) rows.push(`<li><b>Easing back in</b> after ${ret.off} days off: one set less${ret.factor<1?" and lighter weights":""} for ${ret.sessions===2?"two sessions":"one session"}.</li>`);
  else if(off!==null) rows.push(`<li><b>Last workout ${off===0?"today":off===1?"yesterday":off+" days ago"}.</b> Breaks of 10+ days trigger an easier first session back.</li>`);
  const sf=sessionFeelTrend(); if(sf) rows.push(`<li><b>Session feel:</b> recent workouts felt ${sf==="hard"?"brutal, so the next one is trimmed":"easy, so the next one adds a little"}.</li>`);
  const ids=[...new Set(ws.slice(0,8).flatMap(w=>(w.sets||[]).filter(s=>s.done).map(s=>s.ex)))].filter(id=>EX[id]);
  const tough0=new Set(ids.filter(id=>{ const f=feelTrend(id,2); return f.n>=4&&f.tough/f.n>=.5; }));
  const st=ids.filter(id=>stalled(id)&&!tough0.has(id)); if(st.length) rows.push(`<li><b>Stalled:</b> ${esc(st.map(id=>EX[id].n).join(", "))}. Next time drops ~10% to rebuild.</li>`);
  const tough=ids.filter(id=>{ const f=feelTrend(id,2); return f.n>=4&&f.tough/f.n>=.5; }); if(tough.length) rows.push(`<li><b>Feels hard for you:</b> ${esc(tough.map(id=>EX[id].n).join(", "))}. Weight eases off until it feels Good again.</li>`);
  const easy=ids.filter(id=>{ const f=feelTrend(id,2); return f.n>=4&&f.easy/f.n>=.6; }); if(easy.length) rows.push(`<li><b>Feels easy for you:</b> ${esc(easy.map(id=>EX[id].n).join(", "))}. Weight goes up faster here.</li>`);
  const sp=sorePattern(), soreEx=Object.entries(sp).filter(([id,v])=>v.n>=2&&v.sore/v.n>=.5&&EX[id]).map(([id])=>EX[id].n);
  if(soreEx.length) rows.push(`<li><b>Often leaves you sore:</b> ${esc(soreEx.slice(0,4).join(", "))}. Normal for newer moves; it usually fades in 2–3 weeks.</li>`);
  const rd=lowReadiness(); if(rd) rows.push(`<li><b>Today's recovery looks low</b> from Apple Health: the plan trims the last two exercises.</li>`);
  if(!rows.length) rows.push(`<li>Nothing unusual yet. Log a few more sessions, tap Easy / Good / Tough honestly, and use the soreness check-in. Patterns show up after about two weeks.</li>`);
  return `<section class="card learned"><div class="eyebrow">Learning from your log</div><h3>What the app has noticed</h3><ul>${rows.join("")}</ul>
    <button class="btn block" data-act="month-report">Monthly summary for an AI ↗</button></section>`;
}

/* ---------- monthly summary, written for an AI (Claude, ChatGPT) to analyse ---------- */
function monthKey(d){ return d.slice(0,7); }
function monthReport(mk){
  const all=doneWorkouts().slice().reverse(), ws=all.filter(w=>monthKey(w.date)===mk);
  const [y,m]=mk.split("-").map(Number), label=new Date(y,m-1,1).toLocaleDateString("en-GB",{month:"long",year:"numeric"});
  const L=[];
  L.push(`# Clear Reps · monthly training summary · ${label}`,"");
  L.push(`I'm Danny. I'm getting back into the gym after time off, train two to four times a week (often with a personal trainer who picks exercises on the day), and want clarity, steady progress and no injuries. Please analyse this month: what went well, what's lagging or unbalanced, any signs of overdoing it, and 3–5 specific changes for next month (exercises, sets, weights, rest days). Keep it simple and practical.`,"");
  L.push(`## Program`,`- Plan: a round of four full-body workouts done in order whenever I train (leg lift + push + pull at 3 sets, two finishers at 2 sets), plus "My own" sessions built on the day.`,`- Phases, counted in workouts: first 4 ease in (2 sets, 3–4 reps in reserve), then build (1–3 in reserve), with 2 lighter workouts after every 14.`,`- Current: ${currentWeek()} workouts done in total, ${phaseFor(currentWeek()).name}.`,`- Weights: dumbbell weights are per dumbbell. Feel per set: Easy (4+ reps left) / Good (2–3 left) / Tough (barely).`,"");
  if(!ws.length){ L.push("No workouts logged this month."); return L.join("\n"); }
  /* attendance */
  const days=ws.map(w=>w.date), gaps=[]; for(let i=1;i<all.length;i++){ const g=daysBetween(all[i-1].date,all[i].date); if(g>=7&&monthKey(all[i].date)===mk) gaps.push(`${g} days before ${all[i].date}`); }
  const weeks={}; ws.forEach(w=>{ const d=new Date(w.date+"T12:00:00"); const mon=new Date(d); mon.setDate(d.getDate()-((d.getDay()+6)%7)); const k=mon.toISOString().slice(0,10); weeks[k]=(weeks[k]||0)+1; });
  const totalSets=ws.reduce((a,w)=>a+(w.sets||[]).filter(s=>s.done).length,0), mins=ws.map(w=>w.durationMin).filter(Boolean);
  L.push(`## Attendance`,`- Workouts: ${ws.length} (${ws.filter(w=>w.where==="home").length} at home). Total sets: ${totalSets}. Average length: ${mins.length?Math.round(mins.reduce((a,b)=>a+b,0)/mins.length)+" min":"n/a"}.`,`- Per week (week starting): ${Object.entries(weeks).map(([k,v])=>`${k}: ${v}`).join(" · ")}`,`- Breaks of a week or more: ${gaps.length?gaps.join("; "):"none"}`,"");
  /* muscle volume */
  const cnt={}; ws.forEach(w=>(w.sets||[]).filter(s=>s.done).forEach(s=>{ const e=EX[s.ex]; if(!e) return; e.m.forEach(x=>cnt[x]=(cnt[x]||0)+1); e.s.forEach(x=>cnt[x]=(cnt[x]||0)+.5); }));
  const nW=Math.max(1,Object.keys(weeks).length);
  L.push(`## Sets per muscle (helpers count half)`,`| Muscle | Total | Per week |`,`|---|---|---|`,...Object.keys(MUSCLES).map(k=>`| ${MUSCLES[k].n} | ${+(cnt[k]||0).toFixed(1)} | ${+((cnt[k]||0)/nW).toFixed(1)} |`),"");
  /* exercise progress */
  const ids=[...new Set(ws.flatMap(w=>(w.sets||[]).filter(s=>s.done).map(s=>s.ex)))].filter(id=>EX[id]);
  L.push(`## Exercise progress this month`,`| Exercise | Sessions | First (best set) | Last (best set) | Est. 1RM change | Feel E/G/T | Note |`,`|---|---|---|---|---|---|---|`);
  ids.forEach(id=>{ const e=EX[id], ses=ws.map(w=>(w.sets||[]).filter(s=>s.ex===id&&s.done)).filter(x=>x.length);
    const best=ss=>ss.reduce((a,s)=>e1rm(+s.w||0,+s.r||0)>e1rm(+a.w||0,+a.r||0)?s:a,ss[0]), fmt=s=>e.inc===0?`${s.r}${e.timed?"s":" reps"}`:`${fmtKg(s.w)} kg × ${s.r}`;
    const b0=best(ses[0]), b1=best(ses.at(-1)), r0=e1rm(+b0.w||0,+b0.r||0), r1=e1rm(+b1.w||0,+b1.r||0);
    const fl=ses.flat(), f=k=>fl.filter(s=>s.feel===k).length;
    L.push(`| ${e.n} | ${ses.length} | ${fmt(b0)} | ${fmt(b1)} | ${r0&&r1?(r1>=r0?"+":"")+Math.round((r1/r0-1)*100)+"%":"n/a"} | ${f("easy")}/${f("good")}/${f("tough")} | ${stalled(id)?"stalled":""} |`); });
  L.push("");
  /* sessions log */
  L.push(`## Session log`);
  ws.forEach(w=>{ const done=(w.sets||[]).filter(s=>s.done), by={}; done.forEach(s=>{ (by[s.ex]=by[s.ex]||[]).push(s); });
    const h=(typeof sessionHR==="function")?sessionHR(w):null;
    L.push(`- **${w.date} · ${histName(w)}**${w.durationMin?` · ${w.durationMin} min`:""}${w.rpe?` · felt ${({4:"easy",7:"just right",9:"brutal"})[w.rpe]}`:""}${h?` · HR avg ${h.avg}, peak ${h.max}`:""}`);
    Object.entries(by).forEach(([id,ss])=>{ const e=EX[id]; if(!e) return; L.push(`  - ${e.n}: ${ss.map(s=>`${e.inc===0?"":fmtKg(s.w)+"×"}${s.r}${e.timed?"s":""}${s.feel?" ("+s.feel[0].toUpperCase()+")":""}`).join(", ")}`); });
    if(w.sore&&Object.keys(w.sore).length) L.push(`  - Sore after: ${Object.entries(w.sore).map(([k,l])=>`${MUSCLES[k]?.n||k} (${l===2?"very":"a bit"})`).join(", ")}`);
    else if(w.soreAt) L.push(`  - Sore after: nothing`);
    if(w.notes) L.push(`  - Note: ${w.notes}`);
  });
  L.push("");
  /* health */
  const hd=(S.health?.days||[]).filter(d=>monthKey(d.day)===mk);
  if(hd.length){ const av=k=>{ const v=hd.map(d=>d[k]).filter(x=>x!=null).map(Number); return v.length?(v.reduce((a,b)=>a+b,0)/v.length):null; };
    L.push(`## Apple Health (Amazfit watch), month averages`,`- Sleep: ${av("sleep_hours")!=null?av("sleep_hours").toFixed(1)+" h":"n/a"} · Resting HR: ${av("resting_hr")!=null?Math.round(av("resting_hr")):"n/a"} · Steps: ${av("steps")!=null?Math.round(av("steps")).toLocaleString("en-US"):"n/a"}`,""); }
  /* body check-ins */
  const ck=(S.checkins||[]).filter(c=>monthKey(c.date)===mk);
  if(ck.length) L.push(`## Body check-ins`,...ck.map(c=>`- ${c.date}: ${[c.weight&&c.weight+" kg",c.waist&&"waist "+c.waist+" cm",c.arm&&"arm "+c.arm+" cm"].filter(Boolean).join(", ")||"photo only"}`),"");
  L.push(`_Exported from Clear Reps on ${todayISO()}._`);
  return L.join("\n");
}
function monthSheet(mk){
  const months=[...new Set(doneWorkouts().map(w=>monthKey(w.date)))].sort().reverse();
  mk=mk||S.reportMonth||months[0]||todayISO().slice(0,7); S.reportMonth=mk;
  const txt=monthReport(mk); S.reportText=txt;
  openSheet(`<div class="stack-l"><div><div class="eyebrow">Monthly summary</div><h2>Send it to an AI</h2><p class="small muted">A plain-text summary of the month with a question at the top. Copy it into Claude or ChatGPT, or share it as a file, and ask for changes for next month.</p></div>
    ${months.length>1?`<div class="mchips">${months.slice(0,6).map(x=>`<button class="mchip ${x===mk?"on":""}" data-act="month-pick" data-m="${x}">${new Date(x+"-01T12:00:00").toLocaleDateString(undefined,{month:"short",year:"numeric"})}</button>`).join("")}</div>`:""}
    <div class="row"><button class="btn primary" data-act="month-copy">Copy text</button><button class="btn" data-act="month-share">Share file</button></div>
    <pre class="report">${esc(txt)}</pre>
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
async function monthCopy(){ try{ await navigator.clipboard.writeText(S.reportText||""); toast("Copied. Paste it into Claude or ChatGPT"); }catch(e){ toast("Couldn't copy. Try Share file"); } }
async function monthShare(){
  const name=`clear-reps-${S.reportMonth||"month"}.md`, file=new File([S.reportText||""],name,{type:"text/markdown"});
  try{ if(navigator.canShare&&navigator.canShare({files:[file]})){ await navigator.share({files:[file],title:"Clear Reps monthly summary"}); return; } }catch(e){ if(e?.name==="AbortError") return; }
  const a=document.createElement("a"); a.href=URL.createObjectURL(file); a.download=name; document.body.appendChild(a); a.click(); a.remove(); toast("Downloaded");
}
