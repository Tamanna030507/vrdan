import { useState, useEffect } from "react";

const SIKAR_LAT = 27.6094;
const SIKAR_LON = 75.1399;

const WMO = {
  0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",
  45:"Fog",48:"Icy fog",51:"Light drizzle",53:"Drizzle",55:"Heavy drizzle",
  61:"Light rain",63:"Moderate rain",65:"Heavy rain",
  71:"Light snow",73:"Snow",75:"Heavy snow",
  80:"Light showers",81:"Showers",82:"Heavy showers",
  95:"Thunderstorm",96:"Thunderstorm+hail",99:"Severe thunderstorm",
};

const icon = (code, isDay = 1) => {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function PrecipitationForecast() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const [view, setView] = useState("daily");

  useEffect(() => { fetch14Day(); }, []);

  const fetch14Day = async () => {
    setLoading(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${SIKAR_LAT}&longitude=${SIKAR_LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode&hourly=temperature_2m,precipitation,precipitation_probability,weathercode,is_day&current_weather=true&timezone=Asia%2FKolkata&forecast_days=14`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
      setErr(false);
    } catch {
      setErr(true);
    }
    setLoading(false);
  };

  const totalRain7 = data?.daily?.precipitation_sum?.slice(0,7).reduce((a,b)=>a+(b||0),0)||0;
  const maxBar = Math.max(...(data?.daily?.precipitation_sum?.slice(0,14)||[1]),1);
  const now = new Date();
  const ch = now.getHours();
  const hs = data?.hourly;
  const hourly = hs ? {
    time: hs.time.slice(ch, ch+24),
    prec: hs.precipitation.slice(ch, ch+24),
    prob: hs.precipitation_probability.slice(ch, ch+24),
    temp: hs.temperature_2m.slice(ch, ch+24),
    code: hs.weathercode.slice(ch, ch+24),
    day:  hs.is_day.slice(ch, ch+24),
  } : null;

  const irrRec = () => {
    if (!data) return null;
    const r3 = data.daily.precipitation_sum.slice(0,3).reduce((a,b)=>a+(b||0),0);
    const r1 = data.daily.precipitation_sum[1]||0;
    if (r3>15) return { msg:"Rain forecast — skip irrigation 3 days", color:"#4ade80" };
    if (r1>5) return { msg:"Light rain tomorrow — delay irrigation 1 day", color:"#c8960c" };
    return { msg:"No rain expected — irrigate tonight or early morning", color:"#c4622d" };
  };
  const rec = irrRec();

  return (
    <div>
      <style>{`@keyframes shine{0%{opacity:.3}50%{opacity:.7}100%{opacity:.3}}`}</style>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"14px"}}>
        <div>
          <div style={{fontSize:"11px",color:"#c8960c",fontWeight:"700",letterSpacing:"2px",textTransform:"uppercase"}}>Precipitation Forecast</div>
          <div style={{fontSize:"10px",color:"#555",marginTop:"2px"}}>Sikar, Rajasthan · Open-Meteo · Live</div>
        </div>
        <div style={{display:"flex",gap:"2px",background:"#0d0d0d",padding:"3px",borderRadius:"8px",border:"1px solid #1a1a1a"}}>
          {["daily","hourly"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{background:view===v?"#1a1a1a":"none",border:"none",color:view===v?"#c8960c":"#555",padding:"5px 10px",borderRadius:"6px",fontSize:"10px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              {v==="daily"?"14-day":"24-hour"}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
          {[...Array(5)].map((_,i)=>(
            <div key={i} style={{height:"44px",background:"#1a1a1a",borderRadius:"8px",animation:`shine 1.2s ease ${i*0.1}s infinite`}}/>
          ))}
        </div>
      )}

      {err && !loading && (
        <div style={{background:"rgba(196,98,45,0.08)",border:"1px solid rgba(196,98,45,0.2)",borderRadius:"8px",padding:"12px",fontSize:"12px",color:"#c4622d"}}>
          Could not load live weather. Check network and try again.
          <button onClick={fetch14Day} style={{marginLeft:"8px",background:"none",border:"none",color:"#c8960c",cursor:"pointer",fontSize:"12px",fontWeight:"700"}}>Retry</button>
        </div>
      )}

      {!loading && !err && data && (
        <>
          {/* Current */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",background:"rgba(200,150,12,0.06)",borderRadius:"10px",border:"1px solid rgba(200,150,12,0.15)",marginBottom:"10px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <span style={{fontSize:"28px"}}>{icon(data.current_weather.weathercode, data.current_weather.is_day)}</span>
              <div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:"22px",fontWeight:"900",color:"#c8960c",lineHeight:1}}>{Math.round(data.current_weather.temperature)}°C</div>
                <div style={{fontSize:"11px",color:"#555"}}>{WMO[data.current_weather.weathercode]||"Clear"}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:"11px",color:"#555"}}>Rain next 7 days</div>
              <div style={{fontSize:"16px",fontWeight:"700",color:totalRain7>5?"#4ade80":"#888"}}>{totalRain7.toFixed(1)} mm</div>
            </div>
          </div>

          {/* Irrigation rec */}
          {rec && (
            <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:rec.color+"0f",border:`1px solid ${rec.color}33`,borderRadius:"8px",marginBottom:"12px"}}>
              <div style={{width:"6px",height:"6px",borderRadius:"50%",background:rec.color,flexShrink:0}}/>
              <span style={{fontSize:"11px",color:rec.color,fontWeight:"600"}}>{rec.msg}</span>
            </div>
          )}

          {/* Daily */}
          {view==="daily" && (
            <div style={{display:"flex",flexDirection:"column",gap:"0"}}>
              {data.daily.time.map((date,i)=>{
                const rain = data.daily.precipitation_sum[i]||0;
                const prob = data.daily.precipitation_probability_max[i]||0;
                const maxT = Math.round(data.daily.temperature_2m_max[i]);
                const minT = Math.round(data.daily.temperature_2m_min[i]);
                const d = new Date(date);
                const barW = Math.max(2,(rain/maxBar)*80);
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 4px",borderBottom:"1px solid #0f0f0f",background:i===0?"rgba(200,150,12,0.04)":"transparent"}}>
                    <div style={{minWidth:"52px"}}>
                      <div style={{fontSize:"11px",fontWeight:i===0?"700":"400",color:i===0?"#c8960c":"#888"}}>{i===0?"Today":DAYS[d.getDay()]}</div>
                      <div style={{fontSize:"9px",color:"#444"}}>{d.getDate()} {MONTHS[d.getMonth()]}</div>
                    </div>
                    <span style={{fontSize:"16px",flexShrink:0}}>{icon(data.daily.weathercode[i])}</span>
                    <div style={{display:"flex",gap:"4px",minWidth:"52px"}}>
                      <span style={{fontSize:"12px",fontWeight:"700",color:"#e0d8c8"}}>{maxT}°</span>
                      <span style={{fontSize:"11px",color:"#444"}}>{minT}°</span>
                    </div>
                    <div style={{flex:1,height:"4px",background:"#1a1a1a",borderRadius:"2px",overflow:"hidden"}}>
                      <div style={{width:`${barW}%`,height:"100%",background:rain>0?"#4ade80":"#1a1a1a",borderRadius:"2px",transition:"width 0.8s ease"}}/>
                    </div>
                    <div style={{fontSize:"11px",color:rain>0?"#4ade80":"#333",fontWeight:"600",minWidth:"44px",textAlign:"right"}}>{rain>0?`${rain.toFixed(1)}mm`:"—"}</div>
                    <div style={{fontSize:"10px",color:prob>50?"#4ade80":"#444",minWidth:"28px",textAlign:"right"}}>{prob}%</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Hourly */}
          {view==="hourly" && hourly && (
            <div style={{overflowX:"auto",paddingBottom:"4px"}}>
              <div style={{display:"flex",gap:"6px",minWidth:"max-content"}}>
                {hourly.time.map((t,i)=>{
                  const h=new Date(t).getHours();
                  const rain=hourly.prec[i]||0;
                  const prob=hourly.prob[i]||0;
                  const temp=Math.round(hourly.temp[i]);
                  return (
                    <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"4px",padding:"10px 8px",background:rain>0?"rgba(74,222,128,0.06)":"#0d0d0d",borderRadius:"8px",border:`1px solid ${rain>0?"rgba(74,222,128,0.2)":"#1a1a1a"}`,minWidth:"56px"}}>
                      <div style={{fontSize:"9px",color:"#555"}}>{h===0?"12am":h<12?`${h}am`:h===12?"12pm":`${h-12}pm`}</div>
                      <span style={{fontSize:"16px"}}>{icon(hourly.code[i],hourly.day[i])}</span>
                      <div style={{fontSize:"12px",fontWeight:"700",color:"#e0d8c8"}}>{temp}°</div>
                      <div style={{fontSize:"10px",color:rain>0?"#4ade80":"#333",fontWeight:"600"}}>{rain>0?`${rain.toFixed(1)}`:"-"}mm</div>
                      <div style={{fontSize:"9px",color:prob>50?"#4ade80":"#444"}}>{prob}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{fontSize:"9px",color:"#333",marginTop:"8px",textAlign:"right"}}>
            Live data · Open-Meteo (open-source) · Updated hourly
            <span style={{color:"#c8960c",cursor:"pointer",marginLeft:"8px"}} onClick={fetch14Day}>↻ Refresh</span>
          </div>
        </>
      )}
    </div>
  );
}