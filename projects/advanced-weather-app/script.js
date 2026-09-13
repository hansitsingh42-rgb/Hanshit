const API = 'https://api.open-meteo.com/v1/forecast';
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';

const $ = (id) => document.getElementById(id);
let unit = localStorage.getItem('skycast-unit') || 'C';
let currentPlace = null;
let debounceTimer;

const weatherMap = {
  0:['☀️','Clear sky'],1:['🌤️','Mainly clear'],2:['⛅','Partly cloudy'],3:['☁️','Overcast'],
  45:['🌫️','Fog'],48:['🌫️','Rime fog'],51:['🌦️','Light drizzle'],53:['🌦️','Drizzle'],55:['🌧️','Heavy drizzle'],
  56:['🌧️','Freezing drizzle'],57:['🌧️','Freezing drizzle'],61:['🌦️','Light rain'],63:['🌧️','Rain'],65:['🌧️','Heavy rain'],
  66:['🌧️','Freezing rain'],67:['🌧️','Heavy freezing rain'],71:['🌨️','Light snow'],73:['❄️','Snow'],75:['❄️','Heavy snow'],
  77:['🌨️','Snow grains'],80:['🌦️','Rain showers'],81:['🌧️','Rain showers'],82:['⛈️','Heavy rain showers'],
  85:['🌨️','Snow showers'],86:['❄️','Heavy snow showers'],95:['⛈️','Thunderstorm'],96:['⛈️','Thunderstorm + hail'],99:['⛈️','Severe thunderstorm']
};

const cToF = (c) => c * 9 / 5 + 32;
const temp = (c) => `${Math.round(unit === 'F' ? cToF(c) : c)}°`;
const wind = (kph) => unit === 'F' ? `${Math.round(kph / 1.609)} mph` : `${Math.round(kph)} km/h`;
const distance = (m) => `${(m / 1000).toFixed(1)} km`;
const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

function setStatus(message='', error=false){ $('status').textContent = message; $('status').style.color = error ? '#ff8d8d' : ''; }
function getFavorites(){ try{return JSON.parse(localStorage.getItem('skycast-favorites') || '[]')}catch{return[]} }
function saveFavorites(list){ localStorage.setItem('skycast-favorites', JSON.stringify(list.slice(0,6))); renderFavorites(); }

function renderFavorites(){
  const list = getFavorites();
  $('favoritesList').innerHTML = list.length ? list.map((p,i)=>`<div class="saved-place" data-index="${i}"><span>📍 ${escapeHtml(p.name)}</span><button type="button" data-remove="${i}" aria-label="Remove ${escapeHtml(p.name)}">×</button></div>`).join('') : '<p class="muted">No saved locations yet.</p>';
  $('favoritesList').querySelectorAll('.saved-place').forEach(el=>el.addEventListener('click',e=>{if(e.target.dataset.remove!==undefined){const copy=getFavorites();copy.splice(Number(e.target.dataset.remove),1);saveFavorites(copy);return}loadWeather(getFavorites()[Number(el.dataset.index)]);}));
}

function isFavorite(place){return getFavorites().some(p=>p.latitude===place.latitude&&p.longitude===place.longitude)}
function updateFavoriteButton(){ $('favoriteBtn').textContent=isFavorite(currentPlace)?'★':'☆'; $('favoriteBtn').classList.toggle('active',isFavorite(currentPlace)); }

async function searchPlaces(query, showSuggestions=false){
  if(!query.trim()) return;
  try{
    const res=await fetch(`${GEO}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`);
    if(!res.ok) throw new Error('Location search failed');
    const data=await res.json();
    if(!data.results?.length){setStatus('No matching location found.',true);return;}
    if(showSuggestions){
      $('suggestions').innerHTML=data.results.map((p,i)=>`<button class="suggestion" type="button" data-index="${i}">${escapeHtml(p.name)}, ${escapeHtml(p.country || '')}${p.admin1?` · ${escapeHtml(p.admin1)}`:''}</button>`).join('');
      $('suggestions').hidden=false;
      $('suggestions').querySelectorAll('.suggestion').forEach(btn=>btn.addEventListener('click',()=>{loadWeather(data.results[Number(btn.dataset.index)]);$('suggestions').hidden=true;}));
    } else loadWeather(data.results[0]);
  }catch(err){setStatus('Could not search for that location. Try again.',true)}
}

