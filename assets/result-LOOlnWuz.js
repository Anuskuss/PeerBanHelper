import{u as B,_ as S}from"./index-4-creqW-.js";import{I as h}from"./init-C68ZX85w.js";import{f as C,a6 as V,al as w,r as p,j as l,s as d,a2 as o,k as I,t as e,v as r,x as u,y as c}from"./libs-AHWYfG3N.js";import{m as M,B as E,S as N,am as T}from"./arcoDesign-Bjphlx8G.js";const j={key:1},q=C({__name:"result",props:{modelValue:{required:!0},modelModifiers:{}},emits:["update:modelValue"],setup(y){const{t}=V(),a=w(y,"modelValue"),n=p(!0),m=p(!1),i=p(""),{setAuthToken:b}=B(),_=()=>{n.value=!0,h({token:a.value.token,downloader:{name:a.value.downloaderConfig.name,config:a.value.downloaderConfig.config}}).then(s=>{s.success?(m.value=!0,b(a.value.token)):i.value=s.message,n.value=!1}).catch(s=>{i.value=s.message,n.value=!1})};return _(),(s,f)=>{const x=M,g=E,v=N,k=T;return n.value?(l(),d(x,{key:0,class:"center",tip:o(t)("page.oobe.result.initlizing")},null,8,["tip"])):(l(),I("div",j,[m.value?(l(),d(k,{key:0,status:"success",title:o(t)("page.oobe.result.title"),class:"center"},{subtitle:e(()=>[r(u(o(t)("page.oobe.result.description")),1)]),extra:e(()=>[c(v,null,{default:e(()=>[c(g,{type:"primary",href:"/"},{default:e(()=>[r(u(o(t)("page.oobe.result.goto")),1)]),_:1})]),_:1})]),_:1},8,["title"])):(l(),d(k,{key:1,status:"error",title:o(t)("page.oobe.result.title.error"),class:"center"},{subtitle:e(()=>[r(u(i.value),1)]),extra:e(()=>[c(v,null,{default:e(()=>[c(g,{type:"primary",onClick:f[0]||(f[0]=z=>_())},{default:e(()=>[r(u(o(t)("page.oobe.result.retry")),1)]),_:1})]),_:1})]),_:1},8,["title"]))]))}}}),R=S(q,[["__scopeId","data-v-89c3ce99"]]);export{R as default};
