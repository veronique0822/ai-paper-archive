var D=window.ARCHIVE_DATA, ITEMS=D.items, ISSUES=D.issues;
var KINDS=["全部","论文","资讯","科普"], KCLS={"论文":"k-paper","资讯":"k-news","科普":"k-learn"};
var dayIssues=ISSUES.filter(function(i){return i.type==="day"}).sort(function(a,b){return b.date.localeCompare(a.date)});
var weekIssues=ISSUES.filter(function(i){return i.type==="week"}).sort(function(a,b){return b.date.localeCompare(a.date)});
var view="items", curDay=dayIssues.length?dayIssues[0].date:null, curWeek=weekIssues.length?weekIssues[0].date:null;
var f={kind:"全部",df:{},comp:{},tag:{}};
function has(s,v){return s.hasOwnProperty(v)}
function tog(o,v){if(has(o,v))delete o[v];else o[v]=1}
function uniq(k){var s={};ITEMS.forEach(function(e){var v=e[k];(Array.isArray(v)?v:[v]).forEach(function(x){s[x]=1})});return Object.keys(s)}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")}
function paper(e){var h='<div class="paper"><span class="kpill '+KCLS[e.kind]+'">'+e.kind+'</span>';
  h+=e.url==="#"?'<span class="ptitle">'+esc(e.title)+'</span>':'<a class="ptitle" href="'+e.url+'" target="_blank">'+esc(e.title)+'</a>';
  h+='<div class="meta">'+e.date+" ｜ "+(e.companies.length?e.companies.join(" · "):"—")+" ｜ 难度 "+e.difficulty+"</div>";
  h+="<p>"+esc(e.summary)+"</p>";
  h+='<div class="reason"><b>为什么值得看</b> ｜ '+esc(e.reason)+"</div>";
  h+='<div class="chips">'+e.tags.map(function(t){return '<span class="chip cg">'+esc(t)+"</span>"}).join("");
  h+=e.companies.map(function(c){return '<span class="chip c1">'+esc(c)+"</span>"}).join("")+"</div>";
  if(e.learn)h+='<div class="back">🐾 完整漫画版：<a href="'+e.learn+'">'+e.learn+"</a></div>";
  else if(e.weekly)h+='<div class="back">入选 <a href="weeks/'+e.weekly+'/">'+e.weekly+" 周报</a></div>";
  return h+"</div>"}
function renderNav(){document.getElementById("nav").innerHTML=[["items","条目",ITEMS.length],["days","日报",dayIssues.length],["weeks","周报",weekIssues.length]].map(function(a){
  return '<button class="nbtn '+(view===a[0]?"on":"")+'" onclick="view=\''+a[0]+'\';render()">'+a[1]+'<span class="n">'+a[2]+"</span></button>"}).join("")}
function renderSide(){var s="";
  if(view==="items"){
    s+='<div class="g"><div class="gt">类型</div>'+KINDS.map(function(v){return '<button class="mbtn '+(f.kind===v?"on":"")+'" onclick="f.kind=\''+v+'\';render()">'+v+"</button>"}).join("")+"</div>";
    s+='<div class="g"><div class="gt">难度</div>'+uniq("difficulty").map(function(v){return '<button class="mbtn '+(has(f.df,v)?"on":"")+'" onclick="tog(f.df,\''+v+'\');render()">'+v+"</button>"}).join("")+"</div>";
    s+='<div class="g"><div class="gt">公司</div>'+uniq("companies").map(function(v){return '<button class="cbtn '+(has(f.comp,v)?"on":"")+'" onclick="tog(f.comp,\''+v+'\');render()">'+v+"</button>"}).join("")+"</div>";
    s+='<div class="g"><div class="gt">方向</div>'+uniq("tags").map(function(v){return '<button class="cbtn '+(has(f.tag,v)?"on":"")+'" onclick="tog(f.tag,\''+v+'\');render()">'+v+"</button>"}).join("")+"</div>";
  }
  if(view==="days"){
    s+='<div class="g"><div class="gt">期次</div>'+(dayIssues.length?dayIssues.map(function(i){
      return '<button class="mbtn '+(curDay===i.date?"on":"")+'" onclick="curDay=\''+i.date+'\';render()">'+i.date+'<span class="n">'+i.count+" 条</span></button>"}).join(""):'<div style="font-size:12.5px;color:#999">尚无日报</div>')+"</div>";
  }
  if(view==="weeks"){
    s+='<div class="g"><div class="gt">期次</div>'+(weekIssues.length?weekIssues.map(function(i){
      return '<button class="mbtn '+(curWeek===i.date?"on":"")+'" onclick="curWeek=\''+i.date+'\';render()">'+i.date+'<span class="n">'+i.count+" 条</span></button>"}).join(""):'<div style="font-size:12.5px;color:#999;line-height:1.8">尚无周报<br>周一 09:00 首发</div>')+"</div>";
  }
  document.getElementById("side").innerHTML=s}