async function loadWeather(place){
  currentPlace=place; $('suggestions').hidden=true; setStatus('Loading live weather…');
  const params=new URLSearchParams({
    latitude:place.latitude,longitude:place.longitude,timezone:'auto',forecast_days:'7',
    current:'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,visibility,uv_index',
    hourly:'temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
    daily:'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,precipitation_sum'
  });
  try{
    const res=await fetch(`${API}?${params}`); if(!res.ok) throw new Error('Weather API failed');
    const data=await res.json(); renderWeather(data); setStatus('Live data loaded.');
  }catch(err){setStatus('Weather data could not be loaded. Check your connection and try again.',true)}
}

function renderWeather(data){
  const c=data.current, [icon,label]=weatherMap[c.weather_code]||['🌡️','Weather'];
  $('dashboard').hidden=false;$('forecastSection').hidden=false;$('dailySection').hidden=false;$('insightsSection').hidden=false;
  $('placeName').textContent=`${currentPlace.name}${currentPlace.country ? ', '+currentPlace.country : ''}`;
  $('localTime').textContent=new Intl.DateTimeFormat(undefined,{dateStyle:'full',timeStyle:'short',timeZone:data.timezone}).format(new Date());
  $('weatherIcon').textContent=icon;$('currentTemp').textContent=temp(c.temperature_2m);$('weatherText').textContent=label;$('feelsLike').textContent=`Feels like ${temp(c.apparent_temperature)}`;
  $('humidity').textContent=`${c.relative_humidity_2m}%`;$('wind').textContent=wind(c.wind_speed_10m);$('visibility').textContent=distance(c.visibility);$('pressure').textContent=`${Math.round(c.surface_pressure)} hPa`;$('uv').textContent=c.uv_index ?? '—';$('cloud').textContent=`${c.cloud_cover}%`;
  $('sunrise').textContent=formatTime(data.daily.sunrise[0],data.timezone);$('sunset').textContent=formatTime(data.daily.sunset[0],data.timezone);updateSunProgress(data.daily.sunrise[0],data.daily.sunset[0]);updateFavoriteButton();renderHourly(data);renderDaily(data);renderInsights(data);renderFavorites();$('lastUpdated').textContent=`Updated ${formatTime(c.time,data.timezone)}`;
}

