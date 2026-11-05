const MUSCLES = {
  chest:{n:"Chest",g:"push"}, shoulders:{n:"Shoulders",g:"push"}, triceps:{n:"Triceps",g:"push"},
  lats:{n:"Lats",g:"pull"}, upper_back:{n:"Upper back",g:"pull"}, rear_delts:{n:"Rear delts",g:"pull"}, biceps:{n:"Biceps",g:"pull"},
  quads:{n:"Quads",g:"legs"}, hamstrings:{n:"Hamstrings",g:"legs"}, glutes:{n:"Glutes",g:"legs"}, calves:{n:"Calves",g:"legs"},
  abs:{n:"Abs",g:"core"}, lower_back:{n:"Lower back",g:"core"}
};
const GROUPS = {push:{n:"Push",kg:25},pull:{n:"Pull",kg:20},legs:{n:"Legs",kg:15},core:{n:"Core",kg:10}};

const EX = {
 legpress:{n:"Leg press",m:["quads"],s:["glutes"],r:[8,12],rest:120,inc:5,eq:"Machine",
  cues:["Feet shoulder-width, middle of the platform","Lower until knees are around 90°, hips stay on the pad","Push through the whole foot; stop just short of locking the knees"],
  mist:["Lower back peeling off the pad at the bottom","Knees caving inward"],feel:"Front of the thighs, some glutes.",swap:"Goblet squat"},
 rdl:{n:"Dumbbell Romanian deadlift",m:["hamstrings"],s:["glutes","lower_back"],r:[8,12],rest:120,inc:2,eq:"Dumbbells (weight per hand)",
  cues:["Soft knees, push your hips straight back","Dumbbells slide down the front of your thighs","Stop at a strong hamstring stretch, usually just below the knee","Stand up by squeezing your glutes"],
  mist:["Rounding the back to reach lower","Bending the knees so it turns into a squat"],feel:"Back of the thighs stretching on the way down.",swap:"Cable pull-through"},
 lunge:{n:"Walking lunge",m:["quads","glutes"],s:["hamstrings"],r:[8,12],per:"per leg",rest:90,inc:2,eq:"Dumbbells (per hand) or bodyweight",
  cues:["Long enough step that the front shin stays fairly upright","Back knee drops toward the floor under control","Drive up through the front heel"],
  mist:["Short choppy steps that load the knee","Torso collapsing forward"],feel:"Front thigh and glute of the front leg.",swap:"Split squat (stationary)"},
 legcurl:{n:"Seated leg curl",m:["hamstrings"],s:[],r:[10,15],rest:75,inc:5,eq:"Machine",
  cues:["Knee lined up with the machine's pivot","Curl fully, squeeze for a second","Let it back slowly, about 2–3 seconds"],
  mist:["Hips lifting off the seat","Letting the weight drop back"],feel:"Back of the thighs.",swap:"Lying leg curl"},
 shpress:{n:"Seated dumbbell shoulder press",m:["shoulders"],s:["triceps"],r:[8,12],rest:120,inc:2,eq:"Dumbbells (per hand)",
  cues:["Back against an upright bench","Elbows slightly in front of the body, not flared straight out","Press up and slightly in; lower to about chin height"],
  mist:["Arching the lower back to push","Bouncing out of the bottom"],feel:"Front and side of the shoulders.",swap:"Shoulder press machine"},
 lateral:{n:"Lateral raise",m:["shoulders"],s:[],r:[12,15],rest:60,inc:1,eq:"Dumbbells (per hand)",
  cues:["Slight bend in the elbows, lean very slightly forward","Raise out to the sides to shoulder height","Lead with the elbows, not the hands"],
  mist:["Swinging with the body","Shrugging the shoulders up to the ears"],feel:"Side of the shoulders. Light weight is normal here.",swap:"Cable lateral raise"},
 calf:{n:"Standing calf raise",m:["calves"],s:[],r:[12,15],rest:60,inc:5,eq:"Machine or step",
  cues:["Full stretch at the bottom, pause one second","Rise as high as you can onto the big toe","Slow on the way down"],
  mist:["Short bouncy reps"],feel:"Calves.",swap:"Seated calf raise"},
 dbbench:{n:"Dumbbell bench press",m:["chest"],s:["shoulders","triceps"],r:[8,12],rest:120,inc:2,eq:"Dumbbells (per hand)",
  cues:["Shoulder blades pinched back and down into the bench","Lower until dumbbells are level with the chest","Elbows about 45° from the body, press up and slightly in"],
  mist:["Elbows flared straight out at 90°","Shoulders rolling forward at the top"],feel:"Chest, with some front shoulder and triceps.",swap:"Chest press machine"},
 incline:{n:"Incline dumbbell press",m:["chest"],s:["shoulders","triceps"],r:[8,12],rest:120,inc:2,eq:"Dumbbells (per hand), bench at 30°",
  cues:["Bench at about 30°, not steeper","Same shoulder-blade set-up as flat bench","Lower to the upper chest"],
  mist:["Bench too steep so it becomes a shoulder press"],feel:"Upper chest.",swap:"Incline machine press"},
 pecfly:{n:"Pec deck / cable fly",m:["chest"],s:[],r:[12,15],rest:60,inc:5,eq:"Machine or cables",
  cues:["Soft, fixed bend in the elbows","Hug a big tree; bring the hands together in front of the chest","Slow stretch back open"],
  mist:["Turning it into a press by bending the elbows"],feel:"Chest stretching and squeezing.",swap:"Dumbbell fly"},
 pushdown:{n:"Cable triceps pushdown",m:["triceps"],s:[],r:[10,15],rest:60,inc:2.5,eq:"Cable, rope or bar",
  cues:["Elbows pinned at your sides","Push down until the arms are straight, squeeze","Only the forearms move"],
  mist:["Leaning over and using body weight","Elbows drifting forward"],feel:"Back of the upper arm.",swap:"Bench dips"},
 curl:{n:"Dumbbell biceps curl",m:["biceps"],s:[],r:[10,12],rest:60,inc:1,eq:"Dumbbells (per hand)",
  cues:["Elbows stay by your sides","Curl up, turn the palms up fully","Lower slowly all the way down"],
  mist:["Swinging the body","Half reps at the bottom"],feel:"Front of the upper arm.",swap:"Cable curl"},
 ohext:{n:"Overhead triceps extension",m:["triceps"],s:[],r:[10,15],rest:60,inc:2.5,eq:"Cable rope or one dumbbell",
  cues:["Elbows point forward, stay close to the head","Lower behind the head for a deep stretch","Straighten the arms fully"],
  mist:["Elbows flaring wide","Arching the lower back"],feel:"Back of the upper arm, stretched.",swap:"Skull crusher"},
 hammer:{n:"Hammer curl",m:["biceps"],s:[],r:[10,12],rest:60,inc:1,eq:"Dumbbells (per hand)",
  cues:["Palms face each other the whole time","Elbows stay still","Control the lowering"],
  mist:["Swinging"],feel:"Biceps and forearm.",swap:"Rope cable curl"},
 pulldown:{n:"Lat pulldown",m:["lats"],s:["biceps","upper_back"],r:[8,12],rest:120,inc:5,eq:"Cable machine",
  cues:["Grip a little wider than shoulders, thighs locked under the pad","Pull elbows down toward your back pockets","Bar to upper chest, then let the arms rise fully"],
  mist:["Leaning far back and yanking","Pulling the bar behind the neck"],feel:"Sides of the back under the armpits.",swap:"Assisted pull-up"},
 cablerow:{n:"Seated cable row",m:["upper_back","lats"],s:["biceps","rear_delts"],r:[8,12],rest:90,inc:5,eq:"Cable machine",
  cues:["Sit tall, slight knee bend","Pull the handle to your belly, squeeze shoulder blades together","Let the shoulders reach forward on the return"],
  mist:["Rocking the torso back and forth","Shrugging"],feel:"Middle of the back between the shoulder blades.",swap:"Chest-supported row machine"},
 dbrow:{n:"One-arm dumbbell row",m:["lats"],s:["upper_back","biceps"],r:[8,12],per:"per arm",rest:90,inc:2,eq:"Dumbbell + bench",
  cues:["Hand and knee on the bench, back flat","Pull the dumbbell toward your hip","Lower until the arm is straight"],
  mist:["Twisting the torso to lift","Pulling to the chest instead of the hip"],feel:"Lats on the working side.",swap:"Single-arm cable row"},
 facepull:{n:"Face pull",m:["rear_delts"],s:["upper_back"],r:[12,15],rest:60,inc:2.5,eq:"Cable, rope at face height",
  cues:["Pull the rope toward your eyes, hands split apart","Finish with elbows high and knuckles back","Pause, then return slowly"],
  mist:["Too heavy so you lean back"],feel:"Back of the shoulders.",swap:"Reverse pec deck"},
 hipthrust:{n:"Hip thrust",m:["glutes"],s:["hamstrings"],r:[8,12],rest:120,inc:5,eq:"Barbell, machine or dumbbell",
  cues:["Upper back on the bench edge, feet flat","Drive hips up until your body is a straight line","Chin tucked, ribs down, squeeze glutes at the top"],
  mist:["Over-arching the lower back at the top"],feel:"Glutes, not the lower back.",swap:"Glute bridge"},
 backext:{n:"Back extension",m:["lower_back"],s:["glutes","hamstrings"],r:[10,15],rest:60,inc:2.5,eq:"45° bench, bodyweight to start",
  cues:["Pad just below the hip bones","Lower with a long spine","Rise until your body is straight, no further"],
  mist:["Swinging up past straight into an arch"],feel:"Lower back and glutes.",swap:"Superman on the floor"},
 plank:{n:"Plank",m:["abs"],s:[],r:[30,45],timed:true,rest:45,inc:0,eq:"Floor",
  cues:["Elbows under shoulders","Squeeze glutes, tuck the ribs down","Breathe normally"],
  mist:["Hips sagging","Hips piked high"],feel:"Abs working to hold you flat.",swap:"Knee plank"},
 deadbug:{n:"Dead bug",m:["abs"],s:[],r:[8,10],per:"per side",rest:45,inc:0,eq:"Floor",
  cues:["Lower back pressed into the floor the whole time","Extend opposite arm and leg slowly","Breathe out as you extend"],
  mist:["Back arching off the floor"],feel:"Deep abs.",swap:"Bird dog"},
 /* alternatives, used when the gym is missing something */
 gobletsquat:{n:"Goblet squat",m:["quads"],s:["glutes"],r:[8,12],rest:120,inc:2,eq:"One dumbbell, held at the chest",
  cues:["Hold one dumbbell upright against your chest","Feet a bit wider than shoulders, toes slightly out","Sit down between your heels, chest up","Stand up by pushing the floor away"],
  mist:["Heels lifting off the floor","Knees caving inward"],feel:"Front of the thighs and glutes.",swap:"Leg press"},
 chestpressm:{n:"Chest press machine",m:["chest"],s:["shoulders","triceps"],r:[8,12],rest:120,inc:5,eq:"Machine",
  cues:["Set the seat so the handles line up with the middle of your chest","Shoulder blades back against the pad","Press out until the arms are almost straight, then return slowly"],
  mist:["Shoulders rolling forward off the pad","Slamming the elbows straight at the end"],feel:"Chest, with some front shoulder and triceps.",swap:"Push-up"},
 shpressm:{n:"Shoulder press machine",m:["shoulders"],s:["triceps"],r:[8,12],rest:120,inc:5,eq:"Machine",
  cues:["Set the seat so the handles start at shoulder height","Back flat against the pad","Press up until the arms are nearly straight, lower slowly"],
  mist:["Arching the lower back off the pad","Dropping the weight on the way down"],feel:"Front and side of the shoulders.",swap:"Seated dumbbell shoulder press"},
 assistpull:{n:"Assisted pull-up",m:["lats"],s:["biceps","upper_back"],r:[6,10],rest:120,inc:0,eq:"Assisted pull-up machine. Less help over time means progress.",
  cues:["Kneel or stand on the pad, grip a bit wider than shoulders","Pull your chest toward the bar, elbows down to your sides","Lower all the way until the arms are straight"],
  mist:["Kicking or swinging to get up","Stopping halfway on the way down"],feel:"Sides of the back under the armpits.",swap:"Lat pulldown"},
 glutebridge:{n:"Glute bridge",m:["glutes"],s:["hamstrings"],r:[12,15],rest:60,inc:0,eq:"Floor",
  cues:["Lie on your back, knees bent, feet flat near your hips","Push through your heels and lift your hips","Squeeze your glutes at the top for a second, then lower slowly"],
  mist:["Arching the lower back instead of using the glutes"],feel:"Glutes, not the lower back.",swap:"Hip thrust"},
 superman:{n:"Superman",m:["lower_back"],s:["glutes"],r:[10,12],rest:45,inc:0,eq:"Floor",
  cues:["Lie face down, arms stretched forward","Lift arms, chest and legs a little off the floor","Hold for two seconds, then lower slowly"],
  mist:["Yanking the head back to look up"],feel:"Lower back and glutes.",swap:"Back extension"},
 pushup:{n:"Push-up",m:["chest"],s:["shoulders","triceps"],r:[6,12],rest:90,inc:0,eq:"Floor. Hands on a bench makes it easier.",
  cues:["Hands a bit wider than shoulders, body in one straight line","Lower your chest toward the floor, elbows about 45° from the body","Push the floor away until your arms are straight"],
  mist:["Hips sagging","Elbows flared straight out"],feel:"Chest, front shoulders and triceps.",swap:"Hands on a bench to make it easier"},
 dblegcurl:{n:"Dumbbell lying leg curl",m:["hamstrings"],s:[],r:[10,15],rest:75,inc:1,eq:"One dumbbell + flat bench",
  cues:["Lie face down on the bench, knees just off the end","Hold the dumbbell between your feet","Curl your heels toward your glutes, then lower slowly"],
  mist:["Hips lifting off the bench","Letting the dumbbell drop"],feel:"Back of the thighs.",swap:"Bridge walkout"},
 bwhamcurl:{n:"Bridge walkout",m:["hamstrings"],s:["glutes"],r:[6,10],rest:60,inc:0,eq:"Floor",
  cues:["Lie on your back, knees bent, and lift into a glute bridge","Keep the hips up and walk your heels out in small steps","Walk them back in, then lower. That's one rep"],
  mist:["Hips dropping as the heels walk out"],feel:"Back of the thighs working hard.",swap:"Glute bridge"},
 benchdip:{n:"Bench dips",m:["triceps"],s:["chest","shoulders"],r:[8,12],rest:60,inc:0,eq:"Bench",
  cues:["Hands on the bench edge behind you, fingers forward","Bend your elbows straight back to about 90°","Push back up until your arms are straight"],
  mist:["Dropping so low the shoulders hurt","Elbows flaring out to the sides"],feel:"Back of the upper arm.",swap:"Bend your knees to make it easier"},
 cablecurl:{n:"Cable curl",m:["biceps"],s:[],r:[10,12],rest:60,inc:2.5,eq:"Cable, bar or rope on the low pulley",
  cues:["Stand tall facing the cable, elbows at your sides","Curl up and squeeze at the top","Lower slowly until the arms are straight"],
  mist:["Leaning back to swing it up"],feel:"Front of the upper arm.",swap:"Dumbbell biceps curl"},
 slcalf:{n:"Single-leg calf raise",m:["calves"],s:[],r:[10,15],per:"per leg",rest:60,inc:0,eq:"A step. Hold something for balance.",
  cues:["Ball of one foot on the step edge, heel hanging off","Lower the heel for a full stretch","Rise as high as you can, pause, lower slowly"],
  mist:["Short bouncy reps"],feel:"Calf of the working leg.",swap:"Both legs at once to make it easier"},
 reversefly:{n:"Reverse dumbbell fly",m:["rear_delts"],s:["upper_back"],r:[12,15],rest:60,inc:1,eq:"Light dumbbells (per hand)",
  cues:["Hinge forward with a flat back, arms hanging down","Soft bend in the elbows, raise the arms out to the sides","Squeeze the shoulder blades, then lower slowly"],
  mist:["Too heavy so you swing","Shrugging up to the ears"],feel:"Back of the shoulders.",swap:"Face pull"},
 dbpullover:{n:"Dumbbell pullover",m:["lats"],s:["chest"],r:[10,12],rest:90,inc:1,eq:"One dumbbell + flat bench",
  cues:["Lie on the bench, one dumbbell held over your chest with both hands","Soft elbows, lower it back behind your head","Pull it back over your chest using your back"],
  mist:["Bending the elbows so it turns into a triceps move","Going so far back it pinches the shoulder"],feel:"Sides of the back and chest stretching.",swap:"Lat pulldown"}
};

/* ---------- my gym: what each exercise needs ("a|b" means either one) and swaps in order of preference ---------- */
const EQUIP = [["dumbbells","Dumbbells"],["barbell","Barbell"],["bench","Adjustable bench"],["legpress","Leg press"],["legcurl","Leg curl machine"],["legext","Leg extension machine"],["calfmachine","Calf raise machine"],["cable","Cable machine"],["pulldown","Lat pulldown"],["cablerow","Seated cable row"],["pecdeck","Pec deck"],["chestpress","Chest press machine"],["shmachine","Shoulder press machine"],["assistpull","Assisted pull-up machine"],["hipthrustm","Hip thrust machine"],["backextbench","Back extension bench"],["smith","Smith machine"],["pullupbar","Pull-up bar"],["bands","Resistance bands"],["kettlebells","Kettlebells"],["medball","Medicine ball"],["swissball","Exercise ball"],["foamroller","Foam roller"],["ezbar","EZ curl bar"]];
const EQN = Object.fromEntries(EQUIP);
/* any of these counts as "a machine" for library exercises that just say "machine" */
const MACHINES = ["legpress","legcurl","legext","calfmachine","cable","pulldown","cablerow","pecdeck","chestpress","shmachine","assistpull","hipthrustm","smith"];
const GEAR = {
 legpress:[["legpress"],["gobletsquat","lunge"]], rdl:[["dumbbells"],["legcurl","dblegcurl","bwhamcurl"]], lunge:[[],[]],
 legcurl:[["legcurl"],["dblegcurl","bwhamcurl"]], shpress:[["dumbbells"],["shpressm"]], lateral:[["dumbbells"],["shpressm"]],
 calf:[["calfmachine"],["slcalf"]], dbbench:[["dumbbells","bench"],["chestpressm","pushup"]], incline:[["dumbbells","bench"],["chestpressm","pushup"]],
 pecfly:[["pecdeck|cable"],["chestpressm","pushup"]], pushdown:[["cable"],["benchdip"]], curl:[["dumbbells"],["cablecurl"]],
 ohext:[["dumbbells|cable"],["benchdip"]], hammer:[["dumbbells"],["cablecurl"]], pulldown:[["pulldown"],["assistpull","dbpullover"]],
 cablerow:[["cablerow|cable"],["dbrow"]], dbrow:[["dumbbells","bench"],["cablerow"]], facepull:[["cable"],["reversefly"]],
 hipthrust:[["hipthrustm|bench"],["glutebridge"]], backext:[["backextbench"],["superman"]], plank:[[],[]], deadbug:[[],[]],
 gobletsquat:[["dumbbells"],["lunge"]], chestpressm:[["chestpress"],["pushup"]], shpressm:[["shmachine"],[]], assistpull:[["assistpull"],["dbpullover"]],
 glutebridge:[[],[]], superman:[[],[]], pushup:[[],[]], dblegcurl:[["dumbbells","bench"],["bwhamcurl"]], bwhamcurl:[[],[]],
 benchdip:[["bench"],["pushup"]], cablecurl:[["cable"],[]], slcalf:[[],[]], reversefly:[["dumbbells"],[]], dbpullover:[["dumbbells","bench"],[]]
};
Object.entries(GEAR).forEach(([k,[needs,alts]])=>{ if(EX[k]){ EX[k].needs=needs; EX[k].alts=alts; } });
Object.values(EX).forEach(e=>{ e.needs=e.needs||[]; e.alts=e.alts||[]; });
/* photos: matching Free Exercise DB entry for each built-in exercise, [library id, photo chunk] */
const EX_LIB = {legpress:["Leg_Press",6],rdl:["Stiff-Legged_Dumbbell_Deadlift",12],lunge:["Dumbbell_Lunges",3],legcurl:["Seated_Leg_Curl",10],shpress:["Dumbbell_Shoulder_Press",3],lateral:["Side_Lateral_Raise",10],calf:["Standing_Calf_Raises",11],dbbench:["Dumbbell_Bench_Press",3],incline:["Incline_Dumbbell_Press",5],pecfly:["Butterfly",1],pushdown:["Triceps_Pushdown_-_Rope_Attachment",12],curl:["Dumbbell_Bicep_Curl",3],ohext:["Cable_Rope_Overhead_Triceps_Extension",2],hammer:["Hammer_Curls",4],pulldown:["Wide-Grip_Lat_Pulldown",13],cablerow:["Seated_Cable_Rows",9],dbrow:["One-Arm_Dumbbell_Row",7],facepull:["Face_Pull",4],hipthrust:["Barbell_Hip_Thrust",0],backext:["Hyperextensions_Back_Extensions",5],plank:["Plank",8],deadbug:["Dead_Bug",2],gobletsquat:["Goblet_Squat",4],chestpressm:["Leverage_Chest_Press",6],shpressm:["Machine_Shoulder_Military_Press",7],glutebridge:["Butt_Lift_Bridge",1],superman:["Superman",12],pushup:["Pushups",8],benchdip:["Bench_Dips",1],cablecurl:["Standing_Biceps_Cable_Curl",11],reversefly:["Reverse_Flyes",9],dbpullover:["Bent-Arm_Dumbbell_Pullover",1]};
Object.entries(EX_LIB).forEach(([k,[lib,c]])=>{ if(EX[k]){ EX[k].lib=lib; EX[k].lc=c; } });

