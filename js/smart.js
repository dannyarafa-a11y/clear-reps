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
  if(ph.key==="build") return {lo:6,hi:12,ph};
  return {lo:3.5,hi:8,ph};
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
  const {load,raw,last}=muscleLoad(opts), band=loadBand(), out={};
  Object.keys(MUSCLES).forEach(m=>{
    const L=load[m], r=raw[m];
    const k = L<.4?"none": L<band.lo*.5?"light": L<band.lo?"building": L<=band.hi?"good": L<=band.hi*1.35?"high":"over";
    const recovering = last[m]!==null && last[m]<1.5 && L>=band.lo*.45;
    out[m]={k,L,raw:r,last:last[m],recovering,color:k==="none"?null:loadColor(L,band)};
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
  if(ins.needs.length) out.push(row("#3366FF","Needs work:",mNames(ins.needs.slice(0,4))+".","Little this week."));
  if(ins.rec.length) out.push(row("#F2A516","Recovering:",mNames(ins.rec.slice(0,4))+".","Trained in the last day."));
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
  const adj=[];
  res.ex.forEach((id,i)=>{
    const e=EX[id]; if(!e) return;
    const base=setsFor(day,day.ex[i],ph); let n=base, type="", mus=[];
    const prim=e.m.filter(m=>st.mus[m]);
    const over=prim.filter(m=>st.mus[m].k==="over"), rec=prim.filter(m=>st.mus[m].recovering), high=prim.filter(m=>st.mus[m].k==="high");
    const low=prim.length&&prim.every(m=>["none","light"].includes(st.mus[m].k)&&!st.mus[m].recovering);
    if(over.length){ n=Math.max(1,base-1); type="over"; mus=over; }
    else if(rec.length&&base>1){ n=base-1; type="rec"; mus=rec; }
    else if(high.length&&base>2){ n=base-1; type="high"; mus=high; }
    else if(low&&ph.key!=="deload"&&base<4){ n=base+1; type="low"; mus=prim; }
    if(n!==base) adj.push({ex:id,from:base,to:n,type,mus,why:ADJ_WHY[type](mus)});
  });
  return adj;
}
const ADJ_WHY={
  over:m=>`${mNames(m)}: already overworked this week.`,
  rec:m=>`${mNames(m)}: trained in the last day, still recovering.`,
  high:m=>`${mNames(m)}: already had a lot this week.`,
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
function plannedSets(id,n){
  const e=EX[id], t=targetFor(id), last=lastSetsFor(id,S.active?.id), out=[];
  for(let j=0;j<n;j++){
    const ls=last?.sets[Math.min(j,last.sets.length-1)];
    let w=t.w===""?"":t.w, r=t.r;
    if(ls&&!t.up){
      if(e.inc>0&&+ls.w>0) w=+ls.w;
      const lr=+ls.r||0; if(lr>0) r=Math.min(Math.max(lr+1,e.r[0]),e.r[1]);
    }
    if(e.inc===0) w=0;
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
  const ph=phaseFor(w.week||currentWeek()), st=muscleStatus({skipId:w.id}), ins=bodyInsight(st), free=w.dayId==="free";
  const items=[];
  items.push(`<li><b>${esc(ph.name)}:</b> ${free?"":`${ph.sets} sets each, `}stop with ${esc(ph.rir)} reps left in the tank.</li>`);
  items.push(...adjustLines(w.adjust));
  const gear=Object.entries(w.swaps||{}).filter(([nw,orig])=>EX[nw]&&EX[orig]&&!(w.userSwaps||{})[nw]);
  if(gear.length) items.push(`<li><b>Swapped for your gym:</b> ${esc(gear.map(([nw,orig])=>`${EX[nw].n} instead of ${EX[orig].n}`).join(", "))}.</li>`);
  const ups=day.ex.filter(id=>targetFor(id).up);
  if(ups.length) items.push(`<li><b>Weight goes up:</b> ${esc(ups.map(id=>`${EX[id].n} (${targetFor(id).short.split(" · ")[0]})`).join(", "))}. <span class="muted">Every set hit the top of the range last time.</span></li>`);
  if(free&&ins.needs.length) items.push(`<li><b>Good picks today:</b> ${esc(mNames(ins.needs.slice(0,3)))}. <span class="muted">Least work this week. Worth telling your trainer.</span></li>`);
  if(free&&ins.rec.length) items.push(`<li><b>Go easier on:</b> ${esc(mNames(ins.rec.slice(0,3)))}. <span class="muted">Trained in the last day.</span></li>`);
  return `<details class="brief" ${S.briefShut?"":"open"}><summary><span class="eyebrow">Before you start</span><b>Today's plan, explained</b><span class="chev">›</span></summary>
    <ul>${items.join("")}</ul>
    <div class="brief-map">${bodyFig(plannedLevels(w),{cls:"mini"})}<div><p class="small" style="margin:0 0 4px"><b>What today works</b></p><p class="tiny muted" style="margin:0">Darker means more sets. ${free?"Fills in as you add exercises.":""}</p></div></div></details>`;
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
    <p class="tiny muted">Next planned workout adjusts its sets to this: fewer for muscles that are recovering or overworked, more for ones that need work.</p></section>`;
}

/* ---------- swap ---------- */
function swapOptions(id){
  const e=EX[id], g=gymSet(), list=S.active?sessionDay(S.active).ex:[];
  const prim=e.m[0], out=[];
  (e.alts||[]).forEach(a=>{ if(EX[a]&&!list.includes(a)) out.push(a); });
  Object.keys(EX).forEach(k=>{ const x=EX[k]; if(k===id||out.includes(k)||list.includes(k)||x.placeholder) return; if(prim&&x.m.includes(prim)) out.push(k); });
  return out.sort((a,b)=>(exOK(b,g)-exOK(a,g))||((e.alts||[]).includes(b)-(e.alts||[]).includes(a))).slice(0,6);
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
  const ph=phaseFor(w.week||currentWeek());
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
    <div class="figcard">${bodyFig(doneLevels(w))}${intensityKey()}<div class="mchips">${musRows}</div><p class="tiny muted center">Sets per muscle · helpers count half</p></div>
    ${hrDetail(w)}
    <div><h3>Exercises</h3><div class="wdlist">${exCards||`<p class="small muted">No sets logged.</p>`}</div></div>
    ${w.notes?`<div class="note">“${esc(w.notes)}”</div>`:""}
    ${done.length&&can?`<div class="row"><button class="btn" data-act="redo" data-id="${esc(w.id)}">↻ Do again</button><button class="btn" data-act="save-as-day" data-id="${esc(w.id)}" ${saved?"disabled":""}>${saved?"Saved ✓":"Save as a workout"}</button></div>`:""}
    ${S.canWrite?`<div class="row"><button class="pill" data-act="ed-open" data-id="${esc(w.id)}">✎ Edit</button><button class="link" data-act="del-workout" data-id="${esc(w.id)}">Delete</button></div>`:""}
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