function render(){
  try{renderNav()}catch(e){}
  try{renderSide()}catch(e){}
  var el=document.getElementById("main");
  if(view==="items"){
    var rows=ITEMS.filter(function(e){return(f.kind==="全部"||e.kind===f.kind)
      &&(!Object.keys(f.df).length||has(f.df,e.difficulty))
      &&(!Object.keys(f.comp).length||e.companies.some(function(c){return has(f.comp,c)}))
      &&(!Object.keys(f.tag).length||e.tags.some(function(t){return has(f.tag,t)}))})
      .sort(function(a,b){return b.date.localeCompare(a.date)});
    el.innerHTML='<input class="inp" placeholder="搜索标题、摘要、入选理由…" oninput="q=this.value;renderMainItems()"/><div id="ilist" class="cards"></div>';
    window._rows=rows;renderMainItems();
  }else if(view==="days"){
    var iss=dayIssues.filter(function(i){return i.date===curDay})[0];
    if(!iss){el.innerHTML='<div class="empty">尚无日报，周一至周五 08:00 自动更新</div>';return}
    var rows=ITEMS.filter(function(e){return e.firstSeen===iss.date}).sort(function(a,b){return a.id.localeCompare(b.id)});
    el.innerHTML='<div class="reading"><div class="isshead"><div class="t">'+esc(iss.title)+'</div><div class="m">'+iss.date+" ｜ "+iss.count+' 条 ｜ <a href="'+iss.url+'">'+iss.url+" 独立页 ↗</a></div></div>"+rows.map(paper).join("")+"</div>";
  }else{
    var wk=weekIssues.filter(function(i){return i.date===curWeek})[0];
    if(!wk){el.innerHTML='<div class="empty">尚无周报，每周一 09:00 自动更新</div>';return}
    var rows=ITEMS.filter(function(e){return e.weekly===wk.date}).sort(function(a,b){return a.id.localeCompare(b.id)});
    var learns=rows.filter(function(e){return e.kind==="科普"});
    var h='<div class="reading"><div class="isshead"><div class="t">'+esc(wk.title)+'</div><div class="m">'+wk.date+" ｜ "+wk.count+' 条精选 ｜ <a href="'+wk.url+'">'+wk.url+" 独立页 ↗</a></div></div>";
    if(wk.theme)h+='<div class="theme">📌 本期主题：<b>'+esc(wk.theme)+"</b></div>";
    h+=rows.filter(function(e){return e.kind!=="科普"}).map(paper).join("");
    if(wk.learn)h+='<div class="theme learn">🐾 本期科普：<b>'+esc(wk.learn)+'</b>（完整漫画见 learn/ 页）</div>';
    else if(learns.length)h+='<div class="theme learn">🐾 本期科普：'+learns.map(function(e){return "<b>"+esc(e.title)+"</b>"}).join("、")+"（完整漫画见 learn/ 页）</div>";
    el.innerHTML=h+"</div>";
  }
}
function renderMainItems(){
  var q=(window.q||"").trim().toLowerCase();
  var rows=window._rows.filter(function(e){return!q||(e.title+e.summary+e.reason).toLowerCase().indexOf(q)>=0});
  document.getElementById("ilist").innerHTML=rows.length?rows.map(paper).join(""):'<div class="empty">没有匹配的条目，试试放宽筛选</div>'}
render();