/* ---------- exercise library (Free Exercise DB) ---------- */
const LMUS = {quadriceps:"quads",lats:"lats","middle back":"upper_back",traps:"upper_back","lower back":"lower_back",abdominals:"abs",shoulders:"shoulders",glutes:"glutes",hamstrings:"hamstrings",calves:"calves",chest:"chest",biceps:"biceps",triceps:"triceps"};
const LGROUPS = ["Chest","Back","Shoulders","Arms","Legs","Glutes","Core","Stretching"];
const LIB_GRP = {abdominals:"Core",abductors:"Legs",adductors:"Legs",biceps:"Arms",calves:"Legs",chest:"Chest",forearms:"Arms",glutes:"Glutes",hamstrings:"Legs",lats:"Back","lower back":"Back","middle back":"Back",neck:"Shoulders",quadriceps:"Legs",shoulders:"Shoulders",traps:"Back",triceps:"Arms"};
const MUS_GRP = {chest:"Chest",lats:"Back",upper_back:"Back",lower_back:"Back",shoulders:"Shoulders",rear_delts:"Shoulders",biceps:"Arms",triceps:"Arms",quads:"Legs",hamstrings:"Legs",calves:"Legs",glutes:"Glutes",abs:"Core"};
const LIB_EQ = {dumbbell:"dumbbells",barbell:"barbell",cable:"cable",machine:"machine",bands:"bands",kettlebells:"kettlebells","medicine ball":"medball","exercise ball":"swissball","foam roll":"foamroller","e-z curl bar":"ezbar"};
const EQ_LABEL = {"body only":"Bodyweight",dumbbell:"Dumbbell",barbell:"Barbell",cable:"Cable",machine:"Machine",bands:"Bands",kettlebells:"Kettlebell","medicine ball":"Medicine ball","exercise ball":"Exercise ball","foam roll":"Foam roller","e-z curl bar":"EZ curl bar",other:"Other"};
const eqLabel = eq => EQ_LABEL[eq] || (eq?eq[0].toUpperCase()+eq.slice(1):"None");
const cap = s => s?String(s)[0].toUpperCase()+String(s).slice(1):"";
const libNeeds = eq => LIB_EQ[eq]?[LIB_EQ[eq]]:[];
const isHold = x => x.cat==="stretching" || /\b(plank|hold|wall sit|isometric|static)\b/i.test(x.n||"");
const exGroups = e => e.grp || [...new Set((e.m||[]).map(m=>MUS_GRP[m]).filter(Boolean))];
function cueOf(s){
  let t=String(s||"").replace(/\s+/g," ").trim().replace(/\s*This (will be|is) your start(ing)? position\.?/i,"").trim();
  const m=t.match(/^.+?[.!?](\s|$)/); if(m) t=m[0].trim();
  if(t.length>110) t=t.slice(0,106).replace(/\s+\S*$/,"")+"…";
  return t;
}
/* compact record kept in settings.libEx so history and targets work without the library loaded */
function libRec(x){
  const cues=(x.ins||[]).map(cueOf).filter(t=>t.length>3&&!/^(repeat|tip|note|caution|variation)/i.test(t)).slice(0,3);
  return {id:x.id,n:x.n,eq:x.eq||"",lv:x.lv||"",cat:x.cat||"",m:x.m||[],s:x.s||[],mech:x.mech||"",c:x.c,ni:x.ni,cues};
}
function libToEx(r){
  const ms=[...new Set((r.m||[]).map(x=>LMUS[x]).filter(Boolean))], ss=[...new Set((r.s||[]).map(x=>LMUS[x]).filter(Boolean))].filter(x=>!ms.includes(x));
  const hold=isHold(r), bw=hold||r.eq==="body only"||r.eq==="foam roll";
  const xm=(r.m||[]).filter(x=>!LMUS[x]).map(cap);
  const names=[...ms.map(k=>MUSCLES[k].n),...xm];
  return {n:String(r.n||"Exercise").slice(0,70),m:ms,s:ss,xm,grp:[...new Set((r.m||[]).map(x=>LIB_GRP[x]).filter(Boolean))],cat:r.cat,
    r:hold?[30,45]:[8,12],timed:hold,rest:(hold||r.mech==="isolation")?60:90,inc:bw?0:2.5,eq:eqLabel(r.eq),lv:r.lv,
    cues:(r.cues&&r.cues.length)?r.cues:["Move slowly and under control","Use a weight you can handle for every rep","Stop if anything feels sharp or pinchy"],
    mist:[hold?"Holding your breath or pushing into pain":"Rushing the reps or swinging the weight"],feel:names.length?names.join(", ")+".":"",swap:"Ask the coach",
    needs:libNeeds(r.eq),alts:[],lib:r.id,lc:r.ni===0?null:r.c,lx:true};
}
const lxId = libId => "lx_"+String(libId).replace(/[^\w-]/g,"_");
let LIBP=null;
function loadLib(){
  if(!LIBP) LIBP=fetch("data/library.json").then(r=>{ if(!r.ok) throw new Error("http "+r.status); return r.json(); })
    .then(a=>{ if(!Array.isArray(a)) throw new Error("bad data"); S.libData=a; S.libById=new Map(a.map(x=>[x.id,x])); return a; })
    .catch(e=>{ LIBP=null; throw e; });
  return LIBP;
}
/* photos are plain files: img/<library id>/0.webp (start) and 1.webp (finish), cached by the service worker */
const PHFAIL=new Set();
const photoSrc=(lib,i)=>`img/${encodeURIComponent(lib)}/${i}.webp`;
function photosHTML(lib,c){
  if(!lib||c==null||c===""||PHFAIL.has(lib)) return "";
  return `<div class="xph" data-ph="${esc(lib)}">${["Start","Finish"].map((t,i)=>`<figure><button data-act="photo-zoom" data-lib="${esc(lib)}" data-i="${i}" aria-label="${t} position, tap to enlarge"><img src="${photoSrc(lib,i)}" alt="${t} position" loading="lazy" decoding="async" onerror="PHFAIL.add(this.closest('.xph').dataset.ph);this.closest('.xph').hidden=true"></button><figcaption>${t}</figcaption></figure>`).join("")}</div>`;
}
function hydratePhotos(){}
function zoomOpen(lib,i){
  if(!lib) return; const z=$("#zoom"), t=i?"Finish":"Start";
  z.innerHTML=`<div class="zoom-in" data-act="zoom-close" role="dialog" aria-modal="true" aria-label="${t} position"><figure><img src="${photoSrc(lib,i)}" alt="${t} position"><figcaption>${t}</figcaption></figure>
    <div class="row center"><button class="pill ${i?"":"on"}" data-act="photo-zoom" data-lib="${esc(lib)}" data-i="0">Start</button><button class="pill ${i?"on":""}" data-act="photo-zoom" data-lib="${esc(lib)}" data-i="1">Finish</button><button class="pill" data-act="zoom-close">Close</button></div></div>`;
  z.hidden=false;
}
function zoomClose(){ const z=$("#zoom"); z.hidden=true; z.innerHTML=""; }

const DAYS = [
 {id:"A",name:"Legs + Shoulders",ex:["legpress","rdl","lunge","legcurl","shpress","lateral","calf"],
  warm:["Leg swings, 10 each leg (front-back and side to side)","Bodyweight squats × 10","Glute bridges × 10","Walking lunges × 5 each leg","Arm circles, 10 each way"],
  cool:["Standing quad stretch","Seated hamstring stretch","Figure-4 glute stretch","Wall calf stretch","Cross-body shoulder stretch"]},
 {id:"B",name:"Chest + Arms",ex:["dbbench","incline","pecfly","pushdown","curl","ohext","hammer"],
  warm:["Arm circles, 10 each way","Band pull-aparts × 15","Incline push-ups × 8","Band shoulder pass-throughs × 10","Wrist circles, 10 each way"],
  cool:["Doorway chest stretch","Overhead triceps stretch","Biceps wall stretch","Child's pose with arms forward"]},
 {id:"C",name:"Back + Glutes + Core",ex:["pulldown","cablerow","dbrow","facepull","hipthrust","backext","plank","deadbug"],
  warm:["Cat-cow × 8","Band pull-aparts × 15","Dead hang from a bar, 20 seconds","Bird dog × 6 each side","Hip hinge drill with a stick × 10"],
  cool:["Child's pose with side reach (lats)","Knees to chest","Figure-4 glute stretch","Thread the needle, each side"]}
];

const BASICS = [
 {t:"How hard is hard enough?",b:"Use reps in reserve (RIR): how many more clean reps you could have done when you stop. RIR 2 means two more were possible. Most working sets should end at RIR 1–3. That is hard enough to make progress and far enough from failure that you recover for the next session."},
 {t:"How many sets is right?",b:"Count hard sets per muscle per week. Under about 4 does very little. 4–10 is the comeback zone and fine for the first weeks. 10–20 is where most people grow best. Past about 20, extra sets mostly add fatigue. The Program tab shows where you sit for every muscle."},
 {t:"Warm-up vs stretching",b:"Before lifting: 5 minutes of easy cardio, then moving stretches (swings, circles, light reps). Long static holds before lifting don't help and can make you slightly weaker. After the session: static holds of 30–45 seconds for the muscles you trained."},
 {t:"When to add weight",b:"Each exercise has a rep range, like 8–12. Keep the weight the same and add reps each session. When every set hits the top of the range with good form, add the smallest jump next time and start back at the bottom of the range. The app tells you which case you're in."},
 {t:"Rest between sets",b:"About 2 minutes for big lifts (presses, rows, leg press, deadlifts). 60–90 seconds for small ones (curls, raises). The timer starts each time you log a set."},
 {t:"Good pain, bad pain",b:"Burning in the muscle and next-day soreness are normal. Sharp, pinching or joint pain is not: stop that exercise, try the listed swap, and tell your trainer."},
 {t:"The phases",b:"Weeks 1–2: ease back in with 2 sets per exercise at RIR 3–4. Weeks 3–6: build with 3 sets at RIR 1–3. Week 7: a lighter deload week to recover, then the build repeats."}
];

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const todayISO = () => { const d=new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10); };
const fmtDate = iso => new Date(iso+"T12:00:00").toLocaleDateString(undefined,{weekday:"short",day:"numeric",month:"short"});
const daysBetween = (a,b) => Math.round((new Date(b+"T12:00:00")-new Date(a+"T12:00:00"))/864e5);
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const gcol = g => `var(--${g})`;
const e1rm = (w,r) => w>0 && r>0 ? w*(1+r/30) : 0;
function toast(t){const el=$("#toast");el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>el.hidden=true,2200);}

/* ---------- state ---------- */
const S = {
  view:"today", workouts:[], checkins:[], settings:null,
  loaded:false, dbState:"connecting", canWrite:true,
  health:{state:"off",days:[],workouts:[],hr:[]}, openHist:null, active:null, step:0, exIdx:0, hint:"", chat:[], chatBusy:false, coachFocus:null,
  chartEx:"legpress", libFilter:"all", openEx:null, photoUrls:{},
  libData:null, libById:null, lib:null, savedAs:new Set(),
  account:{email:"",stage:"idle",err:""}, howOpen:{}
};
/* cloud features (sync, Apple Health, coach) need Supabase configured in js/config.js and a signed-in user */
const cloudOK = () => !!(Store.state.configured && Store.session);
try{ S.view = localStorage.getItem("cr_view") || "today"; }catch(e){}
if(!["today","learn","progress","coach"].includes(S.view)) S.view="today";

function phaseFor(week){
  if(week<=2) return {key:"ease",name:"Ease back in",sets:2,rir:"3–4",note:"Leave 3–4 reps in the tank. You're rebuilding the habit and the joints, not testing yourself."};
  const k=(week-3)%5;
  if(k===4) return {key:"deload",name:"Deload week",sets:2,rir:"4",note:"Same exercises, about 10% lighter, 2 sets. Recovery week: you'll come back stronger."};
  return {key:"build",name:"Build",sets:3,rir:"1–3",note:"Most sets should end with 1–3 reps left. Chase the targets each session."};
}
function currentWeek(){
  const start=S.settings?.programStart;
  if(!start) return 1;
  return Math.max(1,Math.floor(daysBetween(start,todayISO())/7)+1);
}
const doneWorkouts = () => S.workouts.filter(w=>w.status==="done").sort((a,b)=>(b.date+(b.finishedAt||"")).localeCompare(a.date+(a.finishedAt||"")));
/* ---------- my gym ---------- */
const gymSet = () => { const q=S.settings?.equipment; return Array.isArray(q)?new Set(q):null; }; // null = assume everything
const customEquip = () => (Array.isArray(S.settings?.customEquipment)?S.settings.customEquipment:[]).filter(c=>c&&c.id&&c.name);
const allEquip = () => [...EQUIP,...customEquip().map(c=>[c.id,c.name])];
const allEqKeys = () => allEquip().map(x=>x[0]);
const eqName = k => k==="machine"?"a machine":(EQN[k]||customEquip().find(c=>c.id===k)?.name||"equipment you removed");
const machineOK = g => MACHINES.some(k=>g.has(k)) || customEquip().some(c=>g.has(c.id));
const hasNeed = (n,g) => !g || n.split("|").some(k=>k==="machine"?machineOK(g):g.has(k));
const exOK = (id,g=gymSet()) => { const e=EX[id]; return !e || (e.needs||[]).every(n=>hasNeed(n,g)); };
const libOK = (x,g=gymSet()) => libNeeds(x.eq).every(n=>hasNeed(n,g));
const missingGear = (id,g=gymSet()) => (EX[id]?.needs||[]).filter(n=>!hasNeed(n,g)).map(n=>n.split("|").map(k=>eqName(k).toLowerCase()).join(" or "));
/* swap anything the gym can't do for its first alternative that fits; ex[i] always replaces day.ex[i] */
function resolveDay(day){
  const g=gymSet(), ex=[], swaps={}, missing=[];
  (day.ex||[]).forEach(id=>{
    if(exOK(id,g)){ ex.push(id); return; }
    const alt=(EX[id]?.alts||[]).find(a=>EX[a]&&exOK(a,g)&&!ex.includes(a)&&!day.ex.includes(a));
    if(alt){ ex.push(alt); swaps[alt]=id; } else { ex.push(id); missing.push(id); }
  });
  return {ex,swaps,missing};
}
function canSave(){ if(S.dbState==="on"&&S.canWrite) return true; toast("Still loading. One second."); return false; }
async function writeSettings(){
  if(!(S.dbState==="on"&&S.canWrite)) return false;
  try{ await Store.putSettings(JSON.parse(JSON.stringify(S.settings||{}))); return true; }
  catch(e){ toast("Couldn't save. Try again."); return false; }
}
async function saveSettings(patch){ if(!canSave()) return false; S.settings={...(S.settings||{}),...patch}; return writeSettings(); }

/* ---------- my workouts (custom days) ---------- */
const GENERIC_WARM=["Arm circles, 10 each way","Bodyweight squats × 10","Glute bridges × 10","Band pull-aparts × 15","Cat-cow × 8"];
const GENERIC_COOL=["Standing quad stretch","Seated hamstring stretch","Doorway chest stretch","Child's pose with arms forward"];
function makeEx(c){
  const m=MUSCLES[c.m]?c.m:"chest", lo=Math.max(1,parseInt(c.r?.[0])||8), hi=Math.max(lo,parseInt(c.r?.[1])||12), wt=c.weighted!==false;
  const mm=Array.isArray(c.mm)?c.mm.filter(k=>MUSCLES[k]&&k!==m):[], ss=Array.isArray(c.s)?c.s.filter(k=>MUSCLES[k]&&k!==m&&!mm.includes(k)):[];
  return {n:String(c.n||"My exercise").slice(0,60),m:[m,...mm],s:ss,r:[lo,hi],rest:90,inc:wt?2.5:0,eq:"Your choice",
    cues:["Move slowly and under control","Use a weight you can handle for every rep","Stop if anything feels sharp or pinchy"],
    mist:["Rushing the reps or swinging"],feel:`${MUSCLES[m].n}.`,swap:"Ask the coach",needs:Array.isArray(c.needs)?c.needs.filter(Boolean):[],alts:[],custom:true};
}
function applyCustomEx(){
  Object.entries(S.settings?.customEx||{}).forEach(([id,c])=>{ if(id.startsWith("cx_")&&c) EX[id]=makeEx(c); });
  Object.entries(S.settings?.libEx||{}).forEach(([id,r])=>{ if(id.startsWith("lx_")&&r&&r.id) EX[id]=libToEx(r); });
}
function ensureEx(id){ if(id&&!EX[id]) EX[id]={...makeEx({n:"Custom exercise"}),m:[],feel:"",placeholder:true}; }
function warmCoolFor(ids){
  const ms=new Set(ids.flatMap(id=>EX[id]?.m||[]));
  let best=null, bs=0;
  DAYS.forEach(d=>{ const dm=new Set(d.ex.flatMap(id=>EX[id].m)); const sc=[...ms].filter(m=>dm.has(m)).length; if(sc>bs){ bs=sc; best=d; } });
  return best?{warm:best.warm,cool:best.cool}:{warm:GENERIC_WARM,cool:GENERIC_COOL};
}
function customDays(){
  return (S.settings?.customDays||[]).map(d=>{ const ex=(d.ex||[]).filter(id=>EX[id]); return {id:d.id,name:d.name||"My workout",ex,sets:d.sets||{},custom:true,...warmCoolFor(ex)}; });
}
const allDays = () => [...DAYS,...customDays()];
/* "free" = a Just train session: no fixed list, the session carries its own exList */
const FREE_WARM=["Arm circles, 10 each way","Leg swings, 10 each leg","Bodyweight squats × 10","Glute bridges × 10","Cat-cow × 8"];
const freeDay = () => ({id:"free",name:"Free session",ex:[],custom:true,free:true,sets:{},warm:FREE_WARM,cool:GENERIC_COOL});
const dayById = id => id==="free"?freeDay():allDays().find(d=>d.id===id);
/* "Free session · Chest, Arms" from what was actually done */
function freeName(w){
  const done=(w.sets||[]).filter(s=>s.done), g=new Set(done.flatMap(s=>EX[s.ex]?exGroups(EX[s.ex]):[]));
  if(!g.size&&done.some(s=>EX[s.ex]?.cat==="stretching")) g.add("Stretching");
  const list=LGROUPS.filter(x=>g.has(x));
  return list.length?"Free session · "+list.join(", "):"Free session";
}
const histName = w => w.dayId==="free"?(w.dayName||"Free session"):(dayById(w.dayId)?.name||w.dayName||"Workout");
const usingCustom = () => !!S.settings?.useCustom && customDays().some(d=>d.ex.length);
const planDays = () => usingCustom()?customDays().filter(d=>d.ex.length):DAYS;
const dayTag = d => d?.custom?"My workout":`Day ${d?.id}`;
const setsFor = (d,id,ph) => (d.custom&&+d.sets?.[id]>0)?+d.sets[id]:ph.sets;
const wLabel = w => { if(w.dayId==="free") return w.dayName||"Free session"; const d=dayById(w.dayId); return d?(d.custom?d.name:`Day ${d.id}`):(w.dayName||"Workout"); };
/* the day as it's actually being done: uses the swapped list saved on the workout */
function sessionDay(w){
  if(w.dayId==="free"){ const ex=(w.exList||[]).filter(id=>EX[id]); return {...freeDay(),name:w.dayName||"Free session",ex,cool:ex.length?warmCoolFor(ex).cool:GENERIC_COOL}; }
  const base=dayById(w.dayId)||{id:w.dayId,name:w.dayName||"Workout",ex:[...new Set((w.sets||[]).map(s=>s.ex))],custom:true,sets:{},warm:GENERIC_WARM,cool:GENERIC_COOL};
  return {...base,ex:(w.exList&&w.exList.length)?w.exList:base.ex};
}
function nextDay(){
  const list=planDays(), ids=list.map(d=>d.id);
  const last=doneWorkouts().find(w=>ids.includes(w.dayId));
  if(!last) return list[0];
  return list[(ids.indexOf(last.dayId)+1)%list.length];
}
function lastSetsFor(exId, excludeId){
  for(const w of doneWorkouts()){
    if(w.id===excludeId) continue;
    const s=(w.sets||[]).filter(x=>x.ex===exId && x.done);
    if(s.length) return {date:w.date,sets:s};
  }
  return null;
}
/* weight step: dumbbells default to 2 kg (gym racks go up in 2s); each exercise can override */
const WSTEPS=[1,2,2.5,5];
function wStep(id){ const e=EX[id]||{}, o=+S.settings?.wstep?.[id]; if(o>0) return o; return /dumbbell|kettlebell/i.test(e.eq||"")?2:(e.inc>0?e.inc:2.5); }
const roundTo=(v,st)=>+(Math.round(v/st)*st).toFixed(2);
function targetFor(exId){
  const e=EX[exId], last=lastSetsFor(exId, S.active?.id);
  const u=e.timed?"s":"";
  const range=`${e.r[0]}–${e.r[1]}${u}`;
  if(!last){
    if(e.inc===0) return {w:0,r:e.r[0],short:`${range}${e.per?" "+e.per:""}`,text:"First time. Focus on form."};
    return {w:"",r:e.r[0],short:`Find your weight · ${range}`,text:`Pick a weight you could lift about ${e.r[1]+3} times. Too easy? Tap Easy and the next set goes up.`};
  }
  const w=Math.max(...last.sets.map(s=>+s.w||0));
  const top=last.sets.filter(s=>(+s.w||0)===w);
  const allTop=top.length>=2 && top.every(s=>(+s.r||0)>=e.r[1]);
  const lastR=Math.min(...top.map(s=>+s.r||0));
  if(e.inc===0){
    return allTop?{w:0,r:e.r[1],up:true,short:`Beat ${e.r[1]}${u}`,text:"You hit the top last time. Add a little more."}
                 :{w:0,r:Math.min(lastR+1,e.r[1]),short:`${Math.min(lastR+1,e.r[1])}${u}`,text:`Last time ${lastR}${u}. One more today.`};
  }
  if(allTop){ const st=wStep(exId), nw=+(w+st).toFixed(1); return {w:nw,r:e.r[0],up:true,short:`${nw} kg · ${range}`,text:`Up ${st} kg. You hit ${e.r[1]} on every set last time.`}; }
  return {w,r:Math.min(lastR+1,e.r[1]),short:`${w} kg · ${range}`,text:`Same weight as last time. Try for 1 more rep per set.`};
}
const youtube = id => "https://www.youtube.com/results?search_query="+encodeURIComponent(EX[id].n+" proper form");

/* ---------- planned & actual volume ---------- */
function plannedVolume(sets){
  const v={}; Object.keys(MUSCLES).forEach(k=>v[k]=0);
  planDays().forEach(d=>resolveDay(d).ex.forEach((id,i)=>{const e=EX[id]; if(!e) return; const n=setsFor(d,d.ex[i],{sets});e.m.forEach(m=>v[m]+=n);e.s.forEach(m=>v[m]+=n/2);}));
  return v;
}
function actualVolume(){
  const v={}; Object.keys(MUSCLES).forEach(k=>v[k]=0);
  const t=todayISO();
  const all=[...doneWorkouts(), ...(S.active?[S.active]:[])];
  all.filter(w=>daysBetween(w.date,t)<7).forEach(w=>(w.sets||[]).filter(s=>s.done).forEach(s=>{
    const e=EX[s.ex]; if(!e) return; e.m.forEach(m=>v[m]+=1); e.s.forEach(m=>v[m]+=.5);
  }));
  return v;
}
function zone(n){
  if(n<4) return {k:"low",t:"Low",c:"var(--faint)"};
  if(n<10) return {k:"comeback",t:"Comeback",c:"var(--warn)"};
  if(n<=20) return {k:"growth",t:"Growth",c:"var(--good)"};
  return {k:"over",t:"Overkill",c:"var(--bad)"};
}