function formatTime(value,timeZone){return new Intl.DateTimeFormat(undefined,{hour:'numeric',minute:'2-digit',timeZone}).format(new Date(value))}
function formatDay(value,timeZone){return new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',timeZone}).format(new Date(value))}
function updateSunProgress(rise,set){const now=Date.now(),a=new Date(rise).getTime(),b=new Date(set).getTime();$('sunProgress').style.width=`${Math.max(0,Math.min(100,(now-a)/(b-a)*100))}%`}

function renderHourly(data){
  const nowIndex=Math.max(0,data.hourly.time.findIndex(t=>t>=data.current.time));
  $('hourlyForecast').innerHTML=data.hourly.time.slice(nowIndex,nowIndex+12).map((t,i)=>{const idx=nowIndex+i,[icon]=weatherMap[data.hourly.weather_code[idx]]||['🌡️'];return `<div class="hour"><small>${i===0?'Now':formatTime(t,data.timezone)}</small><div class="mini-icon">${icon}</div><strong>${temp(data.hourly.temperature_2m[idx])}</strong><small>${data.hourly.precipitation_probability[idx] ?? 0}% rain</small></div>`}).join('');
}
function renderDaily(data){
  $('dailyForecast').innerHTML=data.daily.time.map((t,i)=>{const [icon]=weatherMap[data.daily.weather_code[i]]||['🌡️'];return `<div class="day"><small>${i===0?'Today':formatDay(t,data.timezone)}</small><div class="mini-icon">${icon}</div><div class="range">${temp(data.daily.temperature_2m_max[i])} / ${temp(data.daily.temperature_2m_min[i])}</div><div class="rain">💧 ${data.daily.precipitation_probability_max[i] ?? 0}%</div></div>`}).join('');
}
function renderInsights(data){
  const d=data.daily,c=data.current, max=Math.max(...d.temperature_2m_max),rain=Math.max(...d.precipitation_probability_max),uv=Math.max(...d.uv_index_max);
  const tips=[];
  tips.push({title:'🌡️ Temperature',text:`The warmest day in the 7-day outlook reaches ${temp(max)}.`});
  tips.push({title:'🌧️ Rain watch',text:rain>=60?`Rain probability peaks at ${rain}%. Consider carrying an umbrella.`:`Rain probability stays relatively low, peaking at ${rain}%.`});
  tips.push({title:'🧴 UV awareness',text:uv>=6?`UV peaks around ${uv}. Plan shade and sun protection outdoors.`:`UV peaks around ${uv}, generally lower than high-risk levels.`});
  tips.push({title:'💨 Wind',text:`Current wind is ${wind(c.wind_speed_10m)}.`});
  tips.push({title:'☁️ Sky',text:`Cloud cover is ${c.cloud_cover}% right now.`});
  tips.push({title:'💧 Humidity',text:`Relative humidity is ${c.relative_humidity_2m}%.`});
  $('insights').innerHTML=tips.map(x=>`<div class="insight"><strong>${x.title}</strong><span class="muted">${escapeHtml(x.text)}</span></div>`).join('');
}

$('searchForm').addEventListener('submit',e=>{e.preventDefault();searchPlaces($('cityInput').value)});
$('cityInput').addEventListener('input',()=>{clearTimeout(debounceTimer);const q=$('cityInput').value;debounceTimer=setTimeout(()=>q.trim().length>=2&&searchPlaces(q,true),350)});
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('suggestions').hidden=true});
$('locationBtn').addEventListener('click',()=>{if(!navigator.geolocation){setStatus('Geolocation is not supported by this browser.',true);return}setStatus('Requesting your location…');navigator.geolocation.getCurrentPosition(pos=>searchPlaces(`${pos.coords.latitude},${pos.coords.longitude}`),()=>setStatus('Location access was unavailable. Search for a city instead.',true),{enableHighAccuracy:true,timeout:10000});});
$('favoriteBtn').addEventListener('click',()=>{if(!currentPlace)return;const list=getFavorites();const i=list.findIndex(p=>p.latitude===currentPlace.latitude&&p.longitude===currentPlace.longitude);if(i>=0)list.splice(i,1);else list.unshift({name:currentPlace.name,country:currentPlace.country,latitude:currentPlace.latitude,longitude:currentPlace.longitude});saveFavorites(list);updateFavoriteButton()});
$('unitToggle').addEventListener('click',()=>{unit=unit==='C'?'F':'C';localStorage.setItem('skycast-unit',unit);$('unitToggle').textContent=`°${unit}`;if(currentPlace)loadWeather(currentPlace)});
$('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('skycast-theme',document.body.classList.contains('light')?'light':'dark');$('themeToggle').textContent=document.body.classList.contains('light')?'☀':'☾'});
if(localStorage.getItem('skycast-theme')==='light'){document.body.classList.add('light');$('themeToggle').textContent='☀'}$('unitToggle').textContent=`°${unit}`;renderFavorites();

// Demo-first startup: use a neutral default city only when the user has not searched yet.
loadWeather({name:'New Delhi',country:'India',latitude:28.6139,longitude:77.2090});
