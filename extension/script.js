// ---------- ساعت و تاریخ ----------
function updateTime() {
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");
  const dayEl = document.getElementById("day");

  const now = new Date();
  const hours = now.getHours().toString().padStart(2,'0');
  const minutes = now.getMinutes().toString().padStart(2,'0');
  timeEl.textContent = `${hours}:${minutes}`;

  dateEl.textContent = now.toLocaleDateString('fa-IR');
  dayEl.textContent = now.toLocaleDateString('fa-IR', { weekday: 'long' });
}

setInterval(updateTime, 1000);
updateTime();

// ---------- سرچ بار ----------
const select = document.getElementById("searchEngine");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("searchBtn");

const searchUrls = {
  google: "https://www.google.com/search?q=",
  bing: "https://www.bing.com/search?q=",
  yahoo: "https://search.yahoo.com/search?p=",
  duckduckgo: "https://duckduckgo.com/?q="
};

/*function isValidUrl(string) {
  try { new URL(string); return true; } catch (_) { return false; }
}*/

function search() {
  const query = searchInput.value.trim();
  const engine = select.value;
  if (!query || !engine) { alert("لطفاً موتور جستجو و عبارت را وارد کنید!"); return; }

  /*let urlToCheck = query.startsWith("http") ? query : "http://" + query;
  if (isValidUrl(urlToCheck)) { window.location.href = urlToCheck; return; }*/

  window.location.href = searchUrls[engine] + encodeURIComponent(query);
}

searchBtn.addEventListener("click", search);
searchInput.addEventListener("keypress", function(e){ if(e.key === "Enter") search(); });

// ---------- تغییر پس زمینه ----------
const bgInput = document.getElementById("bgFile");
const colorPicker = document.getElementById("colorPicker");

bgInput.addEventListener("change", function() {
  const file = this.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    document.body.style.backgroundImage = `url(${e.target.result})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    localStorage.setItem("bgImage", e.target.result);
    localStorage.removeItem("bgColor");
  }
  reader.readAsDataURL(file);
});

colorPicker.addEventListener("change", function(){
  const color = this.value;
  document.body.style.background = color;
  document.body.style.backgroundImage = "";
  localStorage.setItem("bgColor", color);
  localStorage.removeItem("bgImage");
});

// بارگذاری پس زمینه ذخیره شده
window.addEventListener("load", function(){
  const bgData = localStorage.getItem("bgImage");
  const bgColor = localStorage.getItem("bgColor");
  if(bgData){
    document.body.style.backgroundImage = `url(${bgData})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else if(bgColor){
    document.body.style.background = bgColor;
  }
});

// ---------- میانبرها ----------
const addBtn = document.getElementById("addBtn");
const siteNameInput = document.getElementById("siteName");
const siteUrlInput = document.getElementById("siteUrl");
const shortcutsContainer = document.querySelector(".shortcuts");

let savedShortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");

function renderShortcuts(){
  shortcutsContainer.innerHTML = "";
  savedShortcuts.forEach(site=>{
    const a = document.createElement("a");
    a.href = site.url;
    a.target="_blank";
    a.className="shortcut";

    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}`;
    img.alt = site.name;

    const text = document.createTextNode(site.name);

    a.appendChild(img);
    a.appendChild(text);
    shortcutsContainer.appendChild(a);
  });
}

renderShortcuts();

addBtn.addEventListener("click", ()=>{
  const name = siteNameInput.value.trim();
  let url = siteUrlInput.value.trim();

  if(!name || !url){
    alert("نام و آدرس سایت را وارد کنید!");
    return;
  }

  if(!/^https?:\/\//i.test(url)){
    url = "https://" + url;
  }

  savedShortcuts.push({name,url});
  localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
  renderShortcuts();

  siteNameInput.value="";
  siteUrlInput.value="";
});
function setBackgroundWithGradient(color){
  // تولید رنگ دوم کمی روشن‌تر یا تیره‌تر برای گرادینت
  function lightenColor(col, amt) {
    let usePound = false;
    if (col[0] == "#") { col = col.slice(1); usePound = true; }
    let num = parseInt(col,16);
    let r = (num >> 16) + amt;
    let g = ((num >> 8) & 0x00FF) + amt;
    let b = (num & 0x0000FF) + amt;

    r = Math.min(255, Math.max(0,r));
    g = Math.min(255, Math.max(0,g));
    b = Math.min(255, Math.max(0,b));

    return (usePound?"#":"") + ((1 << 24) + (r <<16) + (g <<8) + b).toString(16).slice(1);
  }

  const color2 = lightenColor(color, 30); // رنگ دوم روشن‌تر
  document.body.style.background = `linear-gradient(135deg, ${color}, ${color2})`;
}

// هنگام تغییر رنگ توسط Color Picker
colorPicker.addEventListener("change", function(){
  const color = this.value;
  setBackgroundWithGradient(color);
  localStorage.setItem("bgColor", color);
  localStorage.removeItem("bgImage");

  // آپدیت سبک میانبرها هم اگر بخوای
  updateShortcutStyle(color);
});

// بارگذاری رنگ ذخیره شده
window.addEventListener("load", function(){
  const bgData = localStorage.getItem("bgImage");
  const bgColor = localStorage.getItem("bgColor");
  if(bgData){
    document.body.style.backgroundImage = `url(${bgData})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
  } else if(bgColor){
    setBackgroundWithGradient(bgColor);
    updateShortcutStyle(bgColor);
  }
});
function renderShortcuts(){
  shortcutsContainer.innerHTML = "";
  savedShortcuts.forEach((site, index)=>{
    const a = document.createElement("a");
    a.href = site.url;
    a.target="_blank";
    a.className="shortcut";

    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?domain=${new URL(site.url).hostname}`;
    img.alt = site.name;

    const text = document.createTextNode(site.name);

    a.appendChild(img);
    a.appendChild(text);

    // دکمه حذف
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.style.marginTop = "5px";
    delBtn.style.padding = "2px 5px";
    delBtn.style.fontSize = "12px";
    delBtn.style.borderRadius = "5px";
    delBtn.style.border = "none";
    delBtn.style.cursor = "pointer";
    delBtn.addEventListener("click", (e)=>{
      e.preventDefault(); // جلوگیری از کلیک روی لینک
      savedShortcuts.splice(index,1); // حذف از آرایه
      localStorage.setItem("shortcuts", JSON.stringify(savedShortcuts));
      renderShortcuts(); // بروزرسانی UI
      // آپدیت سبک میانبرها اگر نیاز بود
      const bgColor = localStorage.getItem("bgColor");
      if(bgColor) updateShortcutStyle(bgColor);
    });

    a.appendChild(delBtn);
    shortcutsContainer.appendChild(a);
  });
}