/* ---------- anatomy ---------- */
/* Muscle path data: @mjcdev/react-body-highlighter (MIT, © ELABBASSI Hicham). */
/* BODY paths live in js/body.js */
const SLUG = { // our muscle -> anatomy slugs per side
  chest:{f:["chest"]}, shoulders:{f:["deltoids"],b:["deltoids"]}, triceps:{f:["triceps"],b:["triceps"]},
  lats:{b:["upper-back"]}, upper_back:{b:["trapezius","upper-back"]}, rear_delts:{b:["deltoids"]}, biceps:{f:["biceps"]},
  quads:{f:["quadriceps"]}, hamstrings:{b:["hamstring"]}, glutes:{b:["gluteal"]}, calves:{f:["calves"],b:["calves"]},
  abs:{f:["abs","obliques"]}, lower_back:{b:["lower-back"]}
};
const SKIP = new Set(["hair","head","hands","feet","ankles","knees","neck"]);
/* levels: {muscleKey: 0..1} or "hot" ; returns {front:{slug:val}, back:{slug:val}} */
function slugLevels(levels){
  const out={f:{},b:{}};
  for(const [k,v] of Object.entries(levels)){
    const m=SLUG[k]; if(!m) continue;
    for(const side of ["f","b"]) (m[side]||[]).forEach(sl=>{
      const cur=out[side][sl];
      if(v==="hot"||cur==="hot") out[side][sl]="hot";
      else if(v==="plan") out[side][sl]=cur||"plan";
      else out[side][sl]=Math.max(cur==="plan"?0:(cur||0),v);
    });
  }
  return out;
}
function fillFor(v){
  if(v==="hot") return "var(--hot)";
  if(v==="plan") return "var(--m-plan)";
  if(!v) return "var(--m-idle)";
  const pct=Math.round(30+70*Math.min(1,v));
  return `color-mix(in srgb, var(--accent) ${pct}%, var(--m-idle))`;
}
function bodyFig(levels,{tap=false,cls=""}={}){
  const L=slugLevels(levels);
  const side=(key,vb,lv)=>{
    const parts=Object.entries(BODY[key]).map(([slug,ps])=>{
      if(slug==="hair") return "";
      const deco=SKIP.has(slug), v=deco?0:lv[slug];
      const st=deco?'fill="var(--m-skin)"':`style="fill:${fillFor(v)}"`;
      const on=!deco&&v?` class="lit${v==="hot"?" hot":""}"`:"";
      const t=tap&&!deco?` data-act="muscle" data-slug="${slug}" data-side="${key}"`:"";
      return `<g${on}${t}>${ps.map(d=>`<path d="${d}" ${st}/>`).join("")}</g>`;
    }).join("");
    return `<svg class="fig" viewBox="${vb}" aria-hidden="true"><path d="${BODY.outline[key]}" fill="var(--m-skin)" stroke="var(--m-line)" stroke-width="2" vector-effect="non-scaling-stroke"/>${parts}</svg>`;
  };
  const names=Object.keys(levels).filter(k=>levels[k]).map(k=>MUSCLES[k]?.n).filter(Boolean);
  return `<div class="figs ${cls}" role="img" aria-label="${esc(names.length?"Highlighted: "+names.join(", "):"Body diagram")}">
    <div class="figside">${side("front","20 60 684 1380",L.f)}<span>Front</span></div>
    <div class="figside">${side("back","744 60 684 1380",L.b)}<span>Back</span></div></div>`;
}
const exLevels = id => { const e=EX[id], o={}; e.s.forEach(m=>o[m]=.35); e.m.forEach(m=>o[m]=1); return o; };
const dayLevels = d => { const o={}; d.ex.forEach(id=>{ EX[id].s.forEach(m=>o[m]=Math.max(o[m]||0,.35)); EX[id].m.forEach(m=>o[m]=1); }); return o; };
const chipsFor = id => { const e=EX[id]; return e.m.map(k=>`<span class="mchip on">${MUSCLES[k].n}</span>`).join("")+(e.xm||[]).map(n=>`<span class="mchip on">${esc(n)}</span>`).join("")+e.s.map(k=>`<span class="mchip">${MUSCLES[k].n}</span>`).join(""); };
/* the figure card: photos (when the exercise has them) above the body diagram */
const figCard = id => { const e=EX[id], ph=photosHTML(e.lib,e.lc); return `<div class="figcard ${ph?"withph":""}">${ph}${bodyFig(exLevels(id))}<div class="mchips">${chipsFor(id)}</div></div>`; };

/* ---------- shell ---------- */
const ICONS={
 today:'<svg viewBox="0 0 24 24"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11"/></svg>',
 learn:'<svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 8v6m0 0-3 6m3-6 3 6M7 10.5l5-1.5 5 1.5"/></svg>',
 progress:'<svg viewBox="0 0 24 24"><path d="M4 19V11M10 19V6M16 19v-5M22 19H2"/></svg>',
 coach:'<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/></svg>'
};
const GEAR_I='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
const inSession = () => !!(S.active && S.view==="today" && !S.paused);
function renderTabs(){
  const t=$("#tabs"); t.hidden=inSession();
  t.innerHTML=`<div class="tabs-in">${[["today","Train"],["learn","Body"],["progress","Progress"],["coach","Coach"]]
    .map(([k,l])=>`<button class="tab" data-act="tab" data-v="${k}" ${S.view===k?'aria-current="page"':""}>${ICONS[k]}<span>${l}</span></button>`).join("")}</div>`;
}
function render(){
  renderTabs();
  const v=inSession()?viewSession:{today:viewToday,learn:viewLearn,progress:viewProgress,coach:viewCoach}[S.view];
  $("#app").innerHTML=v();
  $("#app").classList.toggle("session",inSession());
  if(S.view==="coach"){ const c=$("#chatEnd"); c&&c.scrollIntoView({block:"end"}); }
  hydratePhotos();
}
function notice(){
  if(S.dbState==="connecting") return `<div class="notice">Loading your log…</div>`;
  if(S.dbState==="off") return `<div class="notice">This browser can't store data (private mode?). Nothing will be saved.</div>`;
  return "";
}
function openSheet(html){ const s=$("#sheet"), card=s.querySelector(".sheet-card");
  if(!s.hidden&&card){ const st=card.scrollTop; card.innerHTML=`<div class="grab"></div>${html}`; card.scrollTop=st; hydratePhotos(); return; } s.innerHTML=`<div class="sheet-bg" data-act="close-sheet"></div><div class="sheet-card" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`; s.hidden=false; hydratePhotos(); }
