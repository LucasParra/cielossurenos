(this["webpackJsonp@coreui/coreui-free-react-admin-template"]=this["webpackJsonp@coreui/coreui-free-react-admin-template"]||[]).push([[16],{651:function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return a}));n(2);var c=n(646),r=n(649),o=n(17),s=function(e){var t=e.onPress,n=e.color,s=e.icon;return Object(o.jsx)("td",{className:"py-2",children:Object(o.jsx)(c.tb,{className:"align-items-center",children:Object(o.jsx)(c.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(o.jsx)(c.f,{color:n,onClick:t,children:Object(o.jsx)(r.a,{content:s,size:"xl"})})})})})},a=function(e){var t=e.children,n=e.value,c=e.onChange,r=e.disabled,s=e.accept;return Object(o.jsxs)("label",{htmlFor:"contained-button-file",className:"m-0 w-100",children:[Object(o.jsx)("input",{value:n,accept:s,disabled:r,style:{display:"none"},id:"contained-button-file",multiple:!0,type:"file",onChange:r?function(){}:c}),t]})}},658:function(e,t,n){"use strict";n.d(t,"c",(function(){return a})),n.d(t,"f",(function(){return i})),n.d(t,"l",(function(){return l})),n.d(t,"a",(function(){return d})),n.d(t,"i",(function(){return u})),n.d(t,"h",(function(){return b})),n.d(t,"d",(function(){return j})),n.d(t,"e",(function(){return h})),n.d(t,"m",(function(){return O})),n.d(t,"k",(function(){return f})),n.d(t,"j",(function(){return s})),n.d(t,"g",(function(){return x})),n.d(t,"b",(function(){return p}));var c=n(655),r=n.n(c),o=n(51).supabase,s=function(e){return o.from("ChargeType").select("*").limit(5*e+1).then((function(e){return e.data})).catch(console.error)},a=function(e){return o.from("Charge").insert(e).then((function(e){return e.data})).catch(console.error)},i=function(e){return o.from("Charge").delete().match({ID:e}).then((function(e){return e.data}))},l=function(e,t){return o.from("Charge").update(e).eq("ID",t).then((function(e){return e.data})).catch(console.error)},d=function(){return o.from("User").select("*").eq("RolID",2).then((function(e){e.data.map((function(e){return o.from("UserProduct").select("Product(*),ID,Price").eq("UserID",e.ID).then((function(t){var n=t.data;return 0===n.length?null:a({ChargeTypeID:7,CreatedAt:r()().toDate(),Charge:n.reduce((function(e,t){return e+t.Product.BasePrice}),0),ClientID:e.ID,State:!1,Remaining:0})}))}))})).catch(console.error)},u=function(e){return o.from("Charge").select("*,ChargeTypeID(*)").eq("ClientID",e).eq("State",!1).then((function(e){return e.data}))},b=function(e){return o.from("Charge").select("*,ChargeTypeID(*)").eq("ClientID",e).order("CreatedAt",{ascending:!0}).then((function(e){return e.data}))},j=function(e,t,n){return o.from("Charge").update({State:!0,UrlImage:t,DocumentID:n.id,UrlDocument:n.urlPublicView}).eq("ID",e).then((function(e){return e.data}))},h=function(e){return o.from("ChargeType").insert(e).then((function(e){return e.data})).catch(console.error)},f=function(){return o.from("ChargeType").select("*").then((function(e){return e.data})).catch(console.error)},O=function(e,t){return o.from("ChargeType").update(t).eq("ID",e)},x=function(e){return o.from("ChargeType").delete().match({ID:e}).then((function(e){return e.data}))},p=function(e){return o.from("Charge").select("*",{count:"exact"}).eq("ChargeTypeID",e).then((function(e){return e.count}))}},661:function(e,t,n){"use strict";var c=n(23),r=n(91),o=n(2),s=n(646),a=n(650),i=n(17);t.a=function(e){var t=e.setTechnicianID,n=e.TechnicianID,l=e.isAllData,d=Object(o.useState)([]),u=Object(r.a)(d,2),b=u[0],j=u[1],h=Object(o.useState)(!1),f=Object(r.a)(h,2),O=f[0],x=f[1],p=function(){x(!0),Object(a.g)().then((function(e){j(e.map((function(e){return Object(c.a)(Object(c.a)({},e),{},{nombre:e.Names,apellido:e.LastName})}))),x(!1)}))};return Object(o.useEffect)(p,[]),Object(i.jsx)(s.y,{items:b,fields:["nombre","apellido","opciones"],itemsPerPage:5,onPageChange:p,loading:O,pagination:!0,scopedSlots:{opciones:function(e){return Object(i.jsx)("td",{className:"py-2",children:Object(i.jsx)(s.tb,{className:"align-items-center",children:Object(i.jsx)(s.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(i.jsx)(s.Cb,{className:"mx-1",variant:"3d",color:"success",value:l?(null===n||void 0===n?void 0:n.ID)===e.ID:n===e.ID,checked:l?(null===n||void 0===n?void 0:n.ID)===e.ID:n===e.ID,onChange:function(){return t(l?e:e.ID)}})})},e.ID)})}}})}},668:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"b",(function(){return o}));var c=n(51).supabase,r=function(e){return c.from("Discount").insert(e).then((function(e){return e.data})).catch(console.error)},o=function(e,t){return c.from("Discount").update(e).eq("ID",t).then((function(e){return e.data})).catch(console.error)}},669:function(e,t,n){"use strict";var c=n(23),r=n(174),o=n(91),s=n(646),a=n(2),i=n(655),l=n.n(i),d=n(653),u=n.n(d),b=n(671),j=n(51),h=n(652),f=n(658),O=n(668),x=n(650),p=n(654),D=n(649),g=n(763),I=n(661),m=n(651),y=n(175),C=n(17);t.a=function(e){var t=e.tasks,n=e.taskEffect,i=Object(h.a)(["user"]).user,d=Object(y.b)(),T=Object(a.useState)(""),S=Object(o.a)(T,2),A=S[0],v=S[1],k=Object(a.useState)(""),N=Object(o.a)(k,2),w=N[0],E=N[1],P=Object(a.useState)(!1),_=Object(o.a)(P,2),R=_[0],q=_[1],z=Object(a.useState)(!1),U=Object(o.a)(z,2),W=U[0],B=U[1],M=Object(a.useState)(!1),L=Object(o.a)(M,2),Y=L[0],F=L[1],J=Object(a.useState)({}),G=Object(o.a)(J,2),H=G[0],V=G[1],Z=Object(a.useState)([]),K=Object(o.a)(Z,2),Q=K[0],X=K[1],$=Object(a.useState)(""),ee=Object(o.a)($,2),te=ee[0],ne=ee[1],ce=Object(a.useState)({}),re=Object(o.a)(ce,2),oe=re[0],se=re[1],ae=Object(a.useState)([]),ie=Object(o.a)(ae,2),le=ie[0],de=ie[1],ue=Object(a.useState)([]),be=Object(o.a)(ue,2),je=be[0],he=be[1],fe=function(e){switch(e){case 2:return"success";default:return"info"}},Oe=function(e){switch(e){case"Alta":return"#b50909";case"Media":return"#ffbe2e";default:return"#00bde3"}},xe=function(e){switch(e){case"Alta":return 0;case"Media":return 1;default:return 2}};return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)(s.tb,{children:Object.keys(t).sort((function(e,t){return xe(e)-xe(t)})).map((function(e){return Object(C.jsx)(s.u,{xs:"12",lg:"4",children:Object(C.jsxs)(s.j,{style:{borderRadius:20},children:[Object(C.jsx)(s.n,{style:{backgroundColor:Oe(e),fontWeight:"bold",color:"#fff",fontSize:16,textAlign:"center"},children:e}),Object(C.jsx)(s.k,{children:Object.keys(u.a.groupBy(t[e],"DeadLine")).map((function(c){return Object(C.jsxs)(C.Fragment,{children:[Object(C.jsx)(s.tb,{children:Object(C.jsx)("h6",{style:{fontSize:16,fontWeight:"bold",textAlign:"center",width:"100%"},children:l()(c).format("DD-MM-YYYY")})}),u.a.groupBy(t[e],"DeadLine")[c].map((function(t){var c,o,a,b,h;return Object(C.jsx)(C.Fragment,{children:Object(C.jsxs)(s.u,{xs:"12",lg:"12",style:{borderRadius:6,border:"3px solid ".concat(Oe(e)),padding:16,marginTop:12},children:[Object(C.jsxs)(s.tb,{children:[Object(C.jsxs)(s.u,{xs:"7",lg:"7",children:[Object(C.jsx)("h6",{style:{fontSize:16,fontWeight:"bold"},children:"".concat(t.ID,"-").concat(t.TypeID.Name)}),Object(C.jsx)(s.b,{color:fe(t.StateID),children:2===t.StateID?"Finalizada":"En Proceso..."})]}),Object(C.jsx)(s.u,{xs:"4",lg:"4",children:Object(C.jsxs)(s.ub,{name:"select-priority-".concat(t.ID),id:"select-priority-".concat(t.ID),size:"sm",style:{border:"3px solid ".concat(Oe(e))},value:t.Priority,onChange:function(e){var c,r,o=e.target.value;return c=t.ID,r=o,d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),void Object(p.k)({ID:c,Priority:r}).then((function(){n(),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Prioridad Cambiada Correctamente"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)}))},children:[Object(C.jsx)("option",{value:"Alta",children:"Alta"}),Object(C.jsx)("option",{value:"Media",children:"Media"}),Object(C.jsx)("option",{value:"Baja",children:"Baja"})]})})]}),Object(C.jsxs)(s.tb,{style:{marginTop:12},children:[Object(C.jsx)(s.u,{xs:"2",lg:"2",children:Object(C.jsx)(s.f,{color:"secondary",onClick:function(){return function(e){if(A===e)return ne(""),X([]),v("");Object(p.f)(e).then((function(t){X(t),v(A===e?"":e)}))}(t.ID)},children:Object(C.jsx)(D.a,{content:g.a.cilCommentBubble,size:"xl"})})}),Object(C.jsx)(s.u,{xs:"2",lg:"2",children:Object(C.jsx)(s.f,{color:"info",onClick:function(){return E(w===t.ID?"":t.ID)},children:Object(C.jsx)(D.a,{content:g.a.cilZoomIn,size:"xl"})})}),1!==(null===i||void 0===i?void 0:i.RolID.ID)&&1===(null===(c=t.AssignedID)||void 0===c?void 0:c.RolID)&&Object(C.jsx)(s.u,{xs:"2",lg:"2",children:Object(C.jsx)(s.f,{color:"warning",onClick:function(){se({AssignedID:t.AssignedID,TaskID:t.ID}),B(!0)},children:Object(C.jsx)(D.a,{content:g.a.cilUser,size:"xl"})})}),3===t.StateID&&Object(C.jsx)(s.u,{xs:"2",lg:"2",children:Object(C.jsx)(s.f,{onClick:function(){return function(e,t,c){if(d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),1===e.StateID)return null;6!==t&&7!==t||(c.ID?j.supabase.from("Product").upsert(c).then((function(){})):j.supabase.from("Product").insert(c).then((function(){}))),8!==t&&9!==t||(c.User.ID?Object(x.q)(u.a.omit(c.User,"Address"),c.Products,c.Address,c.OfficeID):Object(x.c)(c.User,c.Products,c.Address,c.OfficeID)),10!==t&&11!==t||((null===c||void 0===c?void 0:c.ID)?Object(f.l)(u.a.omit(c,"ID"),c.ID):Object(f.c)(c)),12===t&&Promise.all([c.map((function(e){var t=e.ID;return Object(f.d)(t)}))]),13!==t&&14!==t||(c.ID?Object(O.b)(u.a.omit(c,"ID"),c.ID):Object(O.a)(u.a.omit(c,"ID"))),16===t&&Object(x.r)({ID:e.ClientID,StateID:2}).then((function(){})),17===t&&Object(x.r)({ID:e.ClientID,StateID:1}).then((function(){})),j.supabase.from("Task").update(e).eq("ID",e.ID).then((function(){n(),q(!1),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Operacion Exitosa!"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)}))}({ID:t.ID,StateID:2===t.StateID?3:2,ClientID:t.ClientID.ID},t.TypeID.ID,t.Data)},color:"success",children:Object(C.jsx)(D.a,{content:g.a.cilCheck,size:"xl"})})}),16===t.TypeID.ID&&3===t.StateID&&Object(C.jsx)(s.u,{xs:"2",lg:"2",children:Object(C.jsx)(s.f,{onClick:function(){Object(f.i)(t.ClientID.ID).then(de),V(t),F(!0)},color:"success",children:Object(C.jsx)(D.a,{content:g.a.cilCash,size:"xl"})})})]}),Object(C.jsx)(s.v,{show:A===t.ID,children:Object(C.jsxs)(s.k,{children:[Q.map((function(e){return Object(C.jsxs)(s.tb,{children:[Object(C.jsx)(s.u,{xs:"12",lg:"1",children:Object(C.jsx)(D.a,{content:g.a.cilUser,size:"xl"})}),Object(C.jsx)(s.u,{xs:"12",lg:"10",children:Object(C.jsx)("h6",{children:"".concat(e.UserID.Names," ").concat(e.UserID.LastName)})}),Object(C.jsx)(s.u,{lg:"2"}),Object(C.jsxs)(s.u,{xs:"12",lg:"10",children:[Object(C.jsx)("p",{style:{backgroundColor:"#d7d7d799",borderRadius:6,padding:6,paddingBottom:20},children:e.Comment}),Object(C.jsx)("p",{style:{fontSize:12,fontWeight:"bold",position:"absolute",bottom:0,right:30},children:l()(e.CreatedAt).format("DD-MM-YYYY")})]})]},e.ID)})),Object(C.jsx)(s.tb,{children:Object(C.jsx)(s.u,{xs:"12",lg:"12",style:{marginTop:10},children:Object(C.jsx)(s.u,{md:"12",children:Object(C.jsxs)(s.S,{style:{border:"2px solid #9999",borderRadius:2},children:[Object(C.jsx)(s.P,{type:"email",id:"input2-group1",name:"input2-group1",placeholder:"Escribe un comentario",style:{border:"0px solid #9999"},value:te,onChange:function(e){var t=e.target.value;return ne(t)}}),Object(C.jsx)(s.T,{children:Object(C.jsx)(s.f,{onClick:function(){return e=t.ID,d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),void Object(p.a)({TaskID:e,Comment:te,UserID:i.ID}).then((function(t){X([].concat(Object(r.a)(Q),[{ID:t,UserID:{Names:i.Names,LastName:i.LastName},createAt:l()().toDate(),TaskID:e,Comment:te}])),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Comentario Guardado..."}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3),ne(""),Object(p.f)(e)}));var e},children:Object(C.jsx)(D.a,{content:g.a.cilSend})})})]})})})})]})}),Object(C.jsx)(s.v,{show:w===t.ID,children:Object(C.jsxs)(s.k,{children:[Object(C.jsxs)(s.tb,{style:{backgroundColor:"#d7d7d799",borderRadius:6,padding:6,marginTop:12},children:[Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Nombre: ".concat(t.ClientID.Names," ").concat(t.ClientID.LastName)})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Contacto: ".concat(t.ClientID.PhoneNumber)})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Rut: ".concat(t.ClientID.Rut)})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Direccion: ".concat(null===(o=t.ClientID)||void 0===o||null===(a=o.Address[0].AddressID)||void 0===a?void 0:a.AddressName,"  ").concat(null===(b=t.ClientID)||void 0===b||null===(h=b.Address[0].AddressID)||void 0===h?void 0:h.AddressNumber)})})]}),1!==(null===i||void 0===i?void 0:i.RolID.ID)&&Object(C.jsxs)(s.tb,{style:{backgroundColor:"#d7d7d799",borderRadius:6,padding:6,marginTop:12},children:[Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Tecnico Encargado"})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Nombre: ".concat(t.AssignedID.Names," ").concat(t.AssignedID.LastName)})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Contacto: ".concat(t.AssignedID.PhoneNumber)})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Rut: ".concat(t.AssignedID.Rut)})})]}),Object(C.jsxs)(s.tb,{style:{backgroundColor:"#d7d7d799",borderRadius:6,padding:6,marginTop:12},children:[Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Nota"})}),Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("p",{children:t.Note})})]}),Object(C.jsxs)(s.tb,{style:{backgroundColor:"#d7d7d799",borderRadius:6,padding:6,marginTop:12},children:[Object(C.jsx)(s.u,{lg:"12",children:Object(C.jsx)("h6",{style:{fontWeight:"bold"},children:"Informacion adicional"})}),Object(C.jsx)(s.u,{lg:"12"})]})]})})]})})}))]})}))})]})})}))}),Object(C.jsxs)(s.db,{show:R,color:"danger",onClose:function(){V(),q(!R)},size:"sm",children:[Object(C.jsx)(s.gb,{closeButton:!0,children:Object(C.jsx)(s.hb,{children:"Eliminar Tarea"})}),Object(C.jsxs)(s.fb,{children:[Object(C.jsx)(s.f,{color:"danger",onClick:function(){d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),j.supabase.from("Task").delete().match({ID:H.ID}).then((function(){V(),n(),q(!1),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Tarea Eliminada!"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)}))},children:"Si"}),Object(C.jsx)(s.f,{onClick:function(){V(),q(!R)},color:"secondary",children:"No"})]})]}),Object(C.jsxs)(s.db,{show:W,onClose:B,children:[Object(C.jsx)(s.gb,{closeButton:!0,children:Object(C.jsx)(s.hb,{children:"Selecciona el tecnico que vas a asignar"})}),Object(C.jsx)(s.eb,{children:Object(C.jsx)(I.a,{setTechnicianID:function(e){se(Object(c.a)(Object(c.a)({},oe),{},{AssignedID:e}))},TechnicianID:null===oe||void 0===oe?void 0:oe.AssignedID})}),Object(C.jsx)(s.fb,{children:Object(C.jsx)(s.f,{color:"success",onClick:function(){d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),Object(p.k)({ID:oe.TaskID,AssignedID:oe.AssignedID}).then((function(){se(!1),B(!1),n(),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Operacion Exitosa!"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)}))},children:"Aceptar"})})]}),Object(C.jsxs)(s.db,{show:Y,onClose:F,children:[Object(C.jsx)(s.gb,{closeButton:!0,children:Object(C.jsx)(s.hb,{children:"Crear Pago"})}),Object(C.jsx)(s.eb,{children:Object(C.jsxs)(s.tb,{alignHorizontal:"center",children:[Object(C.jsx)(s.u,{xs:"12",lg:"8",children:Object(C.jsx)(b.a,{isMulti:!0,name:"colors",options:le.filter((function(e){return!e.State})).map((function(e){return{value:parseInt(e.Charge),label:e.ChargeTypeID.Name,ID:e.ID}})),className:"basic-multi-select",classNamePrefix:"select",value:je,onChange:he})}),Object(C.jsx)(s.u,{xs:"12",lg:"3",children:Object(C.jsx)(s.f,{color:"info",children:Object(C.jsx)(m.b,{onChange:function(e){e.target.files;d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Archivo Cargado"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)},children:"Subir Archivo"})})})]})}),Object(C.jsx)(s.fb,{children:Object(C.jsx)(s.f,{color:"success",onClick:function(){d({type:"SET_TOAS",payload:{show:!0,type:"loading",label:"Cargando..."}}),Promise.all([je.map((function(e){return Object(f.l)({State:!0},e.ID)})),Object(x.r)({ID:H.ClientID.ID,StateID:1}),Object(p.k)({ID:H.ID,StateID:2})]).then((function(){n(),he([]),F(!1),V(),d({type:"SET_TOAS",payload:{show:!0,type:"success",label:"Operacion Exitosa!"}}),setTimeout((function(){d({type:"SET_TOAS",payload:{show:!1,type:"",label:""}})}),3e3)}))},children:"Pagar"})})]})]})}},719:function(e,t,n){"use strict";n.r(t);var c=n(91),r=n(2),o=n(51),s=n(653),a=n.n(s),i=n(652),l=n(669),d=n(17);t.default=function(){var e=Object(i.a)(["user"]).user,t=Object(r.useState)({}),n=Object(c.a)(t,2),s=n[0],u=n[1],b=function(){o.supabase.from("Task").select("*,TypeID(Name,ID),AssignedID(RolID),ClientID(*,Address:UserAddress!inner(AddressID(AddressName,AddressNumber)))").order("ID",{ascending:!1}).or("StateID.eq.2,StateID.eq.3").eq("AssignedID",e.ID).then((function(e){u(a.a.groupBy(e.data,"Priority"))})).catch(console.error)};return Object(r.useEffect)(b,[e.ID]),Object(d.jsx)(d.Fragment,{children:Object(d.jsx)(l.a,{tasks:s,taskEffect:b})})}}}]);
//# sourceMappingURL=16.3a0a3655.chunk.js.map