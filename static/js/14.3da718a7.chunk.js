(this["webpackJsonp@coreui/coreui-free-react-admin-template"]=this["webpackJsonp@coreui/coreui-free-react-admin-template"]||[]).push([[14],{651:function(e,t,c){"use strict";c.d(t,"a",(function(){return o})),c.d(t,"b",(function(){return i}));c(2);var n=c(646),r=c(649),s=c(17),o=function(e){var t=e.onPress,c=e.color,o=e.icon;return Object(s.jsx)("td",{className:"py-2",children:Object(s.jsx)(n.tb,{className:"align-items-center",children:Object(s.jsx)(n.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(s.jsx)(n.f,{color:c,onClick:t,children:Object(s.jsx)(r.a,{content:o,size:"xl"})})})})})},i=function(e){var t=e.children,c=e.value,n=e.onChange,r=e.disabled,o=e.accept;return Object(s.jsxs)("label",{htmlFor:"contained-button-file",className:"m-0 w-100",children:[Object(s.jsx)("input",{value:c,accept:o,disabled:r,style:{display:"none"},id:"contained-button-file",multiple:!0,type:"file",onChange:r?function(){}:n}),t]})}},656:function(e,t,c){"use strict";c.d(t,"c",(function(){return r})),c.d(t,"b",(function(){return s})),c.d(t,"a",(function(){return o}));var n=c(51),r=function(e){return n.supabase.from("Product").select("*").limit(5*e+1).then((function(e){return e.data})).catch(console.error)},s=function(e){return n.supabase.from("UserProduct").select("*,ProductID(*)").eq("UserID",e).then((function(e){return e.data})).catch(console.error)},o=function(e){return n.supabase.from("UserProduct").select("*",{count:"exact"}).eq("ProductID",e).then((function(e){return e.count}))}},662:function(e,t,c){"use strict";var n=c(174),r=c(23),s=c(91),o=c(2),i=c(646),a=c(649),l=c(656),u=c(17);t.a=function(e){var t=e.type,c=e.productsSelected,b=e.setProductsSelected,d=Object(o.useState)([]),j=Object(s.a)(d,2),f=j[0],h=j[1],O=Object(o.useState)(!1),m=Object(s.a)(O,2),x=m[0],g=m[1],p=["Nombre","Precio","activo","select"===t&&"personalizar_precio"],P=function(e){g(!0),Object(l.c)(e).then((function(e){h(e.map((function(e){return Object(r.a)(Object(r.a)({},e),{},{Nombre:e.Name,Precio:new Intl.NumberFormat("es-CL",{currency:"CLP",style:"currency"}).format(e.BasePrice)})}))),g(!1)}))};return Object(o.useEffect)(P,[]),Object(u.jsx)(i.y,{items:f,fields:p,itemsPerPage:5,onPageChange:P,loading:x,pagination:!0,scopedSlots:{personalizar_precio:function(e){return"select"===t&&Object(u.jsx)("td",{className:"py-2",children:Object(u.jsx)(i.u,{col:"4",xs:"4",sm:"4",md:"4",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.P,{placeholder:"10.000",defaultValue:e.BasePrice,onChange:function(t){var n=t.target.value;return b(c.map((function(t){return t.ProductID===e.ID?Object(r.a)(Object(r.a)({},t),{},{Price:parseInt(n)}):Object(r.a)({},t)})))}})})})},activo:function(e){return Object(u.jsx)("td",{className:"py-2",children:"select"===t?Object(u.jsx)(i.tb,{className:"align-items-center",children:Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.Cb,{className:"mx-1",variant:"3d",color:"success",value:1===c.filter((function(t){return e.ID===t.ProductID})).length,checked:1===c.filter((function(t){return e.ID===t.ProductID})).length,onChange:function(t){var r=t.target.checked;b(r?[].concat(Object(n.a)(c),[{UserID:"",ProductID:e.ID,Price:e.BasePrice,label:e.Nombre}]):c.filter((function(t){return e.ID!==t.ProductID})))}})})},e.ID):Object(u.jsxs)(i.tb,{className:"align-items-center",children:[Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.f,{color:"primary",onClick:function(){},children:Object(u.jsx)(a.a,{name:"cil-pencil",style:{paddingLeft:10},customClasses:"c-sidebar-nav-icon"})})}),Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.f,{color:"danger",onClick:function(){},children:Object(u.jsx)(a.a,{name:"cil-trash",style:{paddingLeft:10},customClasses:"c-sidebar-nav-icon"})})})]})})}}})}},664:function(e,t,c){"use strict";c.d(t,"c",(function(){return i})),c.d(t,"b",(function(){return a})),c.d(t,"a",(function(){return u}));var n=c(646),r=c(2),s=c(662),o=c(17),i=function(e){var t=e.show,c=e.setShow,r=e.onFinish,i=e.productsSelected,a=e.setProductsSelected;return Object(o.jsxs)(n.db,{show:t,onClose:c,size:"lg",children:[Object(o.jsx)(n.gb,{closeButton:!0,children:Object(o.jsx)(n.hb,{children:"Selecciona los productos que quieres asignar a este usuario"})}),Object(o.jsx)(n.eb,{children:Object(o.jsx)(s.a,{type:"select",productsSelected:i,setProductsSelected:a})}),Object(o.jsx)(n.fb,{children:Object(o.jsx)(n.f,{color:"success",onClick:r,children:"Aceptar"})})]})},a=function(e){var t=e.show,c=e.setShow,r=e.onFinish;return Object(o.jsxs)(n.db,{show:t,color:"danger",onClose:function(){return c(!1)},size:"sm",children:[Object(o.jsx)(n.gb,{children:Object(o.jsx)(n.hb,{style:{fontWeight:"bold",width:"100%",textAlign:"center"},children:"Estas seguro?"})}),Object(o.jsx)(n.fb,{children:Object(o.jsxs)(n.tb,{style:{width:"100%"},children:[Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{color:"danger",onClick:r,style:{fontWeight:"bold",width:"100%"},children:"Si"})}),Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{onClick:function(){return c(!1)},color:"secondary",style:{fontWeight:"bold",width:"100%"},children:"No"})})]})})]})},l=c(91),u=function(e){var t=e.onFinish,c=e.show,s=e.setShow,i=e.nameEdit,a=Object(r.useState)(i||""),u=Object(l.a)(a,2),b=u[0],d=u[1],j=Object(r.useState)(!1),f=Object(l.a)(j,2),h=f[0],O=f[1];return Object(r.useEffect)((function(){return d(i||"")}),[i]),Object(o.jsx)(n.db,{show:c,onClose:s,size:"sm",children:Object(o.jsxs)(n.J,{className:h?"was-validated":"",children:[Object(o.jsx)(n.gb,{children:Object(o.jsxs)(n.hb,{style:{fontWeight:"bold",width:"100%",textAlign:"center"},children:["".concat(i?"Editar":"Crear"," ")," Cargo"]})}),Object(o.jsxs)(n.eb,{children:[Object(o.jsx)(n.Z,{htmlFor:"name",style:{fontWeight:"bold"},children:"Nombre"}),Object(o.jsx)(n.P,{id:"name",name:"name",value:b,required:!0,onChange:function(e){var t=e.target.value;return d(t)}})]}),Object(o.jsx)(n.fb,{children:Object(o.jsxs)(n.tb,{style:{width:"100%"},children:[Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{color:"success",onClick:function(){if(""===b)return O(!0);t(b),O(!1)},style:{fontWeight:"bold",width:"100%"},children:"".concat(i?"Editar":"Crear")})}),Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{onClick:function(){return s(!1)},color:"secondary",style:{fontWeight:"bold",width:"100%"},children:"Cancelar"})})]})})]})})}},672:function(e,t,c){"use strict";c.d(t,"a",(function(){return l})),c.d(t,"c",(function(){return j})),c.d(t,"b",(function(){return h}));var n=c(763),r=c(646),s=c(2),o=c(651),i=c(17),a=["ID","nombre","editar","eliminar"],l=function(e){var t=e.charges,c=e.onPageChange,s=e.loading,l=e.onPressEdit,u=e.onPressDeleted;return Object(i.jsx)(r.y,{items:t,fields:a,itemsPerPage:5,onPageChange:c,loading:s,pagination:!0,scopedSlots:{editar:function(e){return Object(i.jsx)(o.a,{color:"info",icon:n.a.cilPencil,onPress:function(){l(e)}})},eliminar:function(e){return Object(i.jsx)(o.a,{color:"danger",icon:n.a.cilTrash,onPress:function(){u(e)}})}}})},u=c(23),b=c(91),d=c(660),j=function(e){var t=e.setOffice,c=e.office,n=Object(s.useState)([]),o=Object(b.a)(n,2),a=o[0],l=o[1],j=Object(s.useState)(!1),f=Object(b.a)(j,2),h=f[0],O=f[1],m=function(){O(!0),Object(d.d)().then((function(e){l(e.map((function(e){return Object(u.a)(Object(u.a)({},e),{},{nombre:e.Name})}))),O(!1)}))};return Object(s.useEffect)(m,[]),Object(i.jsx)(r.y,{items:a,fields:["ID","nombre","opciones"],itemsPerPage:5,onPageChange:m,loading:h,pagination:!0,scopedSlots:{opciones:function(e){return Object(i.jsx)("td",{className:"py-2",children:Object(i.jsx)(r.tb,{className:"align-items-center",children:Object(i.jsx)(r.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(i.jsx)(r.Cb,{className:"mx-1",variant:"3d",color:"success",value:(null===c||void 0===c?void 0:c.ID)===e.ID,checked:(null===c||void 0===c?void 0:c.ID)===e.ID,onChange:function(){return t(e)}})})},e.ID)})}}})},f=["ID","nombre","editar","eliminar"],h=function(e){var t=e.offices,c=e.onPageChange,s=e.loading,a=e.onPressEdit,l=e.onPressDeleted;return Object(i.jsx)(r.y,{items:t,fields:f,itemsPerPage:5,onPageChange:c,loading:s,pagination:!0,scopedSlots:{editar:function(e){return Object(i.jsx)(o.a,{color:"info",icon:n.a.cilPencil,onPress:function(){a(e)}})},eliminar:function(e){return Object(i.jsx)(o.a,{color:"danger",icon:n.a.cilTrash,onPress:function(){l(e)}})}}})}},730:function(e,t,c){"use strict";c.r(t);var n=c(23),r=c(91),s=c(2),o=c(646),i=c(653),a=c.n(i),l=c(660),u=c(672),b=c(652),d=c(659),j=c(650),f=c(664),h=c(17);t.default=function(){var e=Object(b.a)(["colors"]).colors,t=Object(s.useState)(!1),c=Object(r.a)(t,2),i=c[0],O=c[1],m=Object(s.useState)(!1),x=Object(r.a)(m,2),g=x[0],p=x[1],P=Object(s.useState)([]),C=Object(r.a)(P,2),v=C[0],y=C[1],N=Object(s.useState)([]),S=Object(r.a)(N,2),D=S[0],I=S[1],w=Object(s.useState)(!1),k=Object(r.a)(w,2),W=k[0],E=k[1],F=Object(s.useState)(!1),z=Object(r.a)(F,2),q=z[0],B=z[1],U=Object(s.useState)({}),A=Object(r.a)(U,2),J=A[0],L=A[1],T=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;O(!0),Object(l.d)(e).then((function(e){return Promise.all(e.map((function(e){return Object(j.f)(e.ID,1).then((function(t){return{count:t,Name:e.Name}}))}))).then((function(t){I(t),y(e.map((function(e){return Object(n.a)(Object(n.a)({},e),{},{nombre:e.Name})}))),O(!1)}))})).catch(console.error)};return Object(s.useEffect)(T,[]),Object(h.jsxs)(h.Fragment,{children:[Object(h.jsx)(o.tb,{className:"align-items-center",style:{marginBottom:16},children:Object(h.jsx)(o.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-3 mb-xl-0",children:Object(h.jsx)(o.f,{onClick:function(){return B(!0)},style:{backgroundColor:e.primary,color:"#fff",fontWeight:"bold"},children:"Crear Sucursal"})})}),Object(h.jsxs)(o.tb,{children:[Object(h.jsx)(o.u,{xs:"12",lg:"6",children:Object(h.jsxs)(o.j,{children:[Object(h.jsx)(o.n,{style:{backgroundColor:e.primary,color:"#fff",fontWeight:"bold"},children:"Sucursales"}),Object(h.jsx)(o.k,{children:Object(h.jsx)(u.b,{offices:v,onPageChange:T,loading:i,onPressEdit:function(e){L(e),B(!0)},onPressDeleted:function(e){E(!0),L(e)}})})]})}),Object(h.jsx)(o.u,{xs:"12",lg:"6",children:Object(h.jsxs)(o.j,{children:[Object(h.jsx)(o.n,{style:{backgroundColor:e.primary,color:"#fff",fontWeight:"bold"},children:"Usuarios Por Sucursal"}),Object(h.jsx)(o.k,{children:Object(h.jsx)(d.a,{datasets:[{label:"Sucursales",backgroundColor:e.primary,data:D.map((function(e){return e.count}))}],labels:D.map((function(e){return e.Name})),options:{tooltips:{enabled:!0}}})})]})})]}),Object(h.jsx)(f.b,{show:W,setShow:function(){E(!1),L({})},onFinish:function(){return Object(l.c)(J.ID).then((function(){O(!1),L({}),T(),E(!1)}))}}),Object(h.jsxs)(o.db,{show:q,onClose:function(){B(!1)},size:"sm",children:[Object(h.jsx)(o.gb,{children:Object(h.jsx)(o.hb,{style:{fontWeight:"bold",width:"100%",textAlign:"center"},children:"".concat(J.ID?"Editar":"Crear","  Sucursal")})}),Object(h.jsx)(o.eb,{children:Object(h.jsx)(o.tb,{children:Object(h.jsx)(o.u,{xs:"12",children:Object(h.jsxs)(o.J,{className:g?"was-validated":"",children:[Object(h.jsx)(o.Z,{htmlFor:"product",style:{fontWeight:"bold"},children:"Nombre"}),Object(h.jsx)(o.P,{id:"product",placeholder:"ingresa el nombre de la sucursal",value:J.Name,onChange:function(e){var t=e.target.value;return L(Object(n.a)(Object(n.a)({},J),{},{Name:t}))},required:!0})]})})})}),Object(h.jsx)(o.fb,{children:Object(h.jsxs)(o.tb,{style:{width:"100%"},children:[Object(h.jsx)(o.u,{col:"6",children:Object(h.jsx)(o.f,{color:"success",onClick:function(){return(null===J||void 0===J?void 0:J.Name)?J.ID?void Object(l.f)(J.ID,a.a.omit(Object(n.a)({},J),"ID","nombre")).then((function(){L({}),T(),B(!1),p(!1)})):Object(l.b)(J).then((function(){L({}),T(),B(!1),p(!1)})):p(!0)},style:{fontWeight:"bold",width:"100%"},children:J.ID?"Editar":"Crear"})}),Object(h.jsx)(o.u,{col:"6",children:Object(h.jsx)(o.f,{color:"secondary",onClick:function(){L({}),B(!1)},style:{fontWeight:"bold",width:"100%"},children:"Cancelar"})})]})})]})]})}}}]);
//# sourceMappingURL=14.3da718a7.chunk.js.map