const sheetTop = () => { const c=document.querySelector("#sheet .sheet-card"); if(c) c.scrollTop=0; };
function closeSheet(){ S.lib=null; dropBuild(); clearTimeout(gymT); if(gymT){ gymT=null; writeSettings(); } $("#sheet").hidden=true; $("#sheet").innerHTML=""; }
function exSheet(id){
  const e=EX[id], ph=phaseFor(currentWeek());
  openSheet(`<div class="stack-l">
    <div><div class="eyebrow">${esc(e.eq)}</div><h2>${esc(e.n)}</h2></div>
    ${figCard(id)}
    <div class="facts"><div><b>${ph.sets}</b><span>sets</span></div><div><b>${e.r[0]}–${e.r[1]}</b><span>${e.timed?"seconds":"reps"}</span></div><div><b>${e.rest>=120?"2m":e.rest+"s"}</b><span>rest</span></div></div>
    ${howTo(id)}
    ${e.lib?`<button class="btn block" data-act="lib-open" data-id="${esc(e.lib)}">See all steps in the library</button>`:""}
    ${e.lc!=null&&e.lib?`<p class="tiny muted center">Photos: Free Exercise DB (public domain)</p>`:""}
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
function howTo(id){
  const e=EX[id];
  return `<div class="how">
    <ol class="cues">${e.cues.slice(0,3).map(c=>`<li>${esc(c)}</li>`).join("")}</ol>
    <div class="avoid"><span>Avoid</span>${esc(e.mist[0])}</div>
    <div class="feelit"><span>You should feel it</span>${esc(e.feel)}</div>
    <div class="links"><a class="pill" href="${youtube(id)}" target="_blank" rel="noopener">▶ Watch demo</a><button class="pill" data-act="ask-ex" data-ex="${id}">✦ Ask coach</button><span class="pill quiet">Swap: ${esc(e.swap)}</span></div></div>`;
}

/* ---------- home ---------- */
function weekDots(){
  const t=new Date(todayISO()+"T12:00:00"), dow=(t.getDay()+6)%7, out=[];
  const done=new Set(doneWorkouts().map(w=>w.date));
  for(let i=0;i<7;i++){
    const d=new Date(t); d.setDate(t.getDate()-dow+i);
    const iso=new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);
    out.push(`<div class="wd ${done.has(iso)?"done":""} ${i===dow?"today":""}"><i></i><span>${"MTWTFSS"[i]}</span></div>`);
  }
  return out.join("");
}
function viewToday(){
  const wk=currentWeek(), ph=phaseFor(wk), day=nextDay(), res=resolveDay(day);
  const n=doneWorkouts().filter(w=>{const d=daysBetween(w.date,todayISO());return d>=0&&d<7;}).length;
  const nSets=res.ex.reduce((a,id,i)=>a+setsFor(day,day.ex[i],ph),0), nSwap=Object.keys(res.swaps).length;
  const mins=Math.round(10+nSets*2.6+6);
  const can=S.dbState==="on"&&S.canWrite;
  const date=new Date().toLocaleDateString(undefined,{weekday:"long",day:"numeric",month:"long"});
  const resume=S.active&&S.paused?`<button class="resume" data-act="resume"><span><b>Workout in progress</b><br><span class="muted">${esc(wLabel(S.active))} · ${(S.active.sets||[]).filter(s=>s.done).length} sets logged</span></span><span class="go">Resume →</span></button><button class="link center" data-act="cancel-session">Discard workout</button>`:"";
  return `${notice()}
  <header class="top"><div class="spread"><div class="muted small">${esc(date)}</div><button class="pill quiet" data-act="gym">${GEAR_I}My gym</button></div><h1 class="hello">${n>=3?"Week done. Nice.":n?`${3-n} more this week`:"Let's ease back in"}</h1>
    <div class="week">${weekDots()}</div></header>
  ${resume}
  ${healthStrip()}
  <section class="hero">
    <div class="hero-top"><div><div class="eyebrow">Next workout · ${esc(dayTag(day))}</div><h2 class="big">${esc(day.name)}</h2></div><div class="mins"><b>${mins}</b><span>min</span></div></div>
    <div class="hero-fig">${bodyFig(dayLevels({ex:res.ex}))}</div>
    <div class="hero-meta"><span>${res.ex.length} exercises</span><span>${day.custom?nSets+" sets":ph.sets+" sets each"}</span><span>${esc(ph.name)}</span>${nSwap?`<span>${nSwap} swapped for your gym</span>`:""}</div>
    ${S.active&&S.paused?"":`<button class="btn primary xl block" data-act="start" data-day="${esc(day.id)}" ${can?"":"disabled"}>Start workout</button>
    <button class="btn block" data-act="free" ${can?"":"disabled"}>Just train (add exercises as you go)</button>`}
    <button class="link" data-act="pick-day">See exercises, pick another day, or make your own</button>
  </section>
  <section class="tip"><div class="eyebrow">This phase</div><p>${esc(ph.note)}</p></section>`;
}
function dayCard(d,ph,can,nid){
  const res=resolveDay(d);
  const rows=res.ex.map((id,i)=>{ const e=EX[id], orig=d.ex[i];
    const tag=res.swaps[id]?`<em class="swp">instead of ${esc(EX[orig].n)}</em>`:res.missing.includes(id)?`<em class="swp miss">Needs ${esc(missingGear(id).join(", "))}</em>`:"";
    return `<button data-act="ex-info" data-ex="${esc(id)}"><span class="exn">${esc(e.n)}${tag}</span><span>${setsFor(d,orig,ph)}×${e.r[0]}–${e.r[1]}${e.timed?"s":""}</span></button>`; }).join("");
  const primary=d.id===nid?"primary":"";
  const acts=d.custom
    ?`<div class="dayacts"><button class="btn ${primary}" data-act="start" data-day="${esc(d.id)}" ${can&&d.ex.length?"":"disabled"}>Start</button><button class="pill" data-act="cd-edit" data-id="${esc(d.id)}">Edit</button><button class="pill quiet" data-act="cd-del" data-id="${esc(d.id)}">Delete</button></div>`
    :`<button class="btn ${primary} block" data-act="start" data-day="${d.id}" ${can?"":"disabled"}>Start Day ${d.id}</button>`;
  return `<div class="daypick"><div class="daypick-fig">${bodyFig(dayLevels({ex:res.ex}),{cls:"mini"})}</div><div class="daypick-main">
      <div class="eyebrow">${esc(dayTag(d))}</div><h3>${esc(d.name)}</h3>
      <div class="exlist">${rows||`<p class="small muted">No exercises yet.</p>`}</div>${acts}</div></div>`;
}
function pickDaySheet(){
  const ph=phaseFor(currentWeek()), can=S.dbState==="on"&&S.canWrite&&!S.active, nid=nextDay().id, cds=customDays(), uc=usingCustom();
  const plan=`<div class="stack-l"><div><h3>The plan</h3><p class="muted small">3 days. Do them in order through the week.</p></div>${DAYS.map(d=>dayCard(d,ph,can,nid)).join("")}</div>`;
  const mine=`<div class="stack-l"><div><h3>My workouts</h3><p class="muted small">${cds.length?"Workouts you made yourself.":"Make your own from any exercises. Handy if your trainer gave you a plan."}</p></div>
    ${cds.map(d=>dayCard(d,ph,can,nid)).join("")}
    <button class="btn block" data-act="cd-new">+ Create a workout</button>
    ${cds.length?`<button class="tick toggle ${uc?"on":""}" data-act="use-custom"><span class="box"></span><span class="tt"><span>Use my own workouts as the plan</span><small>Home rotates through these instead of Days A, B and C.</small></span></button>`:""}</div>`;
  openSheet(`<div class="stack-l"><div class="spread"><h2>Your workouts</h2><button class="pill" data-act="gym" data-from="pick">${GEAR_I}My gym</button></div>
    <p class="muted small">Tap an exercise to learn it.</p>
    ${uc?mine+plan:plan+mine}
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}

/* ---------- workout builder ---------- */
function openBuilder(d){
  S.build=d?{id:d.id,name:d.name,ex:[...d.ex],sets:{...d.sets},isNew:false,q:"",cx:null,newEx:{}}
           :{id:"u_"+uid(),name:"",ex:[],sets:{},isNew:true,q:"",cx:null,newEx:{}};
  builderSheet(); sheetTop();
}
function dropBuild(){ if(S.build){ Object.keys(S.build.newEx||{}).forEach(id=>{ if(!S.settings?.customEx?.[id]) delete EX[id]; }); S.build=null; } }
function builderSheet(){
  const b=S.build, ph=phaseFor(currentWeek()), g=gymSet(), q=b.q.trim().toLowerCase();
  const mnames=e=>e.m.map(m=>MUSCLES[m]?.n).filter(Boolean).join(", ");
  const chosen=b.ex.map((id,i)=>{ const e=EX[id], n=b.sets[id]||ph.sets;
    return `<div class="brow"><div class="bname"><b>${esc(e.n)}</b><span>${esc(mnames(e))} · ${e.r[0]}–${e.r[1]} ${e.timed?"seconds":"reps"}</span></div>
      <div class="bctl"><div class="bsets"><button data-act="b-sets" data-ex="${esc(id)}" data-d="-1" aria-label="Fewer sets">−</button><span>${n} ${n===1?"set":"sets"}</span><button data-act="b-sets" data-ex="${esc(id)}" data-d="1" aria-label="More sets">+</button></div>
      <button class="icon sm" data-act="b-move" data-i="${i}" data-d="-1" ${i?"":"disabled"} aria-label="Move up">↑</button>
      <button class="icon sm" data-act="b-move" data-i="${i}" data-d="1" ${i<b.ex.length-1?"":"disabled"} aria-label="Move down">↓</button>
      <button class="icon sm" data-act="b-rm" data-ex="${esc(id)}" aria-label="Remove ${esc(e.n)}">×</button></div></div>`; }).join("");
  const lib=Object.keys(MUSCLES).map(mk=>{
    const items=Object.entries(EX).filter(([k,e])=>!e.placeholder&&e.m[0]===mk);
    if(!items.length) return "";
    let shown=0;
    const rows=items.map(([k,e])=>{ const on=b.ex.includes(k), miss=!exOK(k,g);
      const key=(e.n+" "+[...e.m,...e.s].map(m=>MUSCLES[m]?.n).join(" ")).toLowerCase(), hide=q&&!key.includes(q); if(!hide) shown++;
      const sub=miss?`<em class="swp miss">Needs ${esc(missingGear(k,g).join(", "))}</em>`:e.custom?`<em class="swp sub">Your exercise</em>`:e.s.length?`<em class="swp sub">Also ${esc(e.s.map(m=>MUSCLES[m].n).join(", "))}</em>`:"";
      return `<button data-act="b-add" data-ex="${esc(k)}" data-key="${esc(key)}" ${hide?"hidden":""}><span class="exn">${esc(e.n)}${sub}</span><span class="badd ${on?"on":""}">${on?"Added ✓":"+ Add"}</span></button>`; }).join("");
    return `<div class="bgrp" data-grp ${shown?"":"hidden"}><div class="eyebrow">${MUSCLES[mk].n}</div><div class="exlist">${rows}</div></div>`;
  }).join("");
  const cx=b.cx;
  const cxForm=cx?`<div class="card"><h3>Your own exercise</h3>
      <label class="f" for="cx-n">Name<input id="cx-n" data-act="b-cx" data-k="n" value="${esc(cx.n)}" placeholder="e.g. Cable kickback" maxlength="60"></label>
      <label class="f" for="cx-m">Main muscle<select id="cx-m" data-act="b-cx" data-k="m">${Object.entries(MUSCLES).map(([k,m])=>`<option value="${k}" ${cx.m===k?"selected":""}>${m.n}</option>`).join("")}</select></label>
      <label class="f" for="cx-nd">Needs (optional)<select id="cx-nd" data-act="b-cx" data-k="nd"><option value="">Nothing special</option>${allEquip().map(([k,n])=>`<option value="${esc(k)}" ${cx.nd===k?"selected":""}>${esc(n)}</option>`).join("")}</select></label>
      <div class="grid2"><label class="f" for="cx-lo">Reps, low<input id="cx-lo" inputmode="numeric" data-act="b-cx" data-k="lo" value="${esc(cx.lo)}"></label><label class="f" for="cx-hi">Reps, high<input id="cx-hi" inputmode="numeric" data-act="b-cx" data-k="hi" value="${esc(cx.hi)}"></label></div>
      <div class="grid2"><button class="tick toggle ${cx.wt?"on":""}" data-act="b-cxwt" data-v="1"><span class="box"></span><span>Weighted</span></button><button class="tick toggle ${cx.wt?"":"on"}" data-act="b-cxwt" data-v="0"><span class="box"></span><span>Bodyweight</span></button></div>
      <button class="btn primary block" data-act="b-cxadd">Add to workout</button><button class="link center" data-act="b-cxcancel">Cancel</button></div>`
    :`<button class="btn block" data-act="b-cxopen">+ Add your own exercise</button>`;
  openSheet(`<div class="stack-l"><div><div class="eyebrow">My workouts</div><h2>${b.isNew?"Create a workout":"Edit workout"}</h2></div>
    <label class="f" for="b-name">Name<input id="b-name" data-act="b-name" value="${esc(b.name)}" placeholder="e.g. Upper body" maxlength="40"></label>
    <div class="stack-l" style="gap:8px"><div class="spread"><h3>Exercises</h3><span class="small muted">${b.ex.length?b.ex.length+" added":""}</span></div>
      ${chosen||`<div class="note">Add exercises from the list below. 4 to 6 is plenty.</div>`}</div>
    <div class="stack-l" style="gap:10px"><h3>Add exercises</h3>
      <input id="b-q" type="search" data-act="b-q" value="${esc(b.q)}" placeholder="Search, e.g. chest or curl" aria-label="Search exercises">
      ${lib}
      <p class="small muted" id="b-none" hidden>Nothing matches. Try another word, or add your own below.</p>
      ${cxForm}</div>
    <div class="bfoot"><button class="btn primary xl block" data-act="b-save">${b.isNew?"Save workout":"Save changes"}</button><button class="btn ghost block" data-act="b-cancel">Cancel</button></div></div>`);
  filterLib();
}
function filterLib(){
  const q=(S.build?.q||"").trim().toLowerCase(); let any=false;
  document.querySelectorAll("#sheet [data-grp]").forEach(gEl=>{ let shown=0;
    gEl.querySelectorAll('[data-act="b-add"]').forEach(x=>{ const h=!!q&&!x.dataset.key.includes(q); x.hidden=h; if(!h) shown++; });
    gEl.hidden=!shown; if(shown) any=true; });
  const none=$("#b-none"); if(none) none.hidden=any;
}
async function saveBuild(btn){
  const b=S.build; if(!b) return;
  const name=b.name.trim(), ph=phaseFor(currentWeek());
  if(!name){ toast("Give it a name first"); $("#b-name")?.focus(); return; }
  if(!b.ex.length){ toast("Add at least one exercise"); return; }
  if(!canSave()) return;
  const day={id:b.id,name,ex:[...b.ex],sets:Object.fromEntries(b.ex.map(id=>[id,b.sets[id]||ph.sets]))};
  const list=(S.settings?.customDays||[]).slice(), i=list.findIndex(d=>d.id===b.id);
  if(i>=0) list[i]=day; else list.push(day);
  btn.disabled=true;
  const ok=await saveSettings({customDays:list,customEx:{...(S.settings?.customEx||{}),...b.newEx}});
  if(!ok){ btn.disabled=false; return; }
  const isNew=b.isNew; S.build=null; pickDaySheet(); sheetTop(); render(); toast(isNew?"Workout saved":"Changes saved");
}

/* ---------- my gym sheet ---------- */
function gymSheet(){
  const keys=allEqKeys(), g=gymSet()||new Set(keys), nOn=keys.filter(k=>g.has(k)).length, all=nOn===keys.length, ce=customEquip();
  let sw=0, miss=0; planDays().forEach(d=>{ const r=resolveDay(d); sw+=Object.keys(r.swaps).length; miss+=r.missing.length; });
  const sum=!sw&&!miss?"Everything in your plan fits your gym.":[sw?`${sw} ${sw===1?"exercise":"exercises"} in your plan will be swapped.`:"",miss?`${miss} ${miss===1?"has":"have"} no swap and will be marked so you can skip ${miss===1?"it":"them"}.`:""].filter(Boolean).join(" ");
  openSheet(`<div class="stack-l"><div><div class="eyebrow">Settings</div><h2>My gym</h2></div>
    <p class="muted small">Tick what your gym has. Exercises that need something missing get swapped automatically.</p>
    <div class="spread"><span class="small muted">${nOn} of ${keys.length} ticked</span><button class="pill" data-act="gym-all">${all?"Clear all":"Select all"}</button></div>
    <div class="ticks">${EQUIP.map(([k,n])=>`<button class="tick toggle ${g.has(k)?"on":""}" data-act="gym-t" data-k="${k}"><span class="box"></span><span>${esc(n)}</span></button>`).join("")}</div>
    ${ce.length?`<div class="eyebrow">Added by you</div><div class="ticks">${ce.map(c=>`<div class="tickrow"><button class="tick toggle ${g.has(c.id)?"on":""}" data-act="gym-t" data-k="${esc(c.id)}"><span class="box"></span><span>${esc(c.name)}</span></button><button class="pill quiet" data-act="ce-del" data-id="${esc(c.id)}" aria-label="Remove ${esc(c.name)}">×</button></div>`).join("")}</div>`:""}
    <div class="stack-l" style="gap:6px"><label class="small" for="ce-in" style="font-weight:700">+ Add equipment</label>
      <div class="ceadd"><input id="ce-in" placeholder="e.g. Hack squat machine" maxlength="40" autocomplete="off"><button class="btn" data-act="ce-add">Add</button></div>
      <p class="tiny muted">Something your gym has that isn't listed. You can pick it when you make your own exercise.</p></div>
    <div class="bfoot"><p class="small muted center" style="padding:0 0 6px">${esc(sum)}</p><button class="btn primary xl block" data-act="gym-done">Done</button></div></div>`);
}
let gymT=null;
function setGym(arr){ if(!canSave()) return; S.settings={...(S.settings||{}),equipment:arr}; gymSheet(); render(); clearTimeout(gymT); gymT=setTimeout(writeSettings,500); }

/* ---------- session ---------- */
function viewSession(){
  const w=S.active, day=sessionDay(w);
  const total=day.ex.length+2, cur=S.step===0?0:S.step===1?1+S.exIdx:S.step===2?total-1:total;
  const exDone=x=>{const ss=w.sets.filter(s=>s.ex===x);return ss.length&&ss.every(s=>s.done);};
  const segs=[`<i class="${S.step>0?"done":S.step===0?"cur":""}"></i>`,...day.ex.map((x,i)=>`<i class="${exDone(x)?"done":""} ${S.step===1&&S.exIdx===i?"cur":""}"></i>`),`<i class="${S.step>2?"done":S.step===2?"cur":""}"></i>`].join("");
  const bar=`<div class="sbar"><button class="icon" data-act="pause" aria-label="Pause and go home">✕</button><button class="segs" data-act="session-list" aria-label="Exercise list: jump, reorder or remove">${segs}</button><button class="pill quiet num" data-act="session-list">${Math.min(cur+1,total)}/${total} ☰</button></div>`;
  let body="";
  if(S.step===0) body=warmView(day);
  else if(S.step===1) body=day.ex.length?liftView(day,Math.min(S.exIdx,day.ex.length-1)):emptyLiftView();
  else if(S.step===2) body=stretchView(day);
  else body=finishView(day);
  return bar+body;
}
function tickList(items,kind){
  const o=S.active[kind]||{};
  return `<div class="ticks">${items.map(([k,t,extra])=>`<div class="tickrow"><button class="tick ${o[k]?"on":""}" data-act="${kind}" data-k="${k}"><span class="box"></span><span>${esc(t)}</span></button>${extra||""}</div>`).join("")}</div>`;
}
function warmView(day){
  const items=[["cardio","5 min easy cardio · bike or incline walk"],...day.warm.map((t,i)=>[String(i),t])];
  return `<section class="stage"><div class="eyebrow">Step 1</div><h1 class="title">Warm up</h1><p class="muted">About 8 minutes. Gets the joints moving so the lifts feel smoother.</p></section>
    ${tickList(items,"warm")}
    <div class="note">First exercise: do 2 light practice sets before your real ones. Don't log them.</div>
    <div class="dock"><button class="btn primary xl block" data-act="step" data-i="1">I'm warm · start lifting</button></div>`;
}
/* cool-down: one static stretch per muscle actually trained, from Free Exercise DB (photos included) */
const STRETCHES={
  quads:[["Quad_Stretch","Standing quad stretch","each leg"],["Kneeling_Hip_Flexor","Kneeling hip flexor stretch","each side"]],
  hamstrings:[["Seated_Floor_Hamstring_Stretch","Seated hamstring stretch",""],["Standing_Toe_Touches","Standing toe touch",""]],
  glutes:[["Seated_Glute","Figure-4 glute stretch","each side"],["Knee_Across_The_Body","Knee across the body","each side"]],
  calves:[["Calf_Stretch_Hands_Against_Wall","Wall calf stretch","each leg"]],
  chest:[["Chest_And_Front_Of_Shoulder_Stretch","Doorway chest stretch",""],["Elbows_Back","Elbows back",""]],
  shoulders:[["Shoulder_Stretch","Cross-body shoulder stretch","each arm"],["Seated_Front_Deltoid","Front shoulder stretch",""]],
  rear_delts:[["Shoulder_Stretch","Cross-body shoulder stretch","each arm"]],
  triceps:[["Overhead_Triceps","Overhead triceps stretch","each arm"]],
  biceps:[["Standing_Biceps_Stretch","Biceps wall stretch","each arm"]],
  lats:[["Overhead_Lat","Overhead lat stretch","each side"],["Side-Lying_Floor_Stretch","Side-lying lat stretch","each side"]],
  upper_back:[["Upper_Back_Stretch","Upper back stretch",""],["Childs_Pose","Child's pose",""]],
  lower_back:[["Childs_Pose","Child's pose",""],["Hug_Knees_To_Chest","Knees to chest",""]],
  abs:[["Looking_At_Ceiling","Cobra · look at the ceiling",""],["Standing_Lateral_Stretch","Side reach","each side"]]
};
function coolDownFor(w){
  const score={}; (w.sets||[]).filter(s=>s.done).forEach(s=>{ const e=EX[s.ex]; if(!e) return; e.m.forEach(m=>score[m]=(score[m]||0)+1); e.s.forEach(m=>score[m]=(score[m]||0)+.5); });
  const order=Object.keys(score).filter(m=>STRETCHES[m]).sort((a,b)=>score[b]-score[a]);
  const out=[], used=new Set();
  order.forEach(m=>{ const pick=STRETCHES[m].find(s=>!used.has(s[0])); if(pick&&out.length<6){ used.add(pick[0]); out.push({id:pick[0],n:pick[1],per:pick[2],m}); } });
  return out;
}
function stretchView(day){
  const w=S.active, picks=coolDownFor(w), o=w.cool||{};
  const rows=picks.length?picks.map(p=>`<div class="tickrow"><button class="tick ${o[p.id]?"on":""}" data-act="cool" data-k="${esc(p.id)}"><span class="box"></span><img class="tickph" src="${photoSrc(p.id,1)}" alt="" loading="lazy" onerror="this.hidden=true"><span class="tt"><span>${esc(p.n)}</span><small>${esc(MUSCLES[p.m]?.n||"")}${p.per?" · "+p.per:""}</small></span></button><button class="pill" data-act="hold" data-n="${esc(p.n)}">40s</button></div>`).join("")
    :day.cool.map((t,i)=>`<div class="tickrow"><button class="tick ${o[i]?"on":""}" data-act="cool" data-k="${i}"><span class="box"></span><span>${esc(t)}</span></button><button class="pill" data-act="hold" data-n="${esc(t)}">40s</button></div>`).join("");
  return `<section class="stage"><div class="eyebrow">Last step</div><h1 class="title">Stretch</h1><p class="muted">${picks.length?"Picked for the muscles you trained today.":"A few gentle stretches."} Hold each 30–45 seconds. Gentle, never painful.</p></section>
    <div class="ticks">${rows}</div>
    <p class="tiny muted center">Tap a photo's name to tick it off · 40s starts a hold timer</p>
    <div class="dock"><button class="btn primary xl block" data-act="step" data-i="3">Finish workout</button></div>`;
}
/* live muscle map: shade by sets logged per muscle; planned-but-not-done shows in grey */
function sessionLevels(w){
  const lv={}, day=sessionDay(w), done=(w.sets||[]).filter(s=>s.done), cnt={};
  done.forEach(s=>{ const e=EX[s.ex]; if(!e) return; e.m.forEach(m=>cnt[m]=(cnt[m]||0)+1); e.s.forEach(m=>cnt[m]=(cnt[m]||0)+.5); });
  Object.keys(cnt).forEach(m=>lv[m]=Math.min(1,.3+cnt[m]/6*.7));
  day.ex.forEach(id=>{ const e=EX[id]; if(!e) return; [...e.m,...e.s].forEach(m=>{ if(!lv[m]) lv[m]="plan"; }); });
  return lv;
}
function finishView(day){
  const w=S.active, done=(w.sets||[]).filter(s=>s.done);
  const mins=Math.max(1,Math.round((Date.now()-new Date(w.startedAt).getTime())/6e4));
  const lv=sessionLevels(w);
  return `<section class="stage center"><div class="eyebrow">Workout complete</div><h1 class="title">Nice work. You showed up.</h1></section>
    <div class="facts"><div><b>${mins}</b><span>minutes</span></div><div><b>${done.length}</b><span>sets</span></div><div><b>${new Set(done.map(s=>s.ex)).size}</b><span>exercises</span></div></div>
    ${(()=>{ const h=sessionHR(w,Date.now()); return h?`<div class="hrline"><span class="heart">♥</span><span>Heart rate <b class="num">avg ${h.avg}</b> <span class="muted">·</span> <b class="num">peak ${h.max}</b> <span class="muted small">bpm</span></span></div>`:`<p class="small muted">Heart rate from your watch appears here after the next sync.</p>`; })()}
    <div class="figcard">${bodyFig(lv)}<div class="small muted center">What you trained today</div></div>
    <section class="card"><h3>How was it overall?</h3>
      <div class="feel">${[[4,"Easy"],[7,"Just right"],[9,"Brutal"]].map(([v,l])=>`<button class="${w.rpe===v?"on":""}" data-act="rpe" data-v="${v}"><b>${l}</b></button>`).join("")}</div></section>
    <details class="card"><summary>Add watch data or a note</summary>
      <div class="stack-l" style="margin-top:12px"><div class="grid2"><label class="f" for="f-hr">Avg heart rate<input id="f-hr" inputmode="numeric" value="${esc(w.avgHr??"")}" data-act="field" data-k="avgHr" placeholder="bpm"></label>
      <label class="f" for="f-kcal">Calories<input id="f-kcal" inputmode="numeric" value="${esc(w.kcal??"")}" data-act="field" data-k="kcal" placeholder="kcal"></label></div>
      <label class="f" for="f-notes">Note<textarea id="f-notes" data-act="field" data-k="notes" placeholder="e.g. knee felt tight on lunges">${esc(w.notes||"")}</textarea></label></div></details>
    <div class="dock"><button class="btn primary xl block" data-act="finish">Save workout</button></div>`;
}
function emptyLiftView(){
  return `<section class="stage"><div class="eyebrow">Step 2</div><h1 class="title">Add your first exercise</h1><p class="muted">Pick what your trainer shows you. Add the next one when you get to it.</p></section>
    <button class="btn primary xl block" data-act="add-ex">+ Add exercise</button>
    <div class="note">Not sure of the name? Ask your trainer, then search for it. You can also browse by muscle.</div>
    <div class="row center"><button class="link" data-act="step" data-i="0">← Back to warm-up</button><button class="link" data-act="step" data-i="2">Skip to stretching</button></div>`;
}
/* dumbbell exercises: the number you log is per dumbbell; show the total too */
const perHand = e => /dumbbell|kettlebell/i.test(e.eq||"") && !/\bone (dumbbell|kettlebell)|single|held at the chest/i.test(e.eq||"");
const fmtKg = v => (+v).toFixed(1).replace(/\.0$/,"");
/* weights he has used for this exercise recently, most recent first */
function recentWeights(id){
  const out=[]; for(const w of doneWorkouts()){ (w.sets||[]).forEach(s=>{ if(s.ex===id&&s.done&&+s.w>0&&!out.includes(+s.w)) out.push(+s.w); }); if(out.length>=4) break; }
  return out.slice(0,4).sort((a,b)=>a-b);
}
/* only the part that changes when a set is logged: re-rendered in place, so photos and scroll stay put */
function loggerHTML(day,idx){
  const w=S.active, id=day.ex[idx], e=EX[id], free=w.dayId==="free";
  const sets=(w.sets||[]).filter(s=>s.ex===id), cur=sets.find(s=>!s.done), ci=cur?sets.indexOf(cur):-1;
  const isLast=idx===day.ex.length-1, bw=e.inc===0, unit=e.timed?"seconds":"reps", ph=perHand(e);
  const pips=sets.map((s,i)=>`<i class="${s.done?"done":i===ci?"cur":""}"></i>`).join("");
  const grp=groupOf(id), mates=grp?grp.filter(x=>x!==id).map(x=>EX[x]?.n).filter(Boolean):[];
  const qw=bw?[]:recentWeights(id);
  const logger=cur?`<section class="logger">
      <div class="spread"><div class="setlabel">Set ${ci+1} <span class="muted">of ${sets.length}</span></div><div class="setpips">${pips}</div></div>
      ${mates.length?`<div class="hint grp">⇄ Superset with ${esc(mates.join(" + "))} · no rest in between</div>`:""}
      ${S.hint?`<div class="hint">${esc(S.hint)}</div>`:""}
      <div class="steppers ${bw?"one":""}">
        ${bw?"":stepper(cur,"w",ph?"kg each hand":"kg")}
        ${stepper(cur,"r",unit+(e.per?" "+e.per:""))}
      </div>
      ${ph&&+cur.w>0?`<p class="tiny muted center" style="margin-top:-6px">Each hand ${fmtKg(cur.w)} kg · <b class="num" id="tot-${cur.k}">${fmtKg(cur.w*2)} kg</b> total</p>`:""}
      ${qw.length?`<div class="row center quickw">${qw.map(v=>`<button class="pill ${+cur.w===v?"on":""}" data-act="setw" data-k="${cur.k}" data-v="${v}">${fmtKg(v)} kg</button>`).join("")}<button class="pill quiet" data-act="wstep" data-ex="${id}" aria-label="Change weight step">± ${wStep(id)}</button></div>`
        :bw?"":`<div class="row center"><button class="pill quiet" data-act="wstep" data-ex="${id}">Steps of ${wStep(id)} kg · change</button></div>`}
      <div class="q">Done the set? Tap how it felt to log it</div>
      <div class="feel">${FEEL.map(f=>`<button data-act="log" data-k="${cur.k}" data-feel="${f.k}" class="f-${f.k}"><b>✓ ${f.n}</b><span>${f.d}</span></button>`).join("")}</div>
      <div class="row center"><button class="link" data-act="add-set" data-ex="${id}">+ Add a set</button>${sets.length>1?`<button class="link" data-act="del-set" data-ex="${id}">Remove a set</button>`:""}</div>
    </section>`
    :`<section class="logger done"><div class="setlabel">All ${sets.length} sets done ✓</div>
      ${free&&isLast?`<button class="btn primary xl block" data-act="add-ex">+ Add next exercise</button>`:`<button class="btn primary xl block" data-act="${isLast?"step":"goto"}" data-i="${isLast?2:idx+1}">${isLast?"Done lifting · go stretch":"Next · "+esc(EX[day.ex[idx+1]].n)}</button>`}
      <div class="row center"><button class="link" data-act="add-set" data-ex="${id}">+ One more set</button>${free&&isLast?`<button class="link" data-act="step" data-i="2">Done lifting · go stretch</button>`:""}</div></section>`;
  const logged=sets.filter(s=>s.done).map(s=>`<button class="pill" data-act="undo" data-k="${s.k}" title="Tap to undo"><span class="num">${bw?"":fmtKg(s.w)+" kg × "}${s.r}${e.timed?"s":""}</span><span class="dotf f-${s.feel}"></span></button>`).join("");
  return `${logger}${logged?`<div class="logged"><span class="small muted">Logged · tap one to undo</span>${logged}</div>`:""}`;
}
function updateLogger(){
  const day=sessionDay(S.active), idx=Math.min(S.exIdx,day.ex.length-1), el=$("#logwrap");
  if(el&&idx>=0) el.innerHTML=loggerHTML(day,idx); else render();
}
function liftView(day,idx){
  const w=S.active, id=day.ex[idx], e=EX[id], t=targetFor(id), free=w.dayId==="free";
  const isLast=idx===day.ex.length-1, firstTime=!lastSetsFor(id,w.id);
  const open=S.howOpen[id]??firstTime;
  return `<section class="exhead"><div class="eyebrow">Exercise ${idx+1} of ${day.ex.length}${e.eq?` · ${esc(e.eq)}`:""}</div><h1 class="title">${esc(e.n)}</h1>
      <div class="target"><span class="tl">Today</span><b>${esc(t.short)}</b>${t.up?`<span class="up">↑ level up</span>`:""}</div>
      <p class="muted small">${esc(t.text)}</p></section>
    ${swapNote(w,id)}
    <div id="logwrap">${loggerHTML(day,idx)}</div>
    <details class="howbox" data-how="${esc(id)}" ${open?"open":""}>
      <summary><div class="howthumbs">${e.lib&&e.lc!=null?`<img src="${photoSrc(e.lib,0)}" alt="" loading="lazy" onerror="this.hidden=true"><img src="${photoSrc(e.lib,1)}" alt="" loading="lazy" onerror="this.hidden=true">`:bodyFig(exLevels(id),{cls:"mini"})}</div>
        <div class="howtxt"><b>How to do it</b><span class="small muted">${esc(e.feel||e.m.map(m=>MUSCLES[m].n).join(", "))}</span></div><span class="chev">›</span></summary>
      <div class="howbody">${figCard(id)}${howTo(id)}</div>
    </details>
    <div class="navrow"><button class="btn" data-act="${idx===0?"step":"goto"}" data-i="${idx===0?0:idx-1}">← Back</button><button class="btn" data-act="${isLast?"step":"goto"}" data-i="${isLast?2:idx+1}">${isLast?"Stretch":"Skip ahead"} →</button></div>
    ${free&&isLast&&!w.sets.some(s=>s.ex===id&&!s.done)?"":`<button class="btn block" data-act="add-ex">+ Add exercise</button>`}`;
}
function swapNote(w,id){
  const orig=w.swaps?.[id];
  if(orig&&EX[orig]){ const mg=missingGear(orig); return `<p class="swapnote"><b>↻</b><span>Swapped from ${esc(EX[orig].n)}. ${mg.length?`Your gym has no ${esc(mg.join(" or "))}.`:"Picked to fit your gym."}</span></p>`; }
  if((w.missing||[]).includes(id)){ const mg=missingGear(id); return `<p class="swapnote miss"><b>!</b><span>${mg.length?`Needs ${esc(mg.join(", "))}, which isn't ticked in My gym.`:"Your gym may not have what this needs."} Skip ahead if you can't do it.</span></p>`; }
  return "";
}
/* ---------- session list: jump, reorder, remove, superset ---------- */
const groupOf = id => (S.active?.groups||[]).find(g=>g.includes(id))||null;
function cleanGroups(w){
  const ex=sessionDay(w).ex;
  w.groups=(w.groups||[]).map(g=>g.filter(x=>ex.includes(x)).sort((a,b)=>ex.indexOf(a)-ex.indexOf(b))).filter(g=>g.length>1);
}
function sessionListSheet(){
  const w=S.active; if(!w) return; cleanGroups(w);
  const day=sessionDay(w), ex=day.ex, gs=w.groups||[];
  const rows=ex.map((id,i)=>{ const e=EX[id], ss=w.sets.filter(s=>s.ex===id), d=ss.filter(s=>s.done).length, gi=gs.findIndex(g=>g.includes(id));
    const paired=i<ex.length-1&&gi>=0&&gs[gi].includes(ex[i+1]);
    return `<div class="srow ${S.step===1&&S.exIdx===i?"cur":""} ${d&&d===ss.length?"done":""}">
      <button class="sname" data-act="goto" data-i="${i}" data-close="1"><span class="sn num">${i+1}</span><span class="exn">${esc(e.n)}${gi>=0?`<em class="swp">⇄ Superset ${gi+1}</em>`:""}</span><span class="num muted small">${d}/${ss.length}</span></button>
      <div class="sctl"><button class="icon sm" data-act="s-move" data-i="${i}" data-d="-1" ${i?"":"disabled"} aria-label="Move up">↑</button><button class="icon sm" data-act="s-move" data-i="${i}" data-d="1" ${i<ex.length-1?"":"disabled"} aria-label="Move down">↓</button><button class="icon sm ${paired?"on":""}" data-act="s-pair" data-i="${i}" ${i<ex.length-1?"":"disabled"} aria-label="${paired?"Unpair from next":"Superset with next"}" title="Superset with the next exercise">⇄</button><button class="icon sm" data-act="s-rm" data-i="${i}" aria-label="Remove ${esc(e.n)}">×</button></div></div>`; }).join("");
  openSheet(`<div class="stack-l"><div><div class="eyebrow">${esc(wLabel(w))}</div><h2>Today's exercises</h2></div>
    <div class="figcard"><div class="livemap">${bodyFig(sessionLevels(w),{cls:"mini"})}</div><div class="heatkey"><span><i style="background:${fillFor(.6)}"></i>Trained · darker = more sets</span><span><i style="background:var(--m-plan)"></i>Still to do</span></div></div>
    <div class="slist">${rows||`<p class="small muted">Nothing added yet.</p>`}</div>
    <p class="tiny muted">Tap a name to jump to it. ⇄ pairs it with the next one as a superset: you alternate sets and rest after each round.</p>
    <button class="btn block" data-act="add-ex">+ Add exercise</button>
    <div class="row"><button class="link" data-act="step" data-i="0" data-close="1">Warm-up</button><button class="link" data-act="step" data-i="2" data-close="1">Stretch</button></div>
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
function moveEx(i,d){
  const w=S.active, ex=[...sessionDay(w).ex], j=i+d; if(j<0||j>=ex.length) return;
  [ex[i],ex[j]]=[ex[j],ex[i]]; w.exList=ex; cleanGroups(w);
  const curId=sessionDay(w).ex[S.exIdx]; if(S.exIdx===i) S.exIdx=j; else if(S.exIdx===j) S.exIdx=i;
  sessionListSheet(); saveActiveSoon();
}
function removeEx(i){
  const w=S.active, ex=[...sessionDay(w).ex], id=ex[i]; if(!id) return;
  const kept=w.sets.filter(s=>s.ex===id&&s.done).length;
  ex.splice(i,1); w.exList=ex; w.sets=w.sets.filter(s=>s.ex!==id||s.done); cleanGroups(w);
  if(S.exIdx>i) S.exIdx--; S.exIdx=Math.max(0,Math.min(S.exIdx,ex.length-1));
  sessionListSheet(); saveActiveSoon(); toast(kept?`Removed. ${kept} logged ${kept===1?"set stays":"sets stay"} in your history.`:"Removed");
}
function togglePair(i){
  const w=S.active, ex=sessionDay(w).ex, a=ex[i], b=ex[i+1]; if(!b) return; cleanGroups(w);
  let gs=w.groups||[]; const ga=gs.find(g=>g.includes(a)), gb=gs.find(g=>g.includes(b));
  if(ga&&ga===gb){ const ia=ga.indexOf(a), left=ga.slice(0,ia+1), right=ga.slice(ia+1); gs=gs.filter(g=>g!==ga); if(left.length>1) gs.push(left); if(right.length>1) gs.push(right); }
  else { const merged=[...(ga||[a]),...(gb||[b])]; gs=gs.filter(g=>g!==ga&&g!==gb); gs.push(merged); }
  w.groups=gs; cleanGroups(w); sessionListSheet(); saveActiveSoon();
}
function stepper(s,f,label){
  return `<div class="stepper"><div class="ctl"><button data-act="nudge" data-k="${s.k}" data-f="${f}" data-d="-1" aria-label="Decrease ${label}">−</button>
    <input id="s-${s.k}-${f}" inputmode="decimal" value="${esc(s[f])}" placeholder="0" data-act="set" data-k="${s.k}" data-f="${f}" aria-label="${label}">
    <button data-act="nudge" data-k="${s.k}" data-f="${f}" data-d="1" aria-label="Increase ${label}">+</button></div><span class="lbl">${esc(label)}</span></div>`;
}
const FEEL=[{k:"easy",n:"Easy",d:"could do 4+ more",rir:"4"},{k:"good",n:"Good",d:"2–3 left",rir:"2"},{k:"tough",n:"Tough",d:"barely made it",rir:"0"}];

/* ---------- body (learn) ---------- */
function viewLearn(){
  const ph=phaseFor(currentWeek()), plan=plannedVolume(ph.sets), act=actualVolume();
  const lv={}; Object.keys(MUSCLES).forEach(k=>{ const a=act[k]; lv[k]=a>20?"hot":a<=0?0:Math.min(1,.15+a/10*.85); });
  const sel=S.selMuscle;
  let panel=`<div class="mpanel muted small">Tap a muscle to see how much it's been trained and which exercises work it.</div>`;
  if(sel){
    const a=act[sel], p=plan[sel], z=zone(a);
    const exs=Object.entries(EX).filter(([k,e])=>e.m.includes(sel)||e.s.includes(sel));
    panel=`<div class="mpanel"><div class="spread"><h3>${MUSCLES[sel].n}</h3><span class="zone z-${z.k}">${z.t}</span></div>
      <div class="meter"><i style="width:${Math.min(100,a/20*100)}%"></i><b style="left:${Math.min(100,p/20*100)}%"></b></div>
      <div class="small muted"><span class="num">${+a.toFixed(1)}</span> ${a===1?"set":"sets"} in the last 7 days · plan <span class="num">${+p.toFixed(1)}</span></div>
      <div class="exlist">${exs.map(([k,e])=>`<button data-act="ex-info" data-ex="${k}">${esc(e.n)}<span>${e.m.includes(sel)?"main":"helper"}</span></button>`).join("")}</div></div>`;
  }
  return `<header class="top"><div class="spread"><div class="eyebrow">Last 7 days</div><button class="pill" data-act="lib">Exercise library</button></div><h1 class="hello">Your body this week</h1>
    <p class="muted small">The brighter a muscle, the more it's been worked. 10–20 hard sets a week is the sweet spot.</p></header>
    <div class="figcard big">${bodyFig(lv,{tap:true})}
      <div class="heatkey"><span><i style="background:var(--m-idle)"></i>Not yet</span><span><i style="background:${fillFor(.3)}"></i>Started</span><span><i style="background:${fillFor(1)}"></i>Sweet spot</span><span><i style="background:var(--hot)"></i>Too much</span></div></div>
    ${panel}
    <section class="card"><h3>The basics, in one minute each</h3>${BASICS.map(b=>`<details class="acc"><summary>${esc(b.t)}</summary><p class="small">${esc(b.b)}</p></details>`).join("")}</section>
    <button class="btn block" data-act="lib">Browse all exercises</button>`;
}

/* ---------- exercise library sheet (browse, or pick for a session) ---------- */
function libSheet(o){
  S.lib={mode:"browse",q:"",grp:"",mine:!!gymSet(),n:40,open:null,err:false,scroll:0,...(o||{})};
  libRender(); sheetTop();
  loadLib().then(()=>{ if(S.lib){ S.lib.err=false; libRender(); } }).catch(()=>{ if(S.lib){ S.lib.err=true; libRender(); } });
}
const recentEx = () => { const out=[]; doneWorkouts().forEach(w=>(w.sets||[]).forEach(s=>{ if(s.done&&EX[s.ex]&&!EX[s.ex].placeholder&&!out.includes(s.ex)) out.push(s.ex); })); return out.slice(0,6); };
const normName = s => String(s||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
/* everyday names trainers use → what the library calls it */
const ALIAS={"squat press":"thruster","squat to press":"thruster","squat overhead press":"thruster","squat to overhead press":"thruster","squat and press":"thruster",
  "chest fly":"fly","pec fly":"butterfly","pec deck":"butterfly","chest flies":"fly","flyes":"flyes","lat pull down":"lat pulldown","lat pulldowns":"lat pulldown","pull downs":"pulldown",
  "rdl":"romanian deadlift","rdls":"romanian deadlift","stiff leg deadlift":"stiff legged deadlift","skull crusher":"lying triceps extension","skull crushers":"lying triceps extension",
  "sit up":"sit-up","situp":"sit-up","sit ups":"sit-up","crunches":"crunch","pull up":"pull-up","pullup":"pull-up","pull ups":"pull-up","chin up":"chin-up","chin ups":"chin-up",
  "push up":"pushups","pushup":"pushups","push ups":"pushups","press up":"pushups","bench":"bench press","flat bench":"bench press","incline bench":"incline bench press",
  "shoulder press":"shoulder press","military press":"shoulder press","overhead press":"shoulder press","ohp":"shoulder press","side raises":"lateral raise","side raise":"lateral raise","lat raises":"lateral raise","delt raises":"lateral raise",
  "rear delt fly":"reverse flyes","rear delt flies":"reverse flyes","reverse fly":"reverse flyes","face pulls":"face pull","upright rows":"upright row",
  "tricep pushdown":"triceps pushdown","tricep pushdowns":"triceps pushdown","rope pushdown":"triceps pushdown","tricep extension":"triceps extension","tricep kickback":"tricep kickback","kickbacks":"kickback","dips":"dips","bench dip":"bench dips",
  "bicep curl":"curl","bicep curls":"curl","curls":"curl","hammer curls":"hammer curls","preacher curls":"preacher curl","concentration curls":"concentration curl",
  "leg press":"leg press","leg extensions":"leg extensions","leg curls":"leg curl","hamstring curl":"leg curl","hamstring curls":"leg curl","calf raises":"calf raise","calves":"calf raise",
  "goblet squats":"goblet squat","squats":"squat","air squat":"bodyweight squat","sumo squat":"plie dumbbell squat","sumo squats":"plie dumbbell squat","split squat":"split squat","bulgarian split squat":"split squat","bulgarians":"split squat","lunges":"lunge","walking lunges":"dumbbell lunges","reverse lunges":"reverse lunge","step up":"step-up","step ups":"step-up",
  "hip thrusts":"hip thrust","glute bridges":"glute bridge","bridge":"glute bridge","kickback":"kickback","glute kickback":"kickback","cable kickback":"kickback","donkey kicks":"glute kickback","fire hydrant":"fire hydrant",
  "rows":"row","bent over row":"bent over barbell row","bent over rows":"bent over barbell row","db row":"one-arm dumbbell row","single arm row":"one-arm dumbbell row","one arm row":"one-arm dumbbell row","cable rows":"seated cable rows","seated row":"seated cable rows","machine row":"seated cable rows","t bar row":"t-bar row",
  "deadlifts":"deadlift","kb swing":"kettlebell swing","kettlebell swings":"kettlebell swing","swings":"kettlebell swing","farmers walk":"farmer's walk","farmer carry":"farmer's walk","farmers carry":"farmer's walk",
  "planks":"plank","side planks":"side plank","plank up downs":"plank up-downs","plank up down":"plank up-downs","up downs":"plank up-downs","shoulder tap":"shoulder taps","mountain climber":"mountain climbers","russian twists":"russian twist","leg raise":"leg raises","hanging leg raise":"hanging leg raise","dead bugs":"dead bug","bird dogs":"bird dog","hollow hold":"hollow","superman":"superman","supermans":"superman","supermen":"superman","ab wheel":"ab roller","rollout":"ab roller","v ups":"v-up","toe touches":"toe touchers",
  "jumping jacks":"jumping jacks","burpee":"burpee","burpees":"burpee","box jumps":"box jump","wall sit":"wall sit","wall sits":"wall sit","good morning":"good morning","good mornings":"good morning","pullover":"pullover","pull over":"pullover","shrugs":"shrug","wrist curls":"wrist curl",
  "cat cow":"cat stretch","child pose":"childs pose","childs pose":"childs pose","child's pose":"childs pose","pigeon":"glute","figure 4":"seated glute","figure four":"seated glute","hip flexor stretch":"hip flexor","quad stretch":"quad stretch","hamstring stretch":"hamstring stretch","chest stretch":"chest stretch","lat stretch":"lat"};
const squash = s => s.replace(/ /g,"");
function libMatch0(name,extra,words,phrase){
  if(!words.length) return 0;
  const n=normName(name), all=n+" "+normName(extra), sq=squash(all), sn=squash(n);
  const hit=w=>all.includes(w)||sq.includes(squash(w))||(w.length>3&&w.endsWith("s")&&all.includes(w.slice(0,-1)));
  if(!words.every(hit)) return -1;
  if(n.includes(phrase)||sn.includes(squash(phrase))) return 0;
  return words.every(w=>n.includes(w)||sn.includes(squash(w)))?1:2;
}
/* sections of {kind,k,n,sub,on} matching the current search and filters */
function libItems(){
  const L=S.lib, g=gymSet(), useG=L.mine&&g, pick=L.mode==="pick";
  const q0=normName(L.q), alias=ALIAS[q0]?normName(ALIAS[q0]):"", words0=q0.split(" ").filter(Boolean), wordsA=alias.split(" ").filter(Boolean);
  /* try the words he typed and, if it has an everyday-name alias, that too; keep the better score */
  const libMatch=(name,extra)=>{ const a=libMatch0(name,extra,words0,q0), b=alias?libMatch0(name,extra,wordsA,alias):-1; return a<0?b:b<0?a:Math.min(a,b); };
  const words=words0;
  const grpOK=(groups,cat)=>!L.grp||(L.grp==="Stretching"?cat==="stretching":cat!=="stretching"&&groups.includes(L.grp));
  const secs=[], seenLib=new Set();
  if(pick){
    const inS=new Set(S.active?sessionDay(S.active).ex:[]), seen=new Set();
    const ownRow=k=>{ const e=EX[k]; if(!e||e.placeholder||seen.has(k)) return null;
      const sc=libMatch(e.n,[...e.m,...e.s].map(m=>MUSCLES[m]?.n).join(" "));
      if(sc<0||!grpOK(exGroups(e),e.cat)||(useG&&!exOK(k,g))) return null;
      seen.add(k); if(e.lib) seenLib.add(e.lib);
      return {kind:"ex",k,n:e.n,sub:[...e.m.map(m=>MUSCLES[m].n),...(e.xm||[])].join(", ")||e.eq,on:inS.has(k),sc}; };
    const rec=recentEx().map(ownRow).filter(Boolean);
    const own=Object.keys(EX).filter(k=>!EX[k].lx).map(ownRow).filter(Boolean);
    const srt=a=>words.length?a.sort((x,y)=>x.sc-y.sc):a;
    if(rec.length) secs.push({t:"Recently used",items:srt(rec)});
    if(own.length) secs.push({t:"From this app",items:srt(own)});
  }
  if(S.libData){
    const items=[], inS=pick&&S.active?new Set(sessionDay(S.active).ex):new Set();
    S.libData.forEach(x=>{
      if(pick&&seenLib.has(x.id)) return;
      const sc=libMatch(x.n,[...(x.m||[]),eqLabel(x.eq)].join(" ")); if(sc<0) return;
      if(!grpOK((x.m||[]).map(m=>LIB_GRP[m]),x.cat)) return;
      if(useG&&!libOK(x,g)) return;
      const k=pick?(Object.keys(EX).find(e=>EX[e].lib===x.id&&!EX[e].lx)||lxId(x.id)):x.id;
      items.push({kind:"lib",k:x.id,n:x.n,sub:`${eqLabel(x.eq)} · ${cap(x.lv)}`,on:inS.has(k),sc});
    });
    if(words.length) items.sort((a,b)=>a.sc-b.sc);
    if(items.length) secs.push({t:pick?"More exercises":"",items});
  }
  return secs;
}
function libResults(){
  const L=S.lib, pick=L.mode==="pick", secs=libItems(), total=secs.reduce((a,s)=>a+s.items.length,0);
  let left=L.n;
  const row=it=>pick
    ?`<button data-act="lib-pick" data-kind="${it.kind}" data-k="${esc(it.k)}"><span class="exn">${esc(it.n)}<em class="swp sub">${esc(it.sub)}</em></span><span class="badd ${it.on?"on":""}">${it.on?"In workout ✓":"+ Add"}</span></button>`
    :`<button data-act="lib-open" data-id="${esc(it.k)}"><span class="exn">${esc(it.n)}<em class="swp sub">${esc(it.sub)}</em></span><span class="chev" aria-hidden="true">›</span></button>`;
  const html=secs.map(s=>{ if(left<=0) return ""; const shown=s.items.slice(0,left); left-=shown.length;
    return `<div class="libsec">${s.t?`<div class="eyebrow">${esc(s.t)}</div>`:""}<div class="exlist">${shown.map(row).join("")}</div></div>`; }).join("");
  const status=!S.libData?(L.err?`<div class="note">Couldn't load the full library. ${pick?"Showing this app's exercises. ":""}Check your connection.<br><button class="link" data-act="lib-retry" style="padding-left:0">Try again</button></div>`:`<p class="small muted">Loading the full library…</p>`):"";
  const none=!total&&(S.libData||pick)?`<p class="small muted">Nothing matches. Try another word${L.grp?", or tap All":""}${L.mine&&gymSet()?", or turn off Only what my gym has":""}.</p>`:"";
  const qn=L.q.trim();
  const own=pick?`<div class="card qa"><h3>${qn?"Not the right one?":"Can't find it?"}</h3><p class="small muted">Add it with your own name. It's saved for next time.</p>
    <label class="f" for="qa-n">Name<input id="qa-n" value="${esc(qn?qn[0].toUpperCase()+qn.slice(1):"")}" placeholder="e.g. Squat to overhead press" autocomplete="off"></label>
    <div class="grid2"><label class="f" for="qa-m">Main muscle<select id="qa-m">${Object.entries(MUSCLES).map(([k,m])=>`<option value="${k}" ${k==="quads"?"selected":""}>${m.n}</option>`).join("")}</select></label>
    <label class="f" for="qa-w">Type<select id="qa-w"><option value="1">With weight</option><option value="0">Bodyweight</option></select></label></div>
    <button class="btn primary block" data-act="qa-add">Add to this workout</button></div>`:"";
  return `${total?`<p class="small muted">${total} ${total===1?"exercise":"exercises"}</p>`:""}${html}${none}${own}
    ${total>L.n?`<button class="btn block" data-act="lib-more">Show more</button>`:""}${status}`;
}
function libRender(){
  const L=S.lib; if(!L) return;
  if(L.open) return libDetail(L.open);
  const pick=L.mode==="pick";
  const chips=[["","All"],...LGROUPS.map(x=>[x,x])].map(([k,n])=>`<button class="pill ${L.grp===k?"on":""}" data-act="lib-grp" data-g="${k}" aria-pressed="${L.grp===k}">${n}</button>`).join("");
  openSheet(`<div class="stack-l">
    <div><div class="eyebrow">${pick?"Add to this workout":"Learn"}</div><h2>${pick?"Add an exercise":"Exercise library"}</h2></div>
    <input id="lib-q" type="search" data-act="lib-q" value="${esc(L.q)}" placeholder="Search, e.g. lat pulldown" aria-label="Search exercises" autocomplete="off">
    <div class="libchips" role="group" aria-label="Filter by muscle">${chips}</div>
    ${gymSet()?`<button class="tick toggle ${L.mine?"on":""}" data-act="lib-mine"><span class="box"></span><span class="tt"><span>Only what my gym has</span><small>Uses your My gym list</small></span></button>`:""}
    <div id="lib-res" class="stack-l" style="gap:8px">${libResults()}</div>
    <p class="tiny muted center">Photos: Free Exercise DB (public domain)</p>
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
const libUpdate = () => { const el=$("#lib-res"); if(el&&S.lib) el.innerHTML=libResults(); };
function libDetail(id){
  const x=S.libById?.get(id);
  const back=`<button class="link" data-act="lib-back" style="align-self:flex-start;padding-left:0">← Back to the list</button>`;
  if(!x){ openSheet(`<div class="stack-l">${back}<p class="small muted">${S.lib?.err?"Couldn't load the library. Check your connection.":"Loading…"}</p><button class="btn ghost block" data-act="close-sheet">Close</button></div>`); return; }
  const lv={}; (x.s||[]).forEach(m=>{ if(LMUS[m]) lv[LMUS[m]]=.35; }); (x.m||[]).forEach(m=>{ if(LMUS[m]) lv[LMUS[m]]=1; });
  const chips=(x.m||[]).map(m=>`<span class="mchip on">${esc(cap(m))}</span>`).join("")+(x.s||[]).filter(m=>!(x.m||[]).includes(m)).map(m=>`<span class="mchip">${esc(cap(m))}</span>`).join("");
  const ph=x.ni===0?"":photosHTML(x.id,x.c);
  openSheet(`<div class="stack-l">${back}
    <div><div class="eyebrow">${esc(eqLabel(x.eq))} · ${esc(cap(x.lv))}</div><h2>${esc(x.n)}</h2></div>
    <div class="figcard ${ph?"withph":""}">${ph}${bodyFig(lv)}<div class="mchips">${chips}</div></div>
    <section class="card"><h3>How to do it</h3><ol class="cues libsteps">${(x.ins||[]).map(s=>`<li>${esc(s)}</li>`).join("")||"<li>No steps for this one yet.</li>"}</ol></section>
    <div class="notice"><b style="color:var(--ink)">Equipment:</b> ${esc(eqLabel(x.eq))}${x.eq&&!libOK(x)?". Not ticked in My gym.":""}</div>
    <p class="tiny muted center">Photos: Free Exercise DB (public domain)</p>
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}
/* add an app or library exercise to the running session and jump to it */
function addToSession(kind,k){
  const w=S.active; if(!w) return;
  let id=k;
  if(kind==="lib"){
    const x=S.libById?.get(k); if(!x){ toast("Still loading. Try again."); return; }
    id=Object.keys(EX).find(e=>EX[e].lib===x.id&&!EX[e].lx)||lxId(x.id);
    if(!EX[id]||EX[id].placeholder||(id.startsWith("lx_")&&!S.settings?.libEx?.[id])){
      if(id.startsWith("lx_")){ const rec=libRec(x); EX[id]=libToEx(rec); S.settings={...(S.settings||{}),libEx:{...(S.settings?.libEx||{}),[id]:rec}}; writeSettings(); }
    }
  }
  const e=EX[id]; if(!e) return;
  const list=sessionDay(w).ex;
  if(list.includes(id)){ closeSheet(); go(()=>{ S.step=1; S.exIdx=list.indexOf(id); S.hint=""; }); toast("Already in this workout"); return; }
  const ph=phaseFor(currentWeek()), t=targetFor(id);
  w.exList=[...list,id];
  for(let j=0;j<ph.sets;j++) w.sets.push({k:uid(),ex:id,w:t.w===""?"":t.w,r:t.r,rir:"",done:false});
  closeSheet();
  go(()=>{ S.step=1; S.exIdx=w.exList.length-1; S.hint=""; });
  saveActiveSoon(); toast(`Added ${e.n}`);
}

/* ---------- progress ---------- */
function viewProgress(){
  const logged=[...new Set(doneWorkouts().flatMap(w=>(w.sets||[]).filter(s=>s.done).map(s=>s.ex)))];
  const opts=Object.entries(EX).filter(([k])=>logged.includes(k)).map(([k,e])=>`<option value="${k}" ${S.chartEx===k?"selected":""}>${esc(e.n)}</option>`).join("");
  if(logged.length&&!logged.includes(S.chartEx)) S.chartEx=logged[0];
  const cks=S.checkins.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const lastW=cks.find(c=>c.weight), firstW=cks.slice().reverse().find(c=>c.weight);
  const photos=cks.filter(c=>c.photoId).slice(0,9);
  const hist=doneWorkouts().slice(0,12).map(w=>{
    const s=(w.sets||[]).filter(x=>x.done), can=S.dbState==="on"&&S.canWrite, saved=S.savedAs.has(w.id);
    const byEx={}; s.forEach(x=>(byEx[x.ex]=byEx[x.ex]||[]).push(x));
    const h=sessionHR(w), hrTxt=h?` · ♥ avg ${h.avg} · peak ${h.max}`:(+w.avgHr>0?` · ♥ ${Math.round(+w.avgHr)} bpm`:"");
    return `<details class="acc" data-hid="${esc(w.id)}" ${S.openHist===w.id?"open":""}><summary><span><b>${fmtDate(w.date)}</b> · ${esc(histName(w))}<br><span class="small muted">${s.length} sets${w.durationMin?" · "+w.durationMin+" min":""}${hrTxt}</span></span></summary>
      <div class="hist">${Object.entries(byEx).map(([k,arr])=>`<div class="spread"><span>${esc(EX[k]?.n||k)}</span><span class="num muted">${arr.map(x=>EX[k]?.inc===0?x.r:`${x.w}×${x.r}`).join("  ")}</span></div>`).join("")}
      ${w.notes?`<p class="muted small">“${esc(w.notes)}”</p>`:""}
      ${hrDetail(w)}
      ${s.length&&can?`<div class="row"><button class="pill" data-act="redo" data-id="${esc(w.id)}">↻ Do again</button><button class="pill" data-act="save-as-day" data-id="${esc(w.id)}" ${saved?"disabled":""}>${saved?"Saved ✓":"Save as a workout"}</button></div>`:""}
      ${S.canWrite?`<div class="row"><button class="pill" data-act="ed-open" data-id="${w.id}">✎ Edit</button><button class="link" data-act="del-workout" data-id="${w.id}">Delete</button></div>`:""}</div></details>`;
  }).join("");
  return `${notice()}<header class="top"><div class="eyebrow">Consistency beats intensity</div><h1 class="hello">Progress</h1></header>
  <section class="card"><div class="spread"><h3>Last 8 weeks</h3><span class="small muted">workouts / week</span></div>${weekStrip()}</section>
  <section class="card chart"><div class="spread"><h3>Getting stronger</h3>${opts?`<select id="chartEx" data-act="chart-ex" class="sel">${opts}</select>`:""}</div>
    ${logged.length?strengthChart(S.chartEx):`<p class="small muted">After your first couple of workouts, a line shows each lift going up.</p>`}</section>
  <section class="card"><div class="spread"><h3>Body check-in</h3>${lastW?`<span class="pill quiet num">${lastW.weight} kg${firstW&&firstW!==lastW?` · ${(lastW.weight-firstW.weight>=0?"+":"")+(lastW.weight-firstW.weight).toFixed(1)}`:""}</span>`:""}</div>
    ${S.showCheckin?`<p class="small muted">Every two weeks, same time of day. Photos in the same spot and light.</p>
    <div class="grid3"><label class="f" for="ck-w">Weight kg<input id="ck-w" inputmode="decimal"></label><label class="f" for="ck-waist">Waist cm<input id="ck-waist" inputmode="decimal"></label><label class="f" for="ck-arm">Arm cm<input id="ck-arm" inputmode="decimal"></label></div>
    <label class="f" for="ck-photo">Photo<input id="ck-photo" type="file" accept="image/*"></label>
    <button class="btn primary block" data-act="checkin" ${S.dbState!=="on"||!S.canWrite?"disabled":""}>Save check-in</button>`
    :`<button class="btn block" data-act="show-checkin">+ New check-in</button>`}
    ${photos.length?`<div class="photos">${photos.map(c=>{ const u=S.photoUrls[c.photoId]; return `<figure><img alt="Progress photo ${fmtDate(c.date)}" data-photo="${esc(c.photoId)}" ${u&&u!=="pending"&&u!=="missing"?`src="${esc(u)}"`:""}><figcaption class="num">${fmtDate(c.date)}</figcaption></figure>`; }).join("")}</div>`:""}
    ${cks.length?`<div class="hist">${cks.slice(0,5).map(c=>`<div class="spread small"><span>${fmtDate(c.date)}</span><span class="num muted">${[c.weight&&c.weight+" kg",c.waist&&"waist "+c.waist,c.arm&&"arm "+c.arm].filter(Boolean).join(" · ")||"photo"}</span></div>`).join("")}</div>`:""}</section>
  ${healthProgress()}
  <section class="card"><h3>History</h3>${hist||`<p class="small muted">Your finished workouts show up here.</p>`}</section>
  ${accountCard()}`;
}
/* ---------- backup & sync (Supabase) ---------- */
function syncPill(){
  const st=Store.state; if(!cloudOK()) return `<span id="syncpill" class="pill quiet tiny">Not synced</span>`;
  const t=!st.online?"Offline · will sync later":st.error?"Sync problem":st.pending?`${st.pending} to sync`:st.lastSync?"Synced":"Syncing…";
  return `<span id="syncpill" class="pill quiet tiny ${st.error?"warn":""}">${esc(t)}</span>`;
}
function accountCard(){
  const a=S.account, cfg=Store.state.configured, me=Store.session?.user?.email;
  let body;
  if(!cfg) body=`<p class="small muted">Your log is saved on this phone. To back it up and use it on another device, add your Supabase key in <code>js/config.js</code> (see README).</p>`;
  else if(me) body=`<p class="small muted">Signed in as <b>${esc(me)}</b>. Changes sync both ways whenever you're online.</p>
    <div class="row"><button class="pill" data-act="sync-now">↻ Sync now</button><button class="pill quiet" data-act="acct-out">Sign out</button></div>`;
  else if(a.stage==="confirm") body=`<p class="small muted">Almost there. We sent a confirmation email to <b>${esc(a.email)}</b>. Tap the link in it (it's fine if it opens in Safari), then come back here and sign in.</p>
    <button class="btn" data-act="acct-reset">Back to sign in</button>`;
  else body=`<p class="small muted">Sign in once to back up your log and sync it between devices.</p>
    <input id="acct-email" class="field" type="email" inputmode="email" autocomplete="username" placeholder="you@example.com" value="${esc(a.email)}" aria-label="Email" style="width:100%;margin:6px 0">
    <input id="acct-pass" class="field" type="password" autocomplete="current-password" placeholder="Password (8+ characters)" aria-label="Password" style="width:100%;margin:6px 0">
    <div class="row"><button class="btn" data-act="acct-in" ${a.stage==="busy"?"disabled":""}>${a.stage==="busy"?"One moment…":"Sign in"}</button><button class="pill quiet" data-act="acct-up" ${a.stage==="busy"?"disabled":""}>First time? Create account</button></div>
    ${a.err?`<p class="small" style="color:var(--hot)">${esc(a.err)}</p>`:""}`;
  return `<section class="card"><div class="spread"><h3>Backup & sync</h3>${cfg?syncPill():""}</div>${body}
    <div class="row"><button class="pill quiet" data-act="export">Export my data</button><label class="pill quiet" for="import-file" style="cursor:pointer">Import a file<input id="import-file" type="file" accept="application/json" hidden></label></div></section>`;
}
async function exportData(){
  try{ const d=await Store.exportAll(); const blob=new Blob([JSON.stringify(d,null,1)],{type:"application/json"});
    const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`clear-reps-${todayISO()}.json`; document.body.appendChild(a); a.click(); a.remove(); toast("Exported"); }
  catch(e){ toast("Couldn't export"); }
}
async function importData(file){
  try{ const d=JSON.parse(await file.text()); if(!d||(!d.workouts&&!d.settings)) throw new Error("not a Clear Reps file"); await Store.importAll(d); toast(`Imported ${(d.workouts||[]).length} workouts`); render(); }
  catch(e){ toast("Couldn't import: "+(e?.message||"bad file")); }
}
function weekStrip(){
  const t=todayISO(), cells=[];
  for(let i=7;i>=0;i--){
    const n=doneWorkouts().filter(w=>{const d=daysBetween(w.date,t);return d>=i*7&&d<i*7+7;}).length;
    cells.push(`<div class="wk"><div class="wkbar"><i style="height:${Math.min(3,n)/3*100}%"></i></div><span>${i===0?"now":i+"w"}</span></div>`);
  }
  return `<div class="weeks">${cells.join("")}</div>`;
}
function strengthChart(exId){
  const e=EX[exId];
  const pts=doneWorkouts().slice().reverse().map(w=>{
    const s=(w.sets||[]).filter(x=>x.ex===exId&&x.done);
    if(!s.length) return null;
    return {d:w.date,v:Math.max(...s.map(x=>e.inc===0?(+x.r||0):e1rm(+x.w||0,+x.r||0)))};
  }).filter(Boolean);
  if(pts.length<2) return `<p class="small muted">One workout logged for this lift. The line appears after the next one.</p>`;
  const W=320,H=140,pl=30,pr=8,pt=10,pb=22;
  const vs=pts.map(p=>p.v), lo=Math.floor(Math.min(...vs)*0.95), hi=Math.ceil(Math.max(...vs)*1.05)||1;
  const x=i=>pl+(W-pl-pr)*(i/(pts.length-1)), y=v=>pt+(H-pt-pb)*(1-(v-lo)/((hi-lo)||1));
  const line=pts.map((p,i)=>`${i?"L":"M"}${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(" ");
  const area=`${line} L${x(pts.length-1).toFixed(1)} ${H-pb} L${pl} ${H-pb} Z`;
  const ticks=[lo,(lo+hi)/2,hi].map(v=>`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" stroke="var(--line)"/><text x="${pl-6}" y="${y(v)+3}" text-anchor="end" font-size="9" fill="var(--muted)">${Math.round(v)}</text>`).join("");
  const last=pts.at(-1), first=pts[0], diff=last.v-first.v;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Trend for ${esc(e.n)}"><defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".35"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>${ticks}
    <path d="${area}" fill="url(#ga)"/><path d="${line}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(pts.length-1)}" cy="${y(last.v)}" r="4.5" fill="var(--accent)"/>
    <text x="${pl}" y="${H-5}" font-size="9" fill="var(--muted)">${fmtDate(first.d)}</text><text x="${W-pr}" y="${H-5}" text-anchor="end" font-size="9" fill="var(--muted)">${fmtDate(last.d)}</text></svg>
    <p class="small"><b class="num" style="color:var(--accent)">${diff>=0?"+":""}${diff.toFixed(1)}${e.inc===0?(e.timed?" s":" reps"):" kg"}</b> <span class="muted">${e.inc===0?"best set":"estimated max"} since ${fmtDate(first.d)}</span></p>`;
}


/* ---------- edit a past workout ---------- */
function editSheet(){
  const w=S.edit, order=[];
  (w.sets||[]).forEach(x=>{ if(!order.includes(x.ex)) order.push(x.ex); });
  const groups=order.map(ex=>{
    const e=EX[ex]||{n:ex,inc:1}, sets=w.sets.filter(x=>x.ex===ex), bw=e.inc===0, unit=e.timed?"sec":"reps";
    return `<div class="edgroup"><div class="spread"><h3>${esc(e.n)}</h3><button class="link" data-act="ed-addset" data-ex="${ex}">+ Add set</button></div>
      ${sets.map((x,i)=>`<div class="edrow"><span class="edn num">${i+1}</span>
        ${bw?`<span class="small muted edbw">Bodyweight</span>`:`<label class="edf"><input id="ed-${x.k}-w" inputmode="decimal" value="${esc(x.w)}" data-act="ed-set" data-k="${x.k}" data-f="w" aria-label="Set ${i+1} kg"><span>kg</span></label>`}
        <label class="edf"><input id="ed-${x.k}-r" inputmode="numeric" value="${esc(x.r)}" data-act="ed-set" data-k="${x.k}" data-f="r" aria-label="Set ${i+1} ${unit}"><span>${unit}</span></label>
        <button class="icon sm" data-act="ed-del" data-k="${x.k}" aria-label="Remove set ${i+1}">×</button></div>`).join("")}</div>`;
  }).join("");
  const opts=Object.entries(EX).filter(([k])=>!order.includes(k)).map(([k,e])=>`<option value="${k}">${esc(e.n)}</option>`).join("");
  openSheet(`<div class="stack-l"><div><div class="eyebrow">Edit workout</div><h2>${esc(histName(w))}</h2></div>
    <label class="f" for="ed-date">Date<input id="ed-date" type="date" value="${esc(w.date)}" max="${todayISO()}" data-act="ed-date"></label>
    ${groups||`<p class="small muted">No sets in this workout.</p>`}
    <label class="f" for="ed-addex">Add an exercise you did<select id="ed-addex" data-act="ed-addex"><option value="">Choose…</option>${opts}</select></label>
    <label class="f" for="ed-notes">Note<textarea id="ed-notes" data-act="ed-notes">${esc(w.notes||"")}</textarea></label>
    <button class="btn primary block" data-act="ed-save">Save changes</button>
    <button class="btn ghost block" data-act="close-sheet">Cancel</button></div>`);
}
async function saveEdit(btn){
  const w=S.edit; if(!w) return;
  const n=v=>{const x=parseFloat(String(v??"").replace(",","."));return isFinite(x)?x:0;};
  w.sets=w.sets.map(x=>({...x,w:EX[x.ex]?.inc===0?0:n(x.w),r:n(x.r),done:true})).filter(x=>x.r>0);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(w.date)){ toast("Pick a valid date"); return; }
  btn.disabled=true; btn.textContent="Saving…";
  const {id,...body}=w;
  try{ await Store.put("workouts",id,body); S.workouts=S.workouts.map(x=>x.id===id?w:x); S.edit=null; closeSheet(); render(); toast("Workout updated"); }
  catch(e){ btn.disabled=false; btn.textContent="Save changes"; toast("Couldn't save. Try again."); }
}

/* ---------- coach view ---------- */
function viewCoach(){
  const chips=S.coachFocus
    ?[`Am I doing ${EX[S.coachFocus].n} right?`,`What if ${EX[S.coachFocus].n} hurts?`,`Why is ${EX[S.coachFocus].n} in my plan?`]
    :["Is my training balanced?","What should I focus on this week?","Only 40 minutes today. What do I cut?","I'm sore. Should I still train?"];
  const msgs=S.chat.map(m=>`<div class="msg ${m.role==="user"?"me":"ai"}">${m.role==="user"?esc(m.content):mdLite(m.content)}</div>`).join("");
  return `<header class="top"><div class="eyebrow">Knows your plan and your log</div><h1 class="hello">Coach</h1></header>
  ${cloudOK()?"":`<div class="notice">${Store.state.configured?"Sign in (Progress → Backup & sync) to use the coach.":"The coach needs the Supabase set-up in js/config.js and the coach function. See README."}</div>`}
  <div class="chat">${msgs||`<div class="coach-empty"><div class="spark">✦</div><p>Ask about form, soreness, swaps, or whether you're doing too much. Answers use your real workouts.</p></div>`}
    ${S.chatBusy&&!S.chat.at(-1)?.content?`<div class="msg ai muted">Thinking…</div>`:""}<span id="chatEnd"></span></div>
  ${S.chat.length?"":`<div class="suggest">${chips.map(c=>`<button class="pill" data-act="ask" data-q="${esc(c)}" ${!cloudOK()||S.chatBusy?"disabled":""}>${esc(c)}</button>`).join("")}</div>`}
  <div class="composer"><textarea id="coachIn" rows="1" aria-label="Ask the coach" placeholder="Ask anything…" ${!cloudOK()?"disabled":""}></textarea>
    <button class="send" data-act="send" aria-label="Send" ${!cloudOK()||S.chatBusy?"disabled":""}>↑</button></div>
  ${S.chat.length?`<button class="link center" data-act="clear-chat">Start a new chat</button>`:""}`;
}

/* ---------- rest timer ---------- */
let restT=null, restEnd=0, restTotal=0, restLabel="", restNext="";
function startRest(sec,label,next){
  restTotal=sec; restEnd=Date.now()+sec*1000; restLabel=label; restNext=next||""; clearInterval(restT); tickRest(); restT=setInterval(tickRest,250);
}
/* a slim bar at the top of the screen: you can keep logging, editing and scrolling while it runs */
function tickRest(){
  const el=$("#rest"), msLeft=Math.max(0,restEnd-Date.now()), left=Math.ceil(msLeft/1000);
  const frac=restTotal?msLeft/(restTotal*1000):0, time=`${Math.floor(left/60)}:${String(left%60).padStart(2,"0")}`;
  if(el.hidden||!el.firstElementChild){
    el.hidden=false; document.body.classList.add("resting");
    el.innerHTML=`<div class="rest-in ${left?"":"go"}"><div class="rest-bar"><i></i></div>
      <b class="num rest-time"></b><div class="rest-txt"><b></b><span class="muted small"></span></div>
      <div class="rest-btns"><button class="pill" data-act="rest-add">+30s</button><button class="pill" data-act="rest-stop"></button></div></div>`;
  }
  el.querySelector(".rest-in").classList.toggle("go",!left);
  el.querySelector(".rest-bar i").style.width=(frac*100).toFixed(1)+"%";
  el.querySelector(".rest-time").textContent=left?time:"Go!";
  el.querySelector(".rest-txt b").textContent=left?restLabel:"Rest over";
  el.querySelector(".rest-txt span").textContent=restNext||"";
  el.querySelector('[data-act="rest-stop"]').textContent=left?"Skip":"Done";
  if(!left){ clearInterval(restT); try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){} beep(); setTimeout(()=>{ if(restEnd<=Date.now()) stopRest(); },8000); }
}
function stopRest(){ clearInterval(restT); const el=$("#rest"); el.hidden=true; el.innerHTML=""; document.body.classList.remove("resting"); }
let actx=null;
function beep(){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const o=actx.createOscillator(),g=actx.createGain(); o.frequency.value=880; g.gain.value=.08; o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime+.25);}catch(e){} }
let wake=null;
async function requestWake(){ try{ wake=await navigator.wakeLock?.request("screen"); }catch(e){} }

/* ---------- events ---------- */
const go = (fn) => { fn(); render(); window.scrollTo(0,0); };
document.addEventListener("click",async ev=>{
  const b=ev.target.closest("[data-act]"); if(!b) return;
  if(["INPUT","SELECT","TEXTAREA"].includes(b.tagName)) return;
  const a=b.dataset.act;
  if(a==="tab"){ go(()=>{ S.view=b.dataset.v; S.paused=!!S.active; try{localStorage.setItem("cr_view",S.view);}catch(e){} if(S.view!=="coach") S.coachFocus=null; }); }
  else if(a==="start"){ closeSheet(); startSession(b.dataset.day); }
  else if(a==="free"){ startCustom({dayId:"free",dayName:"Free session",ex:[]}); }
  else if(a==="redo"){ redoWorkout(b.dataset.id); }
  else if(a==="save-as-day"){ saveAsDay(b.dataset.id,b); }
  /* photos + library */
  else if(a==="photo-zoom"){ zoomOpen(b.dataset.lib,+b.dataset.i); }
  else if(a==="zoom-close"){ zoomClose(); }
  else if(a==="lib"){ libSheet({mode:"browse"}); }
  else if(a==="add-ex"){ if(S.active) libSheet({mode:"pick"}); }
  else if(a==="lib-grp"&&S.lib){ S.lib.grp=b.dataset.g; S.lib.n=40; libRender(); }
  else if(a==="lib-mine"&&S.lib){ S.lib.mine=!S.lib.mine; S.lib.n=40; libRender(); }
  else if(a==="lib-more"&&S.lib){ S.lib.n+=40; libUpdate(); }
  else if(a==="lib-retry"&&S.lib){ S.lib.err=false; libUpdate(); loadLib().then(()=>{ if(S.lib) libRender(); }).catch(()=>{ if(S.lib){ S.lib.err=true; libRender(); } }); }
  else if(a==="lib-open"){ if(!S.lib||$("#sheet").hidden) libSheet({mode:"browse",open:b.dataset.id,fromEx:true}); else { S.lib.scroll=document.querySelector("#sheet .sheet-card")?.scrollTop||0; S.lib.open=b.dataset.id; libRender(); sheetTop(); } }
  else if(a==="lib-back"&&S.lib){ S.lib.open=null; libRender(); const c=document.querySelector("#sheet .sheet-card"); if(c) c.scrollTop=S.lib.scroll||0; }
  else if(a==="lib-pick"){ addToSession(b.dataset.kind,b.dataset.k); }
  else if(a==="qa-add"){
    const n=($("#qa-n")?.value||"").trim();
    if(!n){ toast("Give the exercise a name"); $("#qa-n")?.focus(); return; }
    const stored={n,m:$("#qa-m")?.value||"quads",r:[8,12],weighted:$("#qa-w")?.value!=="0",needs:[]}, id="cx_"+uid();
    EX[id]=makeEx(stored);
    if(canSave()) await saveSettings({customEx:{...(S.settings?.customEx||{}),[id]:stored}});
    addToSession("ex",id); toast(`Added ${n}`);
  }
  /* my gym: own equipment */
  else if(a==="ce-add"){ addEquip(); }
  else if(a==="ce-del"){
    if(b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent="Remove?"; setTimeout(()=>{ if(b.isConnected){ b.dataset.confirm=""; b.textContent="×"; } },3000); return; }
    if(!canSave()) return;
    if(gymT){ clearTimeout(gymT); gymT=null; }
    const id=b.dataset.id, eq=gymSet();
    if(await saveSettings({customEquipment:customEquip().filter(c=>c.id!==id),...(eq?{equipment:[...eq].filter(k=>k!==id)}:{})})){ gymSheet(); render(); toast("Removed"); }
  }
  else if(a==="resume"){ go(()=>{ S.view="today"; S.paused=false; }); }
  else if(a==="pause"){ stopRest(); go(()=>{ S.paused=true; }); }
  else if(a==="pick-day"){ pickDaySheet(); }
  else if(a==="ex-info"){ exSheet(b.dataset.ex); }
  else if(a==="close-sheet"){ S.edit=null; closeSheet(); }
  else if(a==="muscle"){ const keys=Object.keys(SLUG).filter(k=>(SLUG[k][b.dataset.side==="front"?"f":"b"]||[]).includes(b.dataset.slug)); S.selMuscle=keys.length>1&&keys.includes(S.selMuscle)?keys[(keys.indexOf(S.selMuscle)+1)%keys.length]:keys[0]; render(); }
  else if(a==="step"){ if(b.dataset.close) closeSheet(); if(+b.dataset.i!==1) stopRest(); go(()=>{ S.step=+b.dataset.i; if(S.step===1&&S.exIdx>=sessionDay(S.active).ex.length) S.exIdx=0; }); }
  else if(a==="goto"){ if(b.dataset.close) closeSheet(); go(()=>{ S.step=1; S.exIdx=Math.max(0,+b.dataset.i); S.hint=""; }); }
  else if(a==="session-list"){ sessionListSheet(); }
  else if(a==="s-move"){ moveEx(+b.dataset.i,+b.dataset.d); }
  else if(a==="s-pair"){ togglePair(+b.dataset.i); }
  else if(a==="s-rm"){ if(b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent="?"; b.classList.add("warn"); setTimeout(()=>{ if(b.isConnected){ b.dataset.confirm=""; b.textContent="×"; b.classList.remove("warn"); } },2500); return; } removeEx(+b.dataset.i); }
  else if(a==="setw"){ const s=S.active.sets.find(x=>x.k===b.dataset.k); if(s){ s.w=+b.dataset.v; updateLogger(); saveActiveSoon(); } }
  else if(a==="warm"||a==="cool"){ const o=S.active[a]=S.active[a]||{}; o[b.dataset.k]=!o[b.dataset.k]; b.classList.toggle("on",!!o[b.dataset.k]); saveActiveSoon(); }
  else if(a==="hold"){ startRest(40,"Hold · "+(b.dataset.n||"stretch"),"Breathe slowly, both sides"); }
  else if(a==="rpe"){ S.active.rpe=+b.dataset.v; document.querySelectorAll('[data-act="rpe"]').forEach(x=>x.classList.toggle("on",x===b)); saveActiveSoon(); }
  else if(a==="wstep"){
    const id=b.dataset.ex, cur=wStep(id), nx=WSTEPS[(WSTEPS.indexOf(cur)+1)%WSTEPS.length]||2;
    S.settings={...(S.settings||{}),wstep:{...(S.settings?.wstep||{}),[id]:nx}};
    if(canSave()) writeSettings();
    render(); toast(`${EX[id]?.n||"This exercise"}: steps of ${nx} kg`);
  }
  else if(a==="nudge"){
    const s=S.active.sets.find(x=>x.k===b.dataset.k), e=EX[s.ex], f=b.dataset.f, d=+b.dataset.d;
    const step=f==="w"?wStep(s.ex):(e.timed?5:1);
    const v=Math.max(0,+((parseFloat(s[f])||0)+d*step).toFixed(1)); s[f]=v;
    const inp=document.getElementById(`s-${s.k}-${f}`); if(inp) inp.value=v;
    if(f==="w"){ const tot=document.getElementById(`tot-${s.k}`); if(tot) tot.textContent=fmtKg(v*2)+" kg"; else if(perHand(e)) updateLogger(); }
    saveActiveSoon();
  }
  else if(a==="undo"){ const s=S.active.sets.find(x=>x.k===b.dataset.k); s.done=false; s.feel=null; S.hint=""; stopRest(); updateLogger(); saveActiveSoon(); }
  else if(a==="log"){
    const s=S.active.sets.find(x=>x.k===b.dataset.k), e=EX[s.ex], fl=FEEL.find(f=>f.k===b.dataset.feel);
    if(!(+s.r>0)){ toast(`Set your ${e.timed?"seconds":"reps"} first`); return; }
    if(e.inc>0 && !(+s.w>0)){ toast("Set the weight first"); return; }
    s.done=true; s.feel=fl.k; s.rir=fl.rir; if(e.inc===0) s.w=0;
    const nxt=S.active.sets.find(x=>x.ex===s.ex&&!x.done);
    S.hint="";
    if(nxt){
      nxt.w=s.w; if(!(+nxt.r>0)) nxt.r=s.r;
      if(e.inc>0 && fl.k==="easy"){ nxt.w=+(+s.w+wStep(s.ex)).toFixed(1); S.hint=`That was easy, so next set is ${fmtKg(nxt.w)} kg`; }
      else if(e.inc>0 && fl.k==="tough" && +s.r<e.r[0]){ nxt.w=Math.max(0,+(+s.w-wStep(s.ex)).toFixed(1)); S.hint=`Dropping to ${fmtKg(nxt.w)} kg to stay in range`; }
      else if(fl.k==="good") S.hint="Right on target. Same again.";
      else if(fl.k==="tough") S.hint="Good effort. Same weight, rest fully.";
    }
    const day=sessionDay(S.active), ni=day.ex.indexOf(s.ex)+1;
    const nextTxt=nxt?`Next: set ${S.active.sets.filter(x=>x.ex===s.ex).indexOf(nxt)+1}${e.inc>0?" · "+fmtKg(nxt.w)+" kg":""}`:(day.ex[ni]?`Next: ${EX[day.ex[ni]].n}`:"Next: stretch");
    /* supersets: alternate through the group with no rest, rest once the round is done */
    const grp=groupOf(s.ex);
    if(grp){
      const order=day.ex.filter(x=>grp.includes(x)), pos=order.indexOf(s.ex), doneN=id=>S.active.sets.filter(x=>x.ex===id&&x.done).length, dA=doneN(s.ex);
      /* next partner that is still behind this one in the round and has a set left */
      let jump=null; for(let k=1;k<order.length;k++){ const o=order[(pos+k)%order.length]; if(doneN(o)<dA&&S.active.sets.some(x=>x.ex===o&&!x.done)){ jump=o; break; } }
      if(jump){ stopRest(); S.hint=`Superset · straight on to ${EX[jump].n}, no rest`; go(()=>{ S.exIdx=day.ex.indexOf(jump); }); clearTimeout(saveT); saveActive(); return; }
      const first=order.find(o=>S.active.sets.some(x=>x.ex===o&&!x.done));
      startRest(e.rest,"Rest · round done",first?`Next: ${EX[first].n}`:nextTxt);
      if(first&&first!==s.ex){ S.hint=""; go(()=>{ S.exIdx=day.ex.indexOf(first); }); } else updateLogger();
      clearTimeout(saveT); saveActive(); return;
    }
    startRest(e.rest,"Rest",nextTxt);
    updateLogger(); clearTimeout(saveT); saveActive();
  }
  else if(a==="add-set"){ const id=b.dataset.ex, prev=S.active.sets.filter(x=>x.ex===id).at(-1); const ns={k:uid(),ex:id,w:prev?prev.w:"",r:prev?prev.r:"",rir:"",done:false}; S.active.sets.splice(prev?S.active.sets.lastIndexOf(prev)+1:S.active.sets.length,0,ns); updateLogger(); saveActiveSoon(); }
  else if(a==="del-set"){ const id=b.dataset.ex, last=S.active.sets.filter(x=>x.ex===id&&!x.done).at(-1); if(last) S.active.sets=S.active.sets.filter(x=>x!==last); updateLogger(); saveActiveSoon(); }
  else if(a==="cancel-session"){
    if(b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent="Tap again to discard"; setTimeout(()=>{b.dataset.confirm="";b.textContent="Discard workout";},3000); return; }
    const id=S.active.id; S.active=null; S.paused=false; stopRest(); render(); try{await Store.del("workouts",id);}catch(e){} toast("Workout discarded");
  }
  else if(a==="finish"){
    const w=S.active; w.status="done"; w.finishedAt=new Date().toISOString(); w.durationMin=Math.max(1,Math.round((Date.now()-new Date(w.startedAt).getTime())/6e4));
    w.sets=w.sets.filter(s=>s.done);
    if(w.dayId==="free") w.dayName=freeName(w);
    await saveActive(); S.workouts=[w,...S.workouts.filter(x=>x.id!==w.id)]; S.active=null; S.paused=false; S.step=0; stopRest(); try{wake?.release();}catch(e){}
    go(()=>{}); toast("Saved. See you next time.");
  }
  else if(a==="ask-ex"){ closeSheet(); go(()=>{ S.coachFocus=b.dataset.ex; S.paused=!!S.active; S.view="coach"; }); }
  else if(a==="ask"){ askCoach(b.dataset.q); }
  else if(a==="send"){ const t=$("#coachIn"); const q=t.value; t.value=""; askCoach(q); }
  else if(a==="clear-chat"){ S.chat=[]; S.coachFocus=null; render(); }
  else if(a==="rest-add"){ const now=Date.now(); if(restEnd<now){ restEnd=now; restTotal=0; } restEnd+=30000; restTotal+=30; clearInterval(restT); restT=setInterval(tickRest,250); tickRest(); }
  else if(a==="rest-stop"){ stopRest(); }
  else if(a==="health-setup"){ healthSetupSheet(); }
  else if(a==="health-retry"){ loadHealth(true); }
  else if(a==="health-done"){ closeSheet(); loadHealth(true); }
  else if(a==="copy"){ try{ await navigator.clipboard.writeText(b.dataset.t); toast("Copied"); }catch(e){ const r=document.createRange(); const el=$("#syncUrl"); if(el){ r.selectNodeContents(el); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); } toast("Selected. Copy it from the menu."); } }
  else if(a==="ed-open"){ const w=S.workouts.find(x=>x.id===b.dataset.id); if(!w) return; S.edit=JSON.parse(JSON.stringify(w)); (S.edit.sets||[]).forEach(x=>{ if(!x.k) x.k=uid(); }); editSheet(); }
  else if(a==="ed-addset"){ const ex=b.dataset.ex, prev=S.edit.sets.filter(x=>x.ex===ex).at(-1); S.edit.sets.splice(S.edit.sets.lastIndexOf(prev)+1,0,{k:uid(),ex,w:prev?prev.w:"",r:prev?prev.r:"",rir:"",done:true,feel:null}); editSheet(); }
  else if(a==="ed-del"){ S.edit.sets=S.edit.sets.filter(x=>x.k!==b.dataset.k); editSheet(); }
  else if(a==="ed-save"){ saveEdit(b); }
  else if(a==="show-checkin"){ S.showCheckin=true; render(); }
  /* backup & sync */
  else if(a==="acct-in"||a==="acct-up"){
    const email=($("#acct-email")?.value||"").trim().toLowerCase(), pass=$("#acct-pass")?.value||"";
    if(!/^\S+@\S+\.\S+$/.test(email)){ toast("Enter your email"); return; }
    if(pass.length<8){ toast("Password needs 8+ characters"); return; }
    S.account={email,stage:"busy",err:""}; render();
    try{
      if(a==="acct-in"){ await Store.signInPassword(email,pass); S.account={email:"",stage:"idle",err:""}; toast("Signed in"); }
      else { const now=await Store.signUpPassword(email,pass); if(now){ S.account={email:"",stage:"idle",err:""}; toast("Account created"); } else S.account={email,stage:"confirm",err:""}; }
    }catch(e){ const m=e?.message||""; S.account={email,stage:"idle",err:/invalid login/i.test(m)?"Email or password didn't match. First time here? Tap Create account.":/not confirmed/i.test(m)?"Confirm your email first: tap the link we sent, then sign in.":m||"Something went wrong"}; }
    render();
  }
  else if(a==="acct-reset"){ S.account={email:S.account.email,stage:"idle",err:""}; render(); }
  else if(a==="acct-out"){ await Store.signOut(); toast("Signed out. Your log stays on this phone."); render(); }
  else if(a==="sync-now"){ Store.syncNow(); toast("Syncing…"); }
  else if(a==="export"){ exportData(); }
  else if(a==="checkin"){ saveCheckin(b); }
  /* my gym */
  else if(a==="gym"){ S.gymFrom=b.dataset.from||""; gymSheet(); sheetTop(); }
  else if(a==="gym-t"){ const keys=allEqKeys(), g=gymSet()||new Set(keys), k=b.dataset.k; g.has(k)?g.delete(k):g.add(k); setGym(keys.filter(x=>g.has(x))); }
  else if(a==="gym-all"){ const keys=allEqKeys(), g=gymSet(); setGym(g&&keys.every(k=>g.has(k))?[]:keys); }
  else if(a==="gym-done"){ if(gymT){ clearTimeout(gymT); gymT=null; writeSettings(); } if(S.gymFrom==="pick"){ pickDaySheet(); sheetTop(); } else closeSheet(); render(); }
  /* my workouts */
  else if(a==="cd-new"){ if(canSave()) openBuilder(null); }
  else if(a==="cd-edit"){ const d=dayById(b.dataset.id); if(d&&canSave()) openBuilder(d); }
  else if(a==="cd-del"){
    if(b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent="Tap again to delete"; setTimeout(()=>{ if(b.isConnected){ b.dataset.confirm=""; b.textContent="Delete"; } },3000); return; }
    const list=(S.settings?.customDays||[]).filter(d=>d.id!==b.dataset.id);
    if(await saveSettings({customDays:list,...(list.length?{}:{useCustom:false})})){ pickDaySheet(); render(); toast("Workout deleted"); }
  }
  else if(a==="use-custom"){ if(await saveSettings({useCustom:!S.settings?.useCustom})){ pickDaySheet(); render(); toast(S.settings.useCustom?"Home now uses your workouts":"Back to the 3-day plan"); } }
  else if(a==="b-add"&&S.build){ const id=b.dataset.ex, B=S.build; if(B.ex.includes(id)){ B.ex=B.ex.filter(x=>x!==id); delete B.sets[id]; } else { B.ex.push(id); B.sets[id]=phaseFor(currentWeek()).sets; } builderSheet(); }
  else if(a==="b-rm"&&S.build){ const id=b.dataset.ex; S.build.ex=S.build.ex.filter(x=>x!==id); delete S.build.sets[id]; builderSheet(); }
  else if(a==="b-move"&&S.build){ const i=+b.dataset.i, j=i+(+b.dataset.d), ex=S.build.ex; if(j<0||j>=ex.length) return; [ex[i],ex[j]]=[ex[j],ex[i]]; builderSheet(); }
  else if(a==="b-sets"&&S.build){ const id=b.dataset.ex, cur=S.build.sets[id]||phaseFor(currentWeek()).sets; S.build.sets[id]=Math.min(6,Math.max(1,cur+(+b.dataset.d))); builderSheet(); }
  else if(a==="b-cxopen"&&S.build){ S.build.cx={n:"",m:"chest",lo:"8",hi:"12",wt:true,nd:""}; builderSheet(); $("#cx-n")?.focus(); }
  else if(a==="b-cxwt"&&S.build?.cx){ S.build.cx.wt=b.dataset.v==="1"; builderSheet(); }
  else if(a==="b-cxcancel"&&S.build){ S.build.cx=null; builderSheet(); }
  else if(a==="b-cxadd"&&S.build?.cx){
    const c=S.build.cx, n=c.n.trim();
    if(!n){ toast("Give the exercise a name"); $("#cx-n")?.focus(); return; }
    const lo=parseInt(c.lo)||8, hi=Math.max(lo,parseInt(c.hi)||12), id="cx_"+uid(), stored={n,m:c.m,r:[lo,hi],weighted:!!c.wt,needs:c.nd?[c.nd]:[]};
    EX[id]=makeEx(stored); S.build.newEx[id]=stored; S.build.ex.push(id); S.build.sets[id]=phaseFor(currentWeek()).sets; S.build.cx=null;
    builderSheet(); toast(`Added ${n}`);
  }
  else if(a==="b-save"){ saveBuild(b); }
  else if(a==="b-cancel"){ dropBuild(); pickDaySheet(); sheetTop(); }
  else if(a==="del-workout"){
    if(b.dataset.confirm!=="1"){ b.dataset.confirm="1"; b.textContent="Tap again to delete"; return; }
    try{ await Store.del("workouts",b.dataset.id); toast("Deleted"); }catch(e){ toast("Couldn't delete that workout"); }
  }
});
document.addEventListener("input",ev=>{
  const t=ev.target, a=t.dataset?.act;
  if(a==="set"){ const s=S.active.sets.find(x=>x.k===t.dataset.k); s[t.dataset.f]=t.value; saveActiveSoon(); }
  else if(a==="field"){ S.active[t.dataset.k]=t.value; saveActiveSoon(); }
  else if(a==="ed-set"&&S.edit){ const x=S.edit.sets.find(y=>y.k===t.dataset.k); if(x) x[t.dataset.f]=t.value; }
  else if(a==="ed-notes"&&S.edit){ S.edit.notes=t.value; }
  else if(a==="ed-date"&&S.edit){ S.edit.date=t.value; }
  else if(a==="b-name"&&S.build){ S.build.name=t.value; }
  else if(a==="b-q"&&S.build){ S.build.q=t.value; filterLib(); }
  else if(a==="lib-q"&&S.lib){ S.lib.q=t.value; S.lib.n=40; libUpdate(); }
  else if(a==="b-cx"&&S.build?.cx){ S.build.cx[t.dataset.k]=t.value; }
});
document.addEventListener("change",ev=>{ const t=ev.target;
  if(t.id==="import-file"){ const f=t.files?.[0]; t.value=""; if(f) importData(f); return; }
  if(t.dataset?.act==="max-hr"){
    const v=Math.round(+t.value);
    if(!(v>=100&&v<=240)){ t.value=maxHR(); toast("Enter a number from 100 to 240"); return; }
    if(!(S.dbState==="on"&&S.canWrite)){ t.value=maxHR(); toast("Still loading. One second."); return; }
    S.settings={...(S.settings||{}),maxHr:v}; writeSettings().then(ok=>toast(ok?"Max heart rate saved":"Couldn't save. Check your connection.")); render(); return;
  }
  if(t.dataset?.act==="chart-ex"){ S.chartEx=t.value; render(); }
  if(t.dataset?.act==="ed-date"&&S.edit){ S.edit.date=t.value; }
  if(t.dataset?.act==="b-cx"&&S.build?.cx){ S.build.cx[t.dataset.k]=t.value; }
  if(t.dataset?.act==="ed-addex"&&S.edit&&t.value){ const t0=targetFor(t.value); S.edit.sets.push({k:uid(),ex:t.value,w:t0.w||"",r:t0.r||"",rir:"",done:true,feel:null}); editSheet(); }
});
document.addEventListener("toggle",ev=>{ const d=ev.target;
  if(d?.dataset?.how){ S.howOpen[d.dataset.how]=d.open; return; }
  if(!d?.dataset?.hid) return; if(d.open) S.openHist=d.dataset.hid; else if(S.openHist===d.dataset.hid) S.openHist=null; },true);
document.addEventListener("keydown",ev=>{
  if(ev.key==="Escape"&&!$("#zoom").hidden){ zoomClose(); return; }
  if(ev.key==="Escape"&&!$("#sheet").hidden) closeSheet();
  if(ev.target.id==="ce-in"&&ev.key==="Enter"){ ev.preventDefault(); addEquip(); }
  if(ev.target.id==="coachIn"&&ev.key==="Enter"&&!ev.shiftKey){ ev.preventDefault(); const q=ev.target.value; ev.target.value=""; askCoach(q);}
});

/* ---------- Apple Health (Supabase RPC health_bundle, see supabase/migrations) ---------- */
const SB_SYNC_URL=(window.CR_CONFIG?.supabaseUrl||"https://vjppymebgysvxnrqunua.supabase.co")+"/functions/v1/health-sync";
async function loadHealth(force){
  if(!cloudOK()){ S.health.state="off"; return; }
  S.health.state="loading"; if(force) render();
  try{
    let d=await Store.rpc("health_bundle");
    if(typeof d==="string"){ try{ d=JSON.parse(d); }catch(e){} }
    if(!d||typeof d!=="object") throw new Error("unreadable");
    S.health.days=(d.days||[]).map(x=>({...x,day:String(x.day).slice(0,10)}));
    S.health.workouts=d.workouts||[];
    S.health.hr=cleanHR(d.hr);
    S.health.state="on"; S.health.at=new Date();
  }catch(e){
    S.health.state=e?.code==="not_signed_in"?"off":"error";
    S.health.err=e?.code||e?.message||"";
  }
  if(!inSession()) render();
}
const avgOf = a => { const v=a.filter(x=>x!=null&&isFinite(+x)).map(Number); return v.length?v.reduce((s,x)=>s+x,0)/v.length:null; };
function readiness(){
  const days=S.health.days; if(!days.length) return null;
  const t=todayISO();
  const recent=days.filter(d=>daysBetween(d.day,t)<=1);
  const sleepDay=days.find(d=>d.sleep_hours!=null&&daysBetween(d.day,t)<=1);
  const rhrDay=days.find(d=>d.resting_hr!=null&&daysBetween(d.day,t)<=1);
  const base=avgOf(days.filter(d=>d!==rhrDay&&daysBetween(d.day,t)<=8).map(d=>d.resting_hr));
  const stepsDay=days.find(d=>d.day===t&&d.steps!=null)||days.find(d=>d.steps!=null&&daysBetween(d.day,t)<=1);
  const sleep=sleepDay?+sleepDay.sleep_hours:null, rhr=rhrDay?+rhrDay.resting_hr:null, delta=rhr!=null&&base!=null?rhr-base:null;
  let k="ok", msg="Normal day. Follow the targets.";
  if((sleep!=null&&sleep<6)||(delta!=null&&delta>=5)){ k="easy"; msg="Recovery looks low. Train, but stop at Good, not Tough."; }
  else if(sleep!=null&&sleep>=7&&(delta==null||delta<=2)){ k="go"; msg="Well rested. Good day to push the last set."; }
  if(!recent.length) return {k:"stale",msg:"No health data from the last day. Is the Shortcut running?",sleep:null,rhr:null,delta:null,steps:null};
  return {k,msg,sleep,rhr,delta,steps:stepsDay?+stepsDay.steps:null};
}
function healthStrip(){
  if(S.health.state==="loading"&&!S.health.days.length) return `<div class="health muted small">Checking Apple Health…</div>`;
  if(S.health.state==="off"||S.health.state==="error") return "";
  const r=readiness();
  if(!r) return `<button class="health setup" data-act="health-setup"><span><b>Connect Apple Health</b><br><span class="muted small">Sleep, heart rate and steps from your watch, every day</span></span><span class="go">Set up →</span></button>`;
  const f=(v,u,d=0)=>v==null?"–":`${(+v).toFixed(d)}<small>${u}</small>`;
  return `<div class="health"><div class="hstats">
      <div><b class="num">${f(r.sleep,"h",1)}</b><span>Sleep</span></div>
      <div><b class="num">${f(r.rhr,"bpm")}</b><span>Resting HR${r.delta!=null&&Math.abs(r.delta)>=1?` <em class="${r.delta>0?"up":"dn"}">${r.delta>0?"+":""}${r.delta.toFixed(0)}</em>`:""}</span></div>
      <div><b class="num">${r.steps==null?"–":(+r.steps).toLocaleString()}</b><span>Steps</span></div></div>
    <div class="ready r-${r.k}"><i></i>${esc(r.msg)}</div></div>`;
}
/* per-minute heart rate from health_hr, as [epochSeconds,bpm] */
function cleanHR(a){
  if(!Array.isArray(a)) return [];
  return a.filter(p=>Array.isArray(p)&&isFinite(+p[0])&&isFinite(+p[1])&&+p[1]>20&&+p[1]<250).map(p=>[+p[0]>1e12?+p[0]/1e3:+p[0],+p[1]]).sort((x,y)=>x[0]-y[0]);
}
const maxHR = () => { const m=+S.settings?.maxHr; return m>=100&&m<=240?m:190; };
const ZONES=[["easy","Easy","under 60%"],["moderate","Moderate","60 to 70%"],["hard","Hard","70 to 85%"],["peak","Peak","over 85%"]];
function sessionWindow(w,endMs){
  const s=new Date(w.startedAt||"").getTime(); if(!isFinite(s)) return null;
  let e=endMs!=null?endMs:new Date(w.finishedAt||"").getTime();
  if(!isFinite(e)||e<=s) e=s+((+w.durationMin>0?+w.durationMin:75)*6e4);
  return [s/1e3,e/1e3];
}
function sessionHR(w,endMs){
  try{
    const hr=S.health?.hr; if(!w||!Array.isArray(hr)||hr.length<3) return null;
    const win=sessionWindow(w,endMs); if(!win) return null;
    const [s,e]=win; let lo=0,hi=hr.length; while(lo<hi){ const m=(lo+hi)>>1; if(hr[m][0]<s) lo=m+1; else hi=m; }
    const pts=[]; for(let i=lo;i<hr.length&&hr[i][0]<=e;i++) pts.push(hr[i]);
    if(pts.length<3) return null;
    const bs=pts.map(p=>p[1]), mx=maxHR(), zones={easy:0,moderate:0,hard:0,peak:0};
    pts.forEach((p,i)=>{ const gap=i<pts.length-1?Math.min(5,(pts[i+1][0]-p[0])/60):1, f=p[1]/mx;
      zones[f<.6?"easy":f<.7?"moderate":f<=.85?"hard":"peak"]+=gap; });
    Object.keys(zones).forEach(k=>zones[k]=Math.round(zones[k]));
    return {avg:Math.round(bs.reduce((a,b)=>a+b,0)/bs.length),max:Math.round(Math.max(...bs)),min:Math.round(Math.min(...bs)),points:pts.map(p=>[p[0],p[1]]),zones,start:s,end:e};
  }catch(err){ return null; }
}
const fmtClock = sec => new Date(sec*1e3).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"});
function hrChart(h,id){
  const W=320,H=130,pl=30,pr=8,pt=10,pb=20, gid="hg"+String(id||"x").replace(/[^\w-]/g,"");
  const lo=Math.max(30,h.min-8), hi=h.max+8;
  const x=t=>pl+(W-pl-pr)*((t-h.start)/((h.end-h.start)||1)), y=v=>pt+(H-pt-pb)*(1-(v-lo)/((hi-lo)||1));
  const line=h.points.map((p,i)=>`${i?"L":"M"}${x(p[0]).toFixed(1)} ${y(p[1]).toFixed(1)}`).join(" ");
  const first=h.points[0], last=h.points.at(-1), base=(H-pb).toFixed(1);
  const area=`${line} L${x(last[0]).toFixed(1)} ${base} L${x(first[0]).toFixed(1)} ${base} Z`;
  const grid=[[h.max,"var(--hot)"],[Math.round((h.max+h.min)/2),null],[h.min,null]].map(([v,c])=>`<line x1="${pl}" x2="${W-pr}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" stroke="var(--line)"${c?"":` stroke-dasharray="3 3"`}/><text x="${pl-6}" y="${(y(v)+3).toFixed(1)}" text-anchor="end" font-size="9" fill="${c||"var(--muted)"}">${v}</text>`).join("");
  const pk=h.points.reduce((a,p)=>p[1]>a[1]?p:a,h.points[0]);
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Heart rate during this workout, from ${h.min} to ${h.max} bpm"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--hot)" stop-opacity=".22"/><stop offset="1" stop-color="var(--hot)" stop-opacity="0"/></linearGradient></defs>${grid}
    <path d="${area}" fill="url(#${gid})"/><path d="${line}" fill="none" stroke="var(--hot)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${x(pk[0]).toFixed(1)}" cy="${y(pk[1]).toFixed(1)}" r="3.5" fill="var(--hot)"/>
    <text x="${pl}" y="${H-5}" font-size="9" fill="var(--muted)">${fmtClock(h.start)}</text><text x="${W-pr}" y="${H-5}" text-anchor="end" font-size="9" fill="var(--muted)">${fmtClock(h.end)}</text></svg>`;
}
const ZONE_NOTE={
  easy:"Most of this session was easy effort. Common with long rests between sets, and that is fine.",
  moderate:"Most of this session was moderate effort. Normal for weight training: your heart rate rises during sets and drops while resting.",
  hard:"Most of this session was hard effort. Your heart worked well. Rest long enough between sets to keep good form.",
  peak:"A lot of this session was near your max. Fine in short bursts. If you felt dizzy or sick, rest longer between sets."
};
function zoneBlock(h){
  const tot=Object.values(h.zones).reduce((a,b)=>a+b,0)||1, top=ZONES.map(z=>z[0]).reduce((a,k)=>h.zones[k]>h.zones[a]?k:a,"easy");
  return `<div class="zbar" role="img" aria-label="Minutes in each heart-rate zone">${ZONES.filter(([k])=>h.zones[k]>0).map(([k])=>`<i class="z-${k}" style="width:${(h.zones[k]/tot*100).toFixed(1)}%"></i>`).join("")}</div>
    <div class="zkey">${ZONES.map(([k,n,r])=>`<span title="${r} of max heart rate"><i class="z-${k}"></i>${n}<b class="num">${h.zones[k]} min</b></span>`).join("")}</div>
    <p class="small muted">${ZONE_NOTE[top]}</p>`;
}
function hrDetail(w){
  const h=sessionHR(w); if(!h) return "";
  const can=S.dbState==="on"&&S.canWrite;
  return `<div class="hrbox"><div class="hrhead"><b>Heart rate</b><span class="small muted num">avg ${h.avg} · peak ${h.max} bpm</span></div>
    ${hrChart(h,w.id)}${zoneBlock(h)}
    <div class="maxhr"><label class="small" for="mhr-${esc(w.id)}"><b>Max heart rate</b><br><span class="tiny muted">Used for heart-rate zones. 190 is a fair default; your trainer can tell you yours.</span></label>
    <input id="mhr-${esc(w.id)}" inputmode="numeric" type="number" min="100" max="240" value="${maxHR()}" data-act="max-hr" ${can?"":"disabled"}></div></div>`;
}
function sparkline(vals,{w=140,h=36,color="var(--accent)"}={}){
  const pts=vals.map((v,i)=>[i,v]).filter(p=>p[1]!=null&&isFinite(+p[1]));
  if(pts.length<2) return `<span class="small muted">Not enough data yet</span>`;
  const ys=pts.map(p=>+p[1]), lo=Math.min(...ys), hi=Math.max(...ys), n=vals.length-1||1;
  const X=i=>2+(w-4)*i/n, Y=v=>h-4-(h-8)*((v-lo)/((hi-lo)||1));
  const d=pts.map((p,i)=>`${i?"L":"M"}${X(p[0]).toFixed(1)} ${Y(+p[1]).toFixed(1)}`).join(" "), last=pts.at(-1);
  return `<svg viewBox="0 0 ${w} ${h}" class="spark-l" aria-hidden="true"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${X(last[0])}" cy="${Y(+last[1])}" r="3" fill="${color}"/></svg>`;
}
function healthProgress(){
  if(S.health.state==="off") return Store.state.configured?`<section class="card"><h3>Apple Health</h3><p class="small muted">Sign in below to see sleep, resting heart rate and steps from your watch here.</p></section>`:"";
  if(S.health.state==="error") return `<section class="card"><h3>Apple Health</h3><p class="small muted">Couldn't read your health data just now.</p><button class="btn block" data-act="health-retry">Try again</button></section>`;
  if(!S.health.days.length) return `<section class="card"><h3>Apple Health</h3><p class="small muted">${S.health.state==="loading"?"Loading…":"No data yet. Set up the iPhone Shortcut to start the daily sync."}</p>${S.health.state==="loading"?"":`<button class="btn block" data-act="health-setup">Set up the Shortcut</button>`}</section>`;
  const t=todayISO(), byDay={}; S.health.days.forEach(d=>byDay[d.day]=d);
  const series=k=>{const a=[]; for(let i=13;i>=0;i--){const d=new Date(t+"T12:00:00"); d.setDate(d.getDate()-i); const iso=new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10); a.push(byDay[iso]?.[k]??null);} return a;};
  const row=(label,k,u,dp,color)=>{const s=series(k), a=avgOf(s); return `<div class="hrow"><div><div class="small muted">${label}</div><b class="num">${a==null?"–":a.toFixed(dp)}<small>${u}</small></b><div class="tiny muted">14-day average</div></div>${sparkline(s,{color})}</div>`;};
  const last=S.health.days[0];
  return `<section class="card"><div class="spread"><h3>Apple Health</h3><button class="pill quiet" data-act="health-retry">↻ Refresh</button></div>
    ${row("Sleep","sleep_hours","h",1,"var(--sleep)")}${row("Resting heart rate","resting_hr"," bpm",0,"var(--hot)")}${row("Steps","steps","",0,"var(--good)")}
    <p class="tiny muted">Last synced day: ${fmtDate(last.day)}. Lower resting heart rate over weeks usually means fitness is improving.</p></section>`;
}
function healthSetupSheet(){
  const step=(n,t,d)=>`<li><b>${t}</b>${d?`<span>${d}</span>`:""}</li>`;
  openSheet(`<div class="stack-l"><div><div class="eyebrow">About 5 minutes on your iPhone</div><h2>Sync Apple Health</h2></div>
    <p class="small muted">Zepp already copies your watch data into Apple Health. This Shortcut sends a daily summary from Apple Health to your private database. Do it once and it runs on its own.</p>
    <div class="card"><h3>Part 1 · Build the Shortcut</h3><ol class="steps">
      ${step(1,"Open Shortcuts and tap + to make a new one. Name it “Clear Reps Sync”.")}
      ${step(2,"Add “Find Health Samples”.","Type: Steps. Start Date is today. Then add “Calculate Statistics” → Sum. Rename the result Steps.")}
      ${step(3,"Repeat for Resting Heart Rate.","Find Health Samples → Type: Resting Heart Rate, Start Date is in the last 1 day → Calculate Statistics → Average.")}
      ${step(4,"Repeat for Heart Rate.","Type: Heart Rate, today → Average.")}
      ${step(5,"Repeat for Active Energy.","Type: Active Energy, today → Sum.")}
      ${step(6,"Sleep.","Find Health Samples → Type: Sleep, Start Date is in the last 1 day. Add “Get Details of Health Samples” → Duration. Then Calculate Statistics → Sum. Then a Calculate action: divide by 3600 if it shows seconds.")}
      ${step(7,"Add “Get Contents of URL”.","Paste the address below. Tap Show More: Method POST. Headers: add key <code>x-sync-key</code> with your sync key from the chat. Request Body: JSON, with fields <code>steps</code>, <code>resting_hr</code>, <code>avg_hr</code>, <code>active_kcal</code>, <code>sleep_hours</code>, each set to the matching result.")}
    </ol>
    <div class="copyrow"><code id="syncUrl">${SB_SYNC_URL}</code><button class="pill" data-act="copy" data-t="${SB_SYNC_URL}">Copy</button></div></div>
    <div class="card"><h3>Part 2 · Run it every day</h3><ol class="steps">
      ${step(1,"In Shortcuts, open Automation → + → Time of Day.","Pick 10:00 PM, Daily. Choose “Run Immediately”.")}
      ${step(2,"Select “Clear Reps Sync”.","Tap Done.")}
      ${step(3,"Run it once by hand now.","The first time, iPhone asks to allow Health access and the web request. Allow both. It should show ok: true.")}
    </ol></div>
    <p class="small muted">Any metric you skip is fine; the app shows whatever arrives. If Zepp doesn't write a metric (for example resting heart rate), that box just stays blank.</p>
    <button class="btn primary block" data-act="health-done">I've run it · refresh</button>
    <button class="btn ghost block" data-act="close-sheet">Close</button></div>`);
}

/* ---------- coach ---------- */
function mdLite(t){
  const blocks=esc(t).split(/\n{2,}/);
  return blocks.map(b=>{
    const lines=b.split("\n");
    if(lines.every(l=>/^\s*([-*•]|\d+\.)\s+/.test(l))) return "<ul>"+lines.map(l=>`<li>${l.replace(/^\s*([-*•]|\d+\.)\s+/,"")}</li>`).join("")+"</ul>";
    return "<p>"+b.replace(/\n/g,"<br>")+"</p>";
  }).join("").replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");
}
function coachContext(){
  const wk=currentWeek(), ph=phaseFor(wk), act=actualVolume(), plan=plannedVolume(ph.sets);
  const recent=doneWorkouts().slice(0,6).map(w=>{
    const s=(w.sets||[]).filter(x=>x.done), byEx={};
    s.forEach(x=>(byEx[x.ex]=byEx[x.ex]||[]).push(EX[x.ex]?.inc===0?`${x.r}`:`${x.w}kg×${x.r}${x.rir!==""&&x.rir!=null?"@RIR"+x.rir:""}`));
    return `${w.date} ${wLabel(w)}: `+Object.entries(byEx).map(([k,a])=>`${EX[k]?.n}: ${a.join(", ")}`).join("; ")+(w.rpe?` | session effort ${w.rpe}/10`:"")+(()=>{ const h=sessionHR(w); return h?` | watch HR avg ${h.avg}, peak ${h.max}, ${h.zones.hard+h.zones.peak} min hard or peak (zones use max HR ${maxHR()})`:(w.avgHr?` | avg HR ${w.avgHr}`:""); })()+(w.notes?` | notes: ${w.notes}`:"");
  }).join("\n")||"No sessions logged yet.";
  const uc=usingCustom(), cds=customDays(), g=gymSet();
  const prog=planDays().map(d=>{ const r=resolveDay(d); return `${d.custom?"":`Day ${d.id} `}${d.name}: ${r.ex.map((id,i)=>`${EX[id].n} ${setsFor(d,d.ex[i],ph)}x${EX[id].r[0]}-${EX[id].r[1]}${r.swaps[id]?` (swapped in for ${EX[r.swaps[id]].n}, gym lacks the equipment)`:""}${r.missing.includes(id)?" (his gym lacks the equipment, no swap found)":""}`).join(", ")}`; }).join("\n");
  const others=!uc&&cds.length?`\nHIS OWN SAVED WORKOUTS (extra, not the main plan):\n${cds.map(d=>`${d.name}: ${d.ex.map(id=>`${EX[id].n}${EX[id].custom?" (his own exercise)":""} ${setsFor(d,id,ph)}x${EX[id].r[0]}-${EX[id].r[1]}`).join(", ")}`).join("\n")}`:"";
  const ae=allEquip(), ce=customEquip();
  const gear=(g?`GYM EQUIPMENT HE HAS: ${ae.filter(([k])=>g.has(k)).map(x=>x[1]).join(", ")||"nothing ticked, bodyweight only"}. NOT AVAILABLE: ${ae.filter(([k])=>!g.has(k)).map(x=>x[1]).join(", ")||"nothing"}.`:"GYM EQUIPMENT: not set, assume a fully equipped gym.")
    +(ce.length?` EQUIPMENT HE ADDED HIMSELF: ${ce.map(c=>c.name).join(", ")}.`:"")
    +` He often trains with a trainer who changes the exercises each day; "Free session" workouts are those, built as he goes.`;
  const vol=Object.keys(MUSCLES).map(k=>`${MUSCLES[k].n} ${+act[k].toFixed(1)}/${+plan[k].toFixed(1)}`).join(", ");
  const ck=S.checkins.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(c=>`${c.date}: ${[c.weight&&c.weight+"kg",c.waist&&"waist "+c.waist+"cm"].filter(Boolean).join(", ")}`).join("; ");
  const hd=S.health.days.slice(0,7).map(d=>`${d.day}: ${[d.sleep_hours!=null&&"sleep "+(+d.sleep_hours).toFixed(1)+"h",d.resting_hr!=null&&"resting HR "+Math.round(d.resting_hr),d.steps!=null&&"steps "+d.steps,d.avg_hr!=null&&"avg HR "+Math.round(d.avg_hr)].filter(Boolean).join(", ")}`).join("\n");
  let live=hd?`\nAPPLE HEALTH (from his Amazfit watch via Zepp), last 7 days:\n${hd}`:"";
  if(S.active){ const s=(S.active.sets||[]).filter(x=>x.done); live=`\nCURRENTLY MID-SESSION: ${wLabel(S.active)}, ${s.length} sets logged so far.`; }
  return `TODAY: ${todayISO()}. Program week ${wk}, phase "${ph.name}" (${ph.sets} working sets per exercise, stop at RIR ${ph.rir}).
${uc?`PROGRAM (his own workouts, rotated in order; he chose these over the built-in A/B/C plan):`:"PROGRAM (3 days, rotate A>B>C):"}\n${prog}${others}
${gear}
SETS PER MUSCLE, last 7 days (done/planned): ${vol}
RECENT SESSIONS:\n${recent}
BODY CHECK-INS: ${ck||"none yet"}${live}`;
}
async function askCoach(q){
  if(!cloudOK()||S.chatBusy||!q.trim()) return;
  S.chat.push({role:"user",content:q.trim()});
  S.chatBusy=true; render();
  const instructions=`You are a calm, practical strength coach inside the user's workout app. The user is a man returning to the gym after about a month off. He has trained on and off with personal trainers for a few years but says he lacks clear knowledge of exercise selection, volume, warm-ups and stretching, and wants clarity so he can train with or without his trainer. Units: kg and cm.
Rules: Answer in plain, friendly language, short paragraphs or a short list, under about 180 words unless he asks for detail. Be specific to his program and log below. Give concrete numbers (sets, reps, kg, seconds) when useful. Explain the why in one line so he learns. Never diagnose injuries: for sharp, pinching, joint or worsening pain, tell him to stop that exercise and get it checked by a physio or doctor. Don't recommend supplements or drugs. If his log shows a problem (too little or too much volume, no progression, effort too high), say so honestly. Only suggest exercises his gym equipment allows.
APP DATA:\n${coachContext()}`;
  const convo=S.chat.filter(m=>m.content).map(m=>({role:m.role,content:m.content}));
  const out={role:"assistant",content:"",streaming:true};
  S.chat.push(out);
  try{
    const res=await Store.fn("coach",{system:instructions,messages:convo});
    out.content=(res&&(res.text||res.error))||"The coach sent an empty answer.";
  }catch(e){
    let msg=""; try{ const j=await e?.context?.json(); msg=j?.error||""; }catch(_){}
    out.content=msg||"The coach couldn't answer just now. Check the coach function is deployed (see README) and try again.";
  }
  delete out.streaming; S.chatBusy=false; render();
}

/* ---------- writes ---------- */
let saveT=null;
function saveActiveSoon(){ clearTimeout(saveT); saveT=setTimeout(saveActive,350); }
/* flush a pending save when the app goes to the background (phone locked, app switched) */
const flushSave=()=>{ if(saveT){ clearTimeout(saveT); saveT=null; saveActive(); } };
document.addEventListener("visibilitychange",()=>{ if(document.hidden) flushSave(); });
window.addEventListener("pagehide",flushSave);
async function saveActive(){
  if(!S.active) return;
  const {id,...body}=S.active;
  try{ await Store.put("workouts",id,body); }
  catch(e){ toast("Couldn't save on this phone."); }
}
async function ensureStart(){
  if(S.settings?.programStart) return;
  S.settings={...(S.settings||{}),programStart:todayISO()};
  try{ await Store.putSettings(S.settings); }catch(e){}
}
/* a session that carries its own exercise list: Just train (empty) or Do again (copied) */
async function startCustom({dayId,dayName,ex,counts}){
  if(!(S.dbState==="on"&&S.canWrite)){ toast("Still loading. One second."); return; }
  if(S.active){ toast("Finish or discard the workout in progress first"); return; }
  await ensureStart();
  const wk=currentWeek(), ph=phaseFor(wk), list=(ex||[]).filter(id=>EX[id]), sets=[];
  list.forEach(id=>{ const t=targetFor(id), n=Math.max(1,Math.min(8,+counts?.[id]||ph.sets)); for(let j=0;j<n;j++) sets.push({k:uid(),ex:id,w:t.w===""?"":t.w,r:t.r,rir:"",done:false}); });
  S.active={id:uid(),status:"active",dayId,dayName:dayName||"Free session",week:wk,date:todayISO(),startedAt:new Date().toISOString(),exList:list,swaps:{},missing:[],sets,warm:{},cool:{}};
  S.step=0; S.exIdx=0; S.hint=""; S.paused=false; S.view="today"; closeSheet(); render(); window.scrollTo(0,0);
  await saveActive();
  requestWake();
}
const doneOrder = w => { const o=[]; (w.sets||[]).forEach(s=>{ if(s.done&&EX[s.ex]&&!EX[s.ex].placeholder&&!o.includes(s.ex)) o.push(s.ex); }); return o; };
const doneCounts = (w,ids) => Object.fromEntries(ids.map(id=>[id,(w.sets||[]).filter(s=>s.ex===id&&s.done).length]));
function redoWorkout(wid){
  const w=S.workouts.find(x=>x.id===wid); if(!w) return;
  const ex=doneOrder(w); if(!ex.length){ toast("Nothing to repeat in that one"); return; }
  const keep=w.dayId&&w.dayId!=="free"&&dayById(w.dayId);
  startCustom({dayId:keep?w.dayId:"free",dayName:keep?keep.name:"Free session",ex,counts:doneCounts(w,ex)});
}
async function saveAsDay(wid,btn){
  const w=S.workouts.find(x=>x.id===wid); if(!w) return;
  const ex=doneOrder(w); if(!ex.length){ toast("Nothing to save in that one"); return; }
  if(!canSave()) return;
  const groups=w.dayId==="free"?String(w.dayName||"").replace(/^Free session( · )?/,"").split(", ").filter(Boolean).join(" + "):"";
  const name=(groups||histName(w)||"My workout").slice(0,40);
  btn.disabled=true;
  const ok=await saveSettings({customDays:[...(S.settings?.customDays||[]),{id:"u_"+uid(),name,ex,sets:doneCounts(w,ex)}]});
  if(!ok){ btn.disabled=false; return; }
  S.savedAs.add(wid); render(); toast(`Saved as "${name}" in Your workouts`);
}
async function addEquip(){
  const inp=$("#ce-in"), name=(inp?.value||"").trim().replace(/\s+/g," ").slice(0,40);
  if(!name){ toast("Type a name first"); inp?.focus(); return; }
  if(allEquip().some(([,n])=>n.toLowerCase()===name.toLowerCase())){ toast("That's already on the list"); return; }
  if(!canSave()) return;
  if(gymT){ clearTimeout(gymT); gymT=null; }
  const id="ce_"+uid(), eq=gymSet();
  const ok=await saveSettings({customEquipment:[...customEquip(),{id,name}],...(eq?{equipment:[...eq,id]}:{})});
  if(ok){ gymSheet(); render(); toast(`Added ${name}`); }
}
async function startSession(dayId){
  if(dayId==="free") return startCustom({dayId:"free",dayName:"Free session",ex:[]});
  await ensureStart();
  const day=dayById(dayId), wk=currentWeek(), ph=phaseFor(wk);
  if(!day||!day.ex.length){ toast("Add an exercise to this workout first"); return; }
  const res=resolveDay(day), sets=[];
  res.ex.forEach((id,i)=>{ const t=targetFor(id), n=setsFor(day,day.ex[i],ph); for(let j=0;j<n;j++) sets.push({k:uid(),ex:id,w:t.w===""?"":t.w,r:t.r,rir:"",done:false}); });
  S.active={id:uid(),status:"active",dayId,dayName:day.name,week:wk,date:todayISO(),startedAt:new Date().toISOString(),exList:res.ex,swaps:res.swaps,missing:res.missing,sets,warm:{},cool:{}};
  S.step=0; S.exIdx=0; S.hint=""; S.paused=false; S.view="today"; render(); window.scrollTo(0,0);
  await saveActive();
  requestWake();
}

async function saveCheckin(btn){
  const num=v=>{const n=parseFloat(String(v).replace(",","."));return isFinite(n)?n:null;};
  const c={date:todayISO(),weight:num($("#ck-w").value),waist:num($("#ck-waist").value),arm:num($("#ck-arm").value),photoId:null};
  const f=$("#ck-photo")?.files?.[0];
  if(!c.weight&&!c.waist&&!c.arm&&!f){ toast("Add a measurement or a photo"); return; }
  btn.disabled=true; btn.textContent="Saving…";
  try{
    if(f){ const id="ph_"+uid(); await Store.putBlob(id,f); c.photoId=id; S.photoUrls[id]=URL.createObjectURL(f); }
    await Store.put("checkins",uid(),c);
    S.showCheckin=false;
    toast("Check-in saved");
  }catch(e){ toast(e?.message?"Couldn't save: "+e.message:"Couldn't save the check-in"); btn.disabled=false; btn.textContent="Save check-in"; }
}
/* progress photos live on the phone (and in Storage when signed in); resolve their URLs lazily */
function hydratePhotoUrls(){
  S.checkins.filter(c=>c.photoId&&!S.photoUrls[c.photoId]).forEach(c=>{ S.photoUrls[c.photoId]="pending";
    Store.blobUrl(c.photoId).then(u=>{ S.photoUrls[c.photoId]=u||"missing"; const img=document.querySelector(`img[data-photo="${CSS.escape(c.photoId)}"]`); if(img&&u) img.src=u; }); });
}

/* ---------- boot ---------- */
render();
(async()=>{
  try{ await Store.ready(); }catch(e){ S.dbState="off"; render(); return; }
  await Store.seedIfEmpty("data/seed.json");
  /* settings first, so custom exercises exist before workouts reference them */
  S.settings=await Store.getSettings(); applyCustomEx();
  const takeWorkouts=list=>{
    S.workouts=list.sort((a,b)=>String(b.date+(b.startedAt||"")).localeCompare(a.date+(a.startedAt||"")));
    S.workouts.forEach(w=>{ (w.sets||[]).forEach(s=>ensureEx(s.ex)); (w.exList||[]).forEach(ensureEx); });
    const act=S.workouts.find(w=>w.status==="active");
    if(act && !S.active){ S.active=JSON.parse(JSON.stringify(act)); S.paused=S.view!=="today"; S.step=(act.sets||[]).some(s=>s.done)?1:0; const dd=sessionDay(act); S.exIdx=Math.max(0,dd.ex.findIndex(x=>(act.sets||[]).some(s=>s.ex===x&&!s.done))); }
  };
  takeWorkouts(await Store.list("workouts"));
  S.checkins=await Store.list("checkins"); hydratePhotoUrls();
  S.dbState="on"; render();
  /* live updates (sync from another device, imports): never redraw mid-set */
  Store.subscribe("settings",s=>{ S.settings=s; applyCustomEx(); if(!inSession()) render(); });
  Store.subscribe("workouts",list=>{ const was=inSession(); takeWorkouts(list); if(!inSession()||!was) render(); });
  Store.subscribe("checkins",list=>{ S.checkins=list; hydratePhotoUrls(); if(!inSession()) render(); });
  /* cloud: optional */
  if(Store.configure(window.CR_CONFIG)){
    Store.subscribe("auth",()=>{ if(cloudOK()) loadHealth(false); else { S.health={state:"off",days:[],workouts:[],hr:[]}; } if(!inSession()) render(); });
    Store.subscribe("sync",()=>{ const el=$("#syncpill"); if(el) el.outerHTML=syncPill(); });
  }
})();
