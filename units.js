// Inch-mode patch for Body Tracker V2
// Circumference and height are entered/stored in inches. Weight remains kg.
(function(){
  const UNIT_VERSION_KEY = "bodyTrackerUnitVersion";
  const CM_TO_IN = 1 / 2.54;

  // One-time migration for data/settings created by the original cm version.
  if(localStorage.getItem(UNIT_VERSION_KEY) !== "in-v2"){
    if(settings && Number(settings.height) > 100){ settings.height = +(settings.height * CM_TO_IN).toFixed(2); }
    if(Array.isArray(measurements)){
      measurements = measurements.map(m => {
        const copy = {...m};
        ["waist","neck","hip","chest","arm","thigh"].forEach(k => {
          if(Number(copy[k]) > 0) copy[k] = +(copy[k] * CM_TO_IN).toFixed(2);
        });
        return copy;
      });
    }
    saveSettingsData();
    saveMeasurements();
    localStorage.setItem(UNIT_VERSION_KEY,"in-v2");
  }

  calcBMI = function(weight, heightIn){
    if(!weight || !heightIn) return null;
    const m = heightIn * 0.0254;
    return weight/(m*m);
  };

  calcBodyFat = function({sex,height,waist,neck,hip}){
    if(!height || !waist || !neck) return null;
    const h=Number(height), w=Number(waist), n=Number(neck);
    let bf;
    if(sex === "female"){
      if(!hip) return null;
      const x=w+Number(hip)-n;
      if(x<=0) return null;
      bf=163.205*Math.log10(x)-97.684*Math.log10(h)-78.387;
    }else{
      const x=w-n;
      if(x<=0) return null;
      bf=86.010*Math.log10(x)-70.041*Math.log10(h)+36.76;
    }
    return Number.isFinite(bf) ? Math.max(2,Math.min(75,bf)) : null;
  };

  metricMeta = function(metric){
    return {
      weight:{label:"Weight",unit:"kg"}, bodyFat:{label:"Body Fat",unit:"%"},
      waist:{label:"Waist",unit:"in"}, chest:{label:"Chest",unit:"in"},
      arm:{label:"Arm",unit:"in"}, thigh:{label:"Thigh",unit:"in"}
    }[metric];
  };

  renderHome = function(){
    const l=latest();
    if(!l){
      $("heroBodyFat").textContent="--%"; $("heroBodyFatChange").textContent="ยังไม่มีข้อมูล";
      $("homeWeight").textContent="-- kg"; $("homeWaist").textContent="-- in";
      $("homeBmi").textContent="--"; $("homeLeanMass").textContent="-- kg";
    }else{
      $("heroBodyFat").textContent=l.bodyFat!=null?`${fmt(l.bodyFat)}%`:"--%";
      const arr=sorted().map(enrich).filter(x=>x.bodyFat!=null);
      $("heroBodyFatChange").textContent=arr.length>=2?`${arr[arr.length-1].bodyFat-arr[0].bodyFat>0?"+":""}${fmt(arr[arr.length-1].bodyFat-arr[0].bodyFat)}% since first entry`:"บันทึกครั้งแรกแล้ว";
      $("homeWeight").textContent=`${fmt(l.weight)} kg`; $("homeWaist").textContent=`${fmt(l.waist)} in`;
      $("homeBmi").textContent=fmt(l.bmi); $("homeLeanMass").textContent=l.leanMass!=null?`${fmt(l.leanMass)} kg`:"-- kg";
    }
    drawChart($("homeChart"),$("homeChartMetric").value,90);
  };

  renderHistory = function(){
    const list=$("historyList"), arr=sorted().reverse().map(enrich);
    if(!arr.length){ list.innerHTML='<div class="empty">ยังไม่มีข้อมูล<br>กด + เพื่อเพิ่มการวัดครั้งแรก</div>'; return; }
    list.innerHTML=arr.map(m=>`<div class="history-item"><div class="history-top"><div><div class="history-date">${new Date(m.date+"T00:00:00").toLocaleDateString("th-TH",{day:"numeric",month:"short",year:"numeric"})}</div><div class="history-meta">Waist ${fmt(m.waist)} in · Neck ${fmt(m.neck)} in${m.chest?` · Chest ${fmt(m.chest)} in`:""}</div></div><div class="history-values"><div><strong>${fmt(m.weight)}</strong><span>kg</span></div><div><strong>${m.bodyFat!=null?fmt(m.bodyFat):"--"}</strong><span>% fat</span></div></div></div><div class="history-actions"><button class="secondary" onclick="openEdit('${m.id}')">Edit</button><button class="danger" onclick="deleteMeasurement('${m.id}')">Delete</button></div></div>`).join("");
  };

  // Refresh with migrated inch values.
  renderSettings();
  renderHome();
})();
