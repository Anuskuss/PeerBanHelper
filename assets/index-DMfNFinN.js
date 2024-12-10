const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./dummyChart-DF8PmBpY.js","./echarts-GF9kIjXZ.js","./libs-AHWYfG3N.js","./index-4-creqW-.js","./arcoDesign-Bjphlx8G.js","./index-B75Oi1W2.css"])))=>i.map(i=>d[i]);
import{u as z,a as H,g as Q,k as X,m as he,_ as ye,f as ce,n as be}from"./index-4-creqW-.js";import{a as w,B as $,am as F,L as re,O as ue,F as me,G as J,aw as ne,v as ge,T as _e,S as le,H as K,a9 as Y,C as M,ax as ve,c as ke,E as we,Q as De,R as xe,U as Se,av as Ve,ay as Ce,V as Oe}from"./arcoDesign-Bjphlx8G.js";import{u as Z,E as ee,i as te,a as de,b as fe,c as ae,d as ie,e as pe,f as Te}from"./echarts-GF9kIjXZ.js";import{f as I,a6 as E,r as P,a as oe,c as C,w as N,a8 as q,j as f,s as h,t,y as r,a2 as e,v as m,x as g,u as j,l as Pe,a9 as Ae,k as Ue,P as Le,F as Re}from"./libs-AHWYfG3N.js";import{I as Ie}from"./index-DgQ00YEp.js";import{u as Ee}from"./userStore-DCUvpvx2.js";async function $e(b,a=!1,s){const o=z();await o.serverAvailable;const n=new URLSearchParams({type:"count",field:b,filter:a?"0.01":"0"});s&&n.append("downloader",s);const _=new URL(H(o.endpoint,"api/statistic/analysis/field?"+n.toString()),location.href);return fetch(_,{headers:Q()}).then(c=>(o.assertResponseLogin(c),c.json()))}async function Be(b,a,s,o){const n=z();await n.serverAvailable;const _=new URL(H(n.endpoint,"api/chart/geoIpInfo"),location.href),c=b.getTime(),u=a.getTime();return _.searchParams.append("startAt",c.toString()),_.searchParams.append("endAt",u.toString()),_.searchParams.append("bannedOnly",String(s)),o&&_.searchParams.append("downloader",o),fetch(_,{headers:Q()}).then(v=>(n.assertResponseLogin(v),v.json()))}async function je(b,a,s){const o=z();await o.serverAvailable;const n=new URLSearchParams({startAt:b.getTime().toString(),endAt:a.getTime().toString()});s&&n.append("downloader",s);const _=new URL(H(o.endpoint,"api/statistic/analysis/banTrends?"+n.toString()),location.href);return fetch(_,{headers:Q()}).then(c=>(o.assertResponseLogin(c),c.json()))}async function ze(b,a,s){const o=z();await o.serverAvailable;const n=new URLSearchParams({startAt:b.getTime().toString(),endAt:a.getTime().toString()});s&&n.append("downloader",s);const _=new URL(H(o.endpoint,"api/chart/trend?"+n.toString()),location.href);return fetch(_,{headers:Q()}).then(c=>(o.assertResponseLogin(c),c.json()))}async function Fe(b,a,s){const o=z();await o.serverAvailable;const n=new URLSearchParams({startAt:b.getTime().toString(),endAt:a.getTime().toString()});s&&n.append("downloader",s);const _=new URL(H(o.endpoint,"api/chart/traffic?"+n.toString()),location.href);return fetch(_,{headers:Q()}).then(c=>(o.assertResponseLogin(c),c.json()))}const Me=I({__name:"ispPie",props:{downloader:{}},setup(b){const{t:a}=E();Z([te,de,fe,ae]);const s=X(),o=P(),n=oe({field:"isp",enableThreshold:!0,bannedOnly:!0,range:[w().startOf("day").add(-14,"day").toDate(),new Date]}),_=C(()=>({text:a("page.charts.loading"),color:s.isDark?"rgb(60, 126, 255)":"rgb(22, 93, 255)",textColor:s.isDark?"rgba(255, 255, 255, 0.9)":"rgb(29, 33, 41)",maskColor:s.isDark?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.4)"})),c=C(()=>u.value),u=P({tooltip:{trigger:"item",appendToBody:!0,formatter:'<p style="word-wrap:break-all"><b>{b}</b></p>  {c} ({d}%)',backgroundColor:s.isDark?"#333335":"",borderColor:s.isDark?"#333335":"",textStyle:{color:s.isDark?"rgba(255, 255, 255, 0.7)":""}},legend:{orient:"vertical",left:"right",type:"scroll",right:10,top:20,bottom:20,data:[],textStyle:{overflow:"truncate",width:100},tooltip:{show:!0}},backgroundColor:s.isDark?"rgba(0, 0, 0, 0.0)":void 0,series:[{name:"",type:"pie",radius:"55%",center:["50%","60%"],data:[],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]});N(n,p=>{D(p.range[0],p.range[1],n.bannedOnly,v.downloader)});const v=b,{loading:x,run:D,refresh:V}=q(Be,{defaultParams:[w().startOf("day").add(-7,"day").toDate(),new Date,n.bannedOnly,v.downloader],onSuccess:p=>{if(p.data){const l=p.data[n.field];let d;if(n.enableThreshold){const k=l.reduce((y,T)=>y+T.value,0)*.01;d=l.filter(y=>y.value>=k)}else d=l;u.value.legend.data=d.map(i=>i.key),u.value.series[0].data=d.map(i=>({name:i.key==="N/A"&&n.field==="province"?a("page.charts.data.province.na"):i.key,value:i.value})),u.value.series[0].name=a("page.charts.options.field."+n.field)}},onError:p=>{o.value=p}});return(p,l)=>{const d=$,i=F,k=re,y=ue,T=me,S=J,A=ne,U=ge,L=_e,B=le,W=K,G=Y,R=M;return f(),h(R,{hoverable:"",title:e(a)("page.charts.title.geoip")+(n.bannedOnly?e(a)("page.charts.subtitle.bannedOnly"):"")},{extra:t(()=>[r(G,null,{content:t(()=>[r(W,{model:n},{default:t(()=>[r(S,{field:"field",label:e(a)("page.charts.options.field")},{default:t(()=>[r(T,{modelValue:n.field,"onUpdate:modelValue":l[1]||(l[1]=O=>n.field=O),"trigger-props":{autoFitPopupMinWidth:!0}},{default:t(()=>[r(y,{value:"isp"},{default:t(()=>[m(g(e(a)("page.charts.options.field.isp")),1)]),_:1}),r(y,{value:"province"},{default:t(()=>[m(g(e(a)("page.charts.options.field.province")),1)]),_:1}),r(y,{value:"city"},{default:t(()=>[m(g(e(a)("page.charts.options.field.city")),1)]),_:1}),r(y,{value:"region"},{default:t(()=>[m(g(e(a)("page.charts.options.field.region")),1)]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["label"]),r(S,{field:"range",label:e(a)("page.charts.options.days")},{default:t(()=>[r(A,{modelValue:n.range,"onUpdate:modelValue":l[2]||(l[2]=O=>n.range=O),"show-time":"","value-format":"Date",shortcuts:[{label:e(a)("page.charts.options.shortcut.7days"),value:()=>[e(w)().startOf("day").add(-7,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.14days"),value:()=>[e(w)().startOf("day").add(-14,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.30days"),value:()=>[e(w)().startOf("day").add(-30,"day").toDate(),new Date]}]},null,8,["modelValue","shortcuts"])]),_:1},8,["label"]),r(S,{field:"enableThreshold"},{default:t(()=>[r(B,null,{default:t(()=>[r(U,{modelValue:n.enableThreshold,"onUpdate:modelValue":l[3]||(l[3]=O=>n.enableThreshold=O)},null,8,["modelValue"]),r(L,null,{default:t(()=>[m(g(e(a)("page.charts.options.thresold")),1)]),_:1})]),_:1})]),_:1}),r(S,{field:"bannedOnly"},{default:t(()=>[r(B,null,{default:t(()=>[r(U,{modelValue:n.bannedOnly,"onUpdate:modelValue":l[4]||(l[4]=O=>n.bannedOnly=O)},null,8,["modelValue"]),r(L,null,{default:t(()=>[m(g(e(a)("page.charts.options.bannedOnly")),1)]),_:1})]),_:1})]),_:1})]),_:1},8,["model"])]),default:t(()=>[r(k,null,{default:t(()=>[m(g(e(a)("page.charts.options.more")),1)]),_:1})]),_:1})]),default:t(()=>[o.value?(f(),h(i,{key:0,status:"500",title:e(a)("page.charts.error.title"),class:"chart chart-error"},{subtitle:t(()=>[m(g(o.value.message),1)]),extra:t(()=>[r(d,{type:"primary",onClick:l[0]||(l[0]=()=>{o.value=void 0,e(V)()})},{default:t(()=>[m(g(e(a)("page.charts.error.refresh")),1)]),_:1})]),_:1},8,["title"])):(f(),h(e(ee),{key:1,class:"chart",option:c.value,loading:e(x),autoresize:"","loading-options":_.value,theme:e(s).isDark?"dark":"light","init-options":{renderer:"svg"}},null,8,["option","loading","loading-options","theme"]))]),_:1},8,["title"])}}}),Ne=I({__name:"banTrends",props:{downloader:{}},setup(b){const{t:a}=E(),s=C(()=>({text:a("page.charts.loading"),color:o.isDark?"rgb(60, 126, 255)":"rgb(22, 93, 255)",textColor:o.isDark?"rgba(255, 255, 255, 0.9)":"rgb(29, 33, 41)",maskColor:o.isDark?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.4)"})),o=X(),n=P();Z([te,ie,pe,ae]);const _=b,c=oe({range:[w().startOf("day").add(-7,"day").toDate(),new Date]}),u=C(()=>v.value),v=P({xAxis:{type:"time",max:"dataMax"},yAxis:{type:"value"},tooltip:{trigger:"axis",backgroundColor:o.isDark?"#333335":"",borderColor:o.isDark?"#333335":"",textStyle:{color:o.isDark?"rgba(255, 255, 255, 0.7)":""}},grid:{left:"15%"},series:[{data:[],type:"line",name:a("page.charts.line.options.field")}],backgroundColor:o.isDark?"rgba(0, 0, 0, 0.0)":void 0});N(c,p=>{D(p.range[0],p.range[1],_.downloader)});const{loading:x,run:D,refresh:V}=q(je,{defaultParams:[w().startOf("day").add(-7,"day").toDate(),new Date,_.downloader],onSuccess:p=>{p.data&&(v.value.series[0].data=p.data.sort((l,d)=>l.key-d.key).map(l=>[new Date(l.key),l.value]))},onError:p=>{n.value=p}});return(p,l)=>{const d=re,i=ne,k=J,y=K,T=Y,S=$,A=F,U=M;return f(),h(U,{hoverable:"",title:e(a)("page.charts.title.line")},{extra:t(()=>[r(T,null,{content:t(()=>[r(y,{model:c},{default:t(()=>[r(k,{field:"range",label:e(a)("page.charts.options.days"),"label-col-flex":"100px"},{default:t(()=>[r(i,{modelValue:c.range,"onUpdate:modelValue":l[0]||(l[0]=L=>c.range=L),"show-time":"","value-format":"Date",shortcuts:[{label:e(a)("page.charts.options.shortcut.7days"),value:()=>[e(w)().startOf("day").add(-7,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.14days"),value:()=>[e(w)().startOf("day").add(-14,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.30days"),value:()=>[e(w)().startOf("day").add(-30,"day").toDate(),new Date]}]},null,8,["modelValue","shortcuts"])]),_:1},8,["label"])]),_:1},8,["model"])]),default:t(()=>[r(d,null,{default:t(()=>[m(g(e(a)("page.charts.options.more")),1)]),_:1})]),_:1})]),default:t(()=>[n.value?(f(),h(A,{key:0,status:"500",title:e(a)("page.charts.error.title"),class:"chart chart-error"},{subtitle:t(()=>[m(g(n.value.message),1)]),extra:t(()=>[r(S,{type:"primary",onClick:l[1]||(l[1]=()=>{n.value=void 0,e(V)()})},{default:t(()=>[m(g(e(a)("page.charts.error.refresh")),1)]),_:1})]),_:1},8,["title"])):(f(),h(e(ee),{key:1,class:"chart",option:u.value,loading:e(x),"loading-options":s.value,theme:e(o).isDark?"dark":"ovilia-green",autoresize:"","init-options":{renderer:"svg"}},null,8,["option","loading","loading-options","theme"]))]),_:1},8,["title"])}}}),qe=I({__name:"fieldPie",props:{downloader:{}},setup(b){const{t:a}=E();Z([te,de,fe,ae]);const s=X(),o=oe({field:"peerId",enableThreshold:!0,mergeSameVersion:!1}),n=C(()=>({text:a("page.charts.loading"),color:s.isDark?"rgb(60, 126, 255)":"rgb(22, 93, 255)",textColor:s.isDark?"rgba(255, 255, 255, 0.9)":"rgb(29, 33, 41)",maskColor:s.isDark?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.4)"})),_=P(),c=C(()=>u.value),u=P({tooltip:{trigger:"item",appendToBody:!0,formatter:'<p style="word-wrap:break-all"><b>{b}</b></p>  {c} ({d}%)',backgroundColor:s.isDark?"#333335":"",borderColor:s.isDark?"#333335":"",textStyle:{color:s.isDark?"rgba(255, 255, 255, 0.7)":""}},legend:{orient:"vertical",left:"right",type:"scroll",right:10,top:20,bottom:20,data:[],textStyle:{overflow:"truncate",width:100},tooltip:{show:!0}},backgroundColor:s.isDark?"rgba(0, 0, 0, 0.0)":void 0,series:[{name:a("page.charts.options.field."+o.field),type:"pie",radius:"55%",center:["50%","60%"],data:[],emphasis:{itemStyle:{shadowBlur:10,shadowOffsetX:0,shadowColor:"rgba(0, 0, 0, 0.5)"}}}]});N(o,p=>{D(p.field,p.enableThreshold,v.downloader)});const v=b,{loading:x,run:D,refresh:V}=q($e,{defaultParams:["peerId",!0,v.downloader],onSuccess:p=>{if(p.data){const l=p.data.map(d=>(d.data===""&&(d.data=a("page.charts.options.field.empty")),d));if(o.mergeSameVersion&&o.field==="peerId"){const d=new Map;l.forEach(i=>{let k=i.data;const y=k.match(/^([-]?[a-zA-z]+)[0-9]+.*/);y&&(y==null?void 0:y.length)>=2&&(k=y[1]+"*"),d.has(k)?d.set(k,d.get(k)+i.count):d.set(k,i.count)}),u.value.legend.data=[],u.value.series[0].data=[],Array.from(d).forEach(([i,k])=>{u.value.legend.data.push(i),u.value.series[0].data.push({name:i,value:k})})}else u.value.legend.data=l.map(d=>d.data),u.value.series[0].data=l.map(d=>({name:d.data,value:d.count}))}},onError:p=>{_.value=p}});return(p,l)=>{const d=$,i=F,k=re,y=ue,T=me,S=J,A=ge,U=_e,L=le,B=K,W=Y,G=M;return f(),h(G,{hoverable:"",title:e(a)("page.charts.options.field."+o.field)},{extra:t(()=>[r(W,null,{content:t(()=>[r(B,{model:o,style:{width:"25vh"}},{default:t(()=>[r(S,{field:"field",label:e(a)("page.charts.options.field")},{default:t(()=>[r(T,{modelValue:o.field,"onUpdate:modelValue":l[1]||(l[1]=R=>o.field=R),"trigger-props":{autoFitPopupMinWidth:!0}},{default:t(()=>[r(y,{value:"peerId"},{default:t(()=>[m(g(e(a)("page.charts.options.field.peerId")),1)]),_:1}),r(y,{value:"torrentName"},{default:t(()=>[m(g(e(a)("page.charts.options.field.torrentName")),1)]),_:1}),r(y,{value:"module"},{default:t(()=>[m(g(e(a)("page.charts.options.field.module")),1)]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["label"]),r(S,{field:"enableThreshold"},{default:t(()=>[r(L,null,{default:t(()=>[r(A,{modelValue:o.enableThreshold,"onUpdate:modelValue":l[2]||(l[2]=R=>o.enableThreshold=R)},null,8,["modelValue"]),r(U,null,{default:t(()=>[m(g(e(a)("page.charts.options.thresold")),1)]),_:1})]),_:1})]),_:1}),o.field==="peerId"?(f(),h(S,{key:0,field:"mergeSameVersion"},{default:t(()=>[r(L,null,{default:t(()=>[r(A,{modelValue:o.mergeSameVersion,"onUpdate:modelValue":l[3]||(l[3]=R=>o.mergeSameVersion=R)},null,8,["modelValue"]),r(U,null,{default:t(()=>[m(g(e(a)("page.charts.options.mergeSame")),1)]),_:1})]),_:1})]),_:1})):j("",!0)]),_:1},8,["model"])]),default:t(()=>[r(k,null,{default:t(()=>[m(g(e(a)("page.charts.options.more")),1)]),_:1})]),_:1})]),default:t(()=>[_.value?(f(),h(i,{key:0,status:"500",title:e(a)("page.charts.error.title"),class:"chart chart-error"},{subtitle:t(()=>[m(g(_.value.message),1)]),extra:t(()=>[r(d,{type:"primary",onClick:l[0]||(l[0]=()=>{_.value=void 0,e(V)()})},{default:t(()=>[m(g(e(a)("page.charts.error.refresh")),1)]),_:1})]),_:1},8,["title"])):(f(),h(e(ee),{key:1,class:"chart",option:c.value,loading:e(x),autoresize:"","loading-options":n.value,theme:e(s).isDark?"dark":"light","init-options":{renderer:"svg"}},null,8,["option","loading","loading-options","theme"]))]),_:1},8,["title"])}}}),We=I({__name:"plusWarpper",props:{title:{}},setup(b){const a=Ae(()=>he(()=>import("./dummyChart-DF8PmBpY.js"),__vite__mapDeps([0,1,2,3,4,5]),import.meta.url)),{t:s}=E(),o=z(),n=C(()=>o.plusStatus),_=()=>{o.emitter.emit("open-plus-modal")};return(c,u)=>{var p;const v=Ie,x=$,D=F,V=M;return(p=n.value)!=null&&p.activated?Pe(c.$slots,"default",{key:0},void 0,!0):(f(),h(V,{key:1,hoverable:"",title:c.title},{default:t(()=>[r(D,{class:"overlay",status:"warning",title:e(s)("page.charts.locked")},{icon:t(()=>[r(v)]),subtitle:t(()=>[m(g(e(s)("page.charts.locked.tips")),1)]),extra:t(()=>[r(x,{type:"primary",onClick:_},{default:t(()=>[m(g(e(s)("page.charts.locked.active")),1)]),_:1})]),_:1},8,["title"]),r(e(a))]),_:1},8,["title"]))}}}),se=ye(We,[["__scopeId","data-v-0b577f3a"]]),Ge=I({__name:"traffic",props:{downloader:{}},setup(b){Z([te,de,Te,pe,ie,ae]);const a=oe({range:[w().startOf("day").add(-14,"day").toDate(),new Date]}),s=X(),o=C(()=>({text:n("page.charts.loading"),color:s.isDark?"rgb(60, 126, 255)":"rgb(22, 93, 255)",textColor:s.isDark?"rgba(255, 255, 255, 0.9)":"rgb(29, 33, 41)",maskColor:s.isDark?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.4)"})),{t:n,d:_}=E(),c=P(),u=C(()=>v.value),v=P({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},backgroundColor:s.isDark?"#333335":"",borderColor:s.isDark?"#333335":"",textStyle:{color:s.isDark?"rgba(255, 255, 255, 0.7)":""},formatter:function(d){return _(d[0].data[0],"short")+":<br/>"+d.map(i=>`${i.marker} ${i.seriesName}: ${ce(i.data[1])}`).join("<br>")}},backgroundColor:s.isDark?"rgba(0, 0, 0, 0.0)":void 0,legend:{data:[n("page.charts.traffic.options.download"),n("page.charts.traffic.options.upload")]},xAxis:{type:"time",max:"dataMax",min:"dataMin",minInterval:3600*24*1e3},grid:{left:"15%"},yAxis:{type:"value",axisLabel:{formatter:d=>ce(d)}},series:[{name:n("page.charts.traffic.options.download"),type:"line",emphasis:{focus:"series"},data:[]},{name:n("page.charts.traffic.options.upload"),type:"line",emphasis:{focus:"series"},data:[]}]});N(a,d=>{V(d.range[0],d.range[1],x.downloader)});const x=b,{loading:D,run:V,refresh:p,data:l}=q(Fe,{defaultParams:[w().startOf("day").add(-7,"day").toDate(),new Date,x.downloader],onSuccess:d=>{d.data&&(v.value.series[0].data=d.data.map(i=>[new Date(i.timestamp),i.dataOverallDownloaded]),v.value.series[1].data=d.data.map(i=>[new Date(i.timestamp),i.dataOverallUploaded]))},onError:d=>{c.value=d}});return(d,i)=>{const k=re,y=ne,T=J,S=K,A=ve,U=ke,L=Y,B=$,W=F,G=we,R=M;return f(),h(R,{hoverable:"",title:e(n)("page.charts.title.traffic")},{extra:t(()=>[r(L,null,{content:t(()=>[r(S,{model:a},{default:t(()=>[r(T,{field:"range",label:e(n)("page.charts.options.days"),"label-col-flex":"100px"},{default:t(()=>[r(y,{modelValue:a.range,"onUpdate:modelValue":i[0]||(i[0]=O=>a.range=O),"show-time":"","value-format":"Date",shortcuts:[{label:e(n)("page.charts.options.shortcut.7days"),value:()=>[e(w)().startOf("day").add(-7,"day").toDate(),new Date]},{label:e(n)("page.charts.options.shortcut.14days"),value:()=>[e(w)().startOf("day").add(-14,"day").toDate(),new Date]},{label:e(n)("page.charts.options.shortcut.30days"),value:()=>[e(w)().startOf("day").add(-30,"day").toDate(),new Date]}]},null,8,["modelValue","shortcuts"])]),_:1},8,["label"])]),_:1},8,["model"])]),default:t(()=>[r(k,null,{default:t(()=>[m(g(e(n)("page.charts.options.more")),1)]),_:1}),r(U,{content:e(n)("page.charts.tooltip.traffic")},{default:t(()=>[r(A)]),_:1},8,["content"])]),_:1})]),default:t(()=>{var O;return[c.value?(f(),h(W,{key:0,status:"500",title:e(n)("page.charts.error.title"),class:"chart chart-error"},{subtitle:t(()=>[m(g(c.value.message),1)]),extra:t(()=>[r(B,{type:"primary",onClick:i[1]||(i[1]=()=>{c.value=void 0,e(p)()})},{default:t(()=>[m(g(e(n)("page.charts.error.refresh")),1)]),_:1})]),_:1},8,["title"])):!((O=e(l))!=null&&O.data)&&!e(D)?(f(),h(G,{key:1,class:"chart",style:{"align-items":"center",display:"flex","justify-content":"center","flex-direction":"column"}})):(f(),h(e(ee),{key:2,class:"chart",option:u.value,loading:e(D),"loading-options":o.value,theme:e(s).isDark?"dark":"ovilia-green",autoresize:"","init-options":{renderer:"svg"}},null,8,["option","loading","loading-options","theme"]))]}),_:1},8,["title"])}}}),He=I({__name:"trends",props:{downloader:{}},setup(b){Z([pe,te,ie,ae]);const{t:a}=E(),s=oe({range:[w().startOf("day").add(-14,"day").toDate(),new Date]}),o=P(),n=X(),_=C(()=>({text:a("page.charts.loading"),color:n.isDark?"rgb(60, 126, 255)":"rgb(22, 93, 255)",textColor:n.isDark?"rgba(255, 255, 255, 0.9)":"rgb(29, 33, 41)",maskColor:n.isDark?"rgba(0, 0, 0, 0.4)":"rgba(255, 255, 255, 0.4)"})),c=C(()=>u.value),u=P({xAxis:{type:"time",max:"dataMax"},yAxis:{type:"value"},tooltip:{trigger:"axis",backgroundColor:n.isDark?"#333335":"",borderColor:n.isDark?"#333335":"",textStyle:{color:n.isDark?"rgba(255, 255, 255, 0.7)":""}},backgroundColor:n.isDark?"rgba(0, 0, 0, 0.0)":void 0,series:[{data:[],type:"line",color:"#A5A051",areaStyle:{color:"#A5A051"},name:a("page.charts.trends.options.peers")},{data:[],type:"line",color:"#DB4D6D",areaStyle:{color:"#DB4D6D"},name:a("page.charts.trends.options.bans")}]});N(s,p=>{D(p.range[0],p.range[1],v.downloader)});const v=b,{loading:x,run:D,refresh:V}=q(ze,{defaultParams:[w().startOf("day").add(-7,"day").toDate(),new Date,v.downloader],onSuccess:p=>{p.data&&(u.value.series[0].data=p.data.connectedPeersTrend.sort((l,d)=>l.key-d.key).map(l=>[new Date(l.key),l.value]),u.value.series[1].data=p.data.bannedPeersTrend.sort((l,d)=>l.key-d.key).map(l=>[new Date(l.key),l.value]))},onError:p=>{o.value=p}});return(p,l)=>{const d=ne,i=J,k=K,y=$,T=F,S=M;return f(),h(S,{hoverable:"",title:e(a)("page.charts.title.trends")},{extra:t(()=>[r(k,{model:s,"auto-label-width":""},{default:t(()=>[r(i,{field:"range",label:e(a)("page.charts.options.days"),style:{"margin-bottom":"0"}},{default:t(()=>[r(d,{modelValue:s.range,"onUpdate:modelValue":l[0]||(l[0]=A=>s.range=A),"value-format":"Date",style:{width:"275px"},shortcuts:[{label:e(a)("page.charts.options.shortcut.7days"),value:()=>[e(w)().startOf("day").add(-7,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.14days"),value:()=>[e(w)().startOf("day").add(-14,"day").toDate(),new Date]},{label:e(a)("page.charts.options.shortcut.30days"),value:()=>[e(w)().startOf("day").add(-30,"day").toDate(),new Date]}]},null,8,["modelValue","shortcuts"])]),_:1},8,["label"])]),_:1},8,["model"])]),default:t(()=>[o.value?(f(),h(T,{key:0,status:"500",title:e(a)("page.charts.error.title"),class:"chart chart-error"},{subtitle:t(()=>[m(g(o.value.message),1)]),extra:t(()=>[r(y,{type:"primary",onClick:l[1]||(l[1]=()=>{o.value=void 0,e(V)()})},{default:t(()=>[m(g(e(a)("page.charts.error.refresh")),1)]),_:1})]),_:1},8,["title"])):(f(),h(e(ee),{key:1,class:"chart",option:c.value,loading:e(x),"loading-options":_.value,theme:e(n).isDark?"dark":"ovilia-green",autoresize:"","init-options":{renderer:"svg"}},null,8,["option","loading","loading-options","theme"]))]),_:1},8,["title"])}}}),Qe=I({__name:"grid",props:{downloader:{},showCharts:{}},setup(b){const{t:a}=E(),s=b,o=C(()=>s.downloader==="all"?void 0:s.downloader);return(n,_)=>{const c=De,u=xe;return f(),h(u,{justify:"center",align:"stretch",wrap:!0,gutter:[{xs:12,sm:12,md:12,lg:12,xl:24},{xs:12,sm:12,md:12,lg:12,xl:24}]},{default:t(()=>[n.showCharts.banTrends?(f(),h(c,{key:0,xl:12,lg:24,md:24,sm:24,xs:24},{default:t(()=>[r(Ne,{downloader:o.value},null,8,["downloader"])]),_:1})):j("",!0),n.showCharts.fieldPie?(f(),h(c,{key:1,xl:12,lg:24,md:24,sm:24,xs:24},{default:t(()=>[r(qe,{downloader:o.value},null,8,["downloader"])]),_:1})):j("",!0),n.showCharts.ispPie?(f(),h(c,{key:2,xl:12,lg:24,md:24,sm:24,xs:24},{default:t(()=>[r(se,{title:e(a)("page.charts.title.geoip")},{default:t(()=>[r(Me,{downloader:o.value},null,8,["downloader"])]),_:1},8,["title"])]),_:1})):j("",!0),n.showCharts.traffic?(f(),h(c,{key:3,xl:12,lg:24,md:24,sm:24,xs:24},{default:t(()=>[r(se,{title:e(a)("page.charts.title.traffic")},{default:t(()=>[r(Ge,{downloader:o.value},null,8,["downloader"])]),_:1},8,["title"])]),_:1})):j("",!0),n.showCharts.trends?(f(),h(c,{key:4,xl:24,lg:24,md:24,sm:24,xs:24},{default:t(()=>[r(se,{title:e(a)("page.charts.title.trends")},{default:t(()=>[r(He,{downloader:o.value},null,8,["downloader"])]),_:1},8,["title"])]),_:1})):j("",!0)]),_:1})}}}),tt=I({__name:"index",setup(b){const{t:a}=E(),s=Ee(),o=P(s.showCharts),{data:n}=q(be);N(o,()=>{s.setShowCharts(o.value)});const _=C(()=>{var c;return[{name:"all",title:a("page.charts.all")},...((c=n.value)==null?void 0:c.data.map(u=>({name:u.name,title:u.name})))??[]]});return(c,u)=>{const v=Ve,x=$,D=Ce,V=le,p=Y,l=Oe,d=Se;return f(),h(d,{"default-active-key":0,"lazy-load":"",animation:"",type:"rounded"},{extra:t(()=>[r(p,{position:"bottom"},{content:t(()=>[r(V,{direction:"vertical"},{default:t(()=>[r(D,{modelValue:o.value.banTrends,"onUpdate:modelValue":u[0]||(u[0]=i=>o.value.banTrends=i)},{default:t(()=>[m(g(e(a)("page.charts.title.line")),1)]),_:1},8,["modelValue"]),r(D,{modelValue:o.value.fieldPie,"onUpdate:modelValue":u[1]||(u[1]=i=>o.value.fieldPie=i)},{default:t(()=>[m(g(e(a)("page.charts.title.fieldPie")),1)]),_:1},8,["modelValue"]),r(D,{modelValue:o.value.ispPie,"onUpdate:modelValue":u[2]||(u[2]=i=>o.value.ispPie=i)},{default:t(()=>[m(g(e(a)("page.charts.title.geoip")),1)]),_:1},8,["modelValue"]),r(D,{modelValue:o.value.traffic,"onUpdate:modelValue":u[3]||(u[3]=i=>o.value.traffic=i)},{default:t(()=>[m(g(e(a)("page.charts.title.traffic")),1)]),_:1},8,["modelValue"]),r(D,{modelValue:o.value.trends,"onUpdate:modelValue":u[4]||(u[4]=i=>o.value.trends=i)},{default:t(()=>[m(g(e(a)("page.charts.title.trends")),1)]),_:1},8,["modelValue"])]),_:1})]),default:t(()=>[r(x,null,{icon:t(()=>[r(v)]),default:t(()=>[m(g(e(a)("page.charts.options")),1)]),_:1})]),_:1})]),default:t(()=>[(f(!0),Ue(Re,null,Le(_.value,(i,k)=>(f(),h(l,{key:k,title:i.title},{default:t(()=>[r(Qe,{downloader:i.name,"show-charts":o.value},null,8,["downloader","show-charts"])]),_:2},1032,["title"]))),128))]),_:1})}}});export{tt as default};
