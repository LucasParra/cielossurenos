(this["webpackJsonp@coreui/coreui-free-react-admin-template"]=this["webpackJsonp@coreui/coreui-free-react-admin-template"]||[]).push([[20],{651:function(e,t,c){"use strict";c.d(t,"a",(function(){return o})),c.d(t,"b",(function(){return i}));c(2);var n=c(646),r=c(649),s=c(17),o=function(e){var t=e.onPress,c=e.color,o=e.icon;return Object(s.jsx)("td",{className:"py-2",children:Object(s.jsx)(n.tb,{className:"align-items-center",children:Object(s.jsx)(n.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(s.jsx)(n.f,{color:c,onClick:t,children:Object(s.jsx)(r.a,{content:o,size:"xl"})})})})})},i=function(e){var t=e.children,c=e.value,n=e.onChange,r=e.disabled,o=e.accept;return Object(s.jsxs)("label",{htmlFor:"contained-button-file",className:"m-0 w-100",children:[Object(s.jsx)("input",{value:c,accept:o,disabled:r,style:{display:"none"},id:"contained-button-file",multiple:!0,type:"file",onChange:r?function(){}:n}),t]})}},656:function(e,t,c){"use strict";c.d(t,"c",(function(){return r})),c.d(t,"b",(function(){return s})),c.d(t,"a",(function(){return o}));var n=c(51),r=function(e){return n.supabase.from("Product").select("*").limit(5*e+1).then((function(e){return e.data})).catch(console.error)},s=function(e){return n.supabase.from("UserProduct").select("*,ProductID(*)").eq("UserID",e).then((function(e){return e.data})).catch(console.error)},o=function(e){return n.supabase.from("UserProduct").select("*",{count:"exact"}).eq("ProductID",e).then((function(e){return e.count}))}},662:function(e,t,c){"use strict";var n=c(174),r=c(23),s=c(91),o=c(2),i=c(646),a=c(649),l=c(656),u=c(17);t.a=function(e){var t=e.type,c=e.productsSelected,b=e.setProductsSelected,d=Object(o.useState)([]),j=Object(s.a)(d,2),h=j[0],f=j[1],O=Object(o.useState)(!1),m=Object(s.a)(O,2),x=m[0],g=m[1],p=["Nombre","Precio","activo","select"===t&&"personalizar_precio"],P=function(e){g(!0),Object(l.c)(e).then((function(e){f(e.map((function(e){return Object(r.a)(Object(r.a)({},e),{},{Nombre:e.Name,Precio:new Intl.NumberFormat("es-CL",{currency:"CLP",style:"currency"}).format(e.BasePrice)})}))),g(!1)}))};return Object(o.useEffect)(P,[]),Object(u.jsx)(i.y,{items:h,fields:p,itemsPerPage:5,onPageChange:P,loading:x,pagination:!0,scopedSlots:{personalizar_precio:function(e){return"select"===t&&Object(u.jsx)("td",{className:"py-2",children:Object(u.jsx)(i.u,{col:"4",xs:"4",sm:"4",md:"4",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.P,{placeholder:"10.000",defaultValue:e.BasePrice,onChange:function(t){var n=t.target.value;return b(c.map((function(t){return t.ProductID===e.ID?Object(r.a)(Object(r.a)({},t),{},{Price:parseInt(n)}):Object(r.a)({},t)})))}})})})},activo:function(e){return Object(u.jsx)("td",{className:"py-2",children:"select"===t?Object(u.jsx)(i.tb,{className:"align-items-center",children:Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.Cb,{className:"mx-1",variant:"3d",color:"success",value:1===c.filter((function(t){return e.ID===t.ProductID})).length,checked:1===c.filter((function(t){return e.ID===t.ProductID})).length,onChange:function(t){var r=t.target.checked;b(r?[].concat(Object(n.a)(c),[{UserID:"",ProductID:e.ID,Price:e.BasePrice,label:e.Nombre}]):c.filter((function(t){return e.ID!==t.ProductID})))}})})},e.ID):Object(u.jsxs)(i.tb,{className:"align-items-center",children:[Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.f,{color:"primary",onClick:function(){},children:Object(u.jsx)(a.a,{name:"cil-pencil",style:{paddingLeft:10},customClasses:"c-sidebar-nav-icon"})})}),Object(u.jsx)(i.u,{col:"2",xs:"2",sm:"2",md:"2",className:"mb-2 mb-xl-0",children:Object(u.jsx)(i.f,{color:"danger",onClick:function(){},children:Object(u.jsx)(a.a,{name:"cil-trash",style:{paddingLeft:10},customClasses:"c-sidebar-nav-icon"})})})]})})}}})}},664:function(e,t,c){"use strict";c.d(t,"c",(function(){return i})),c.d(t,"b",(function(){return a})),c.d(t,"a",(function(){return u}));var n=c(646),r=c(2),s=c(662),o=c(17),i=function(e){var t=e.show,c=e.setShow,r=e.onFinish,i=e.productsSelected,a=e.setProductsSelected;return Object(o.jsxs)(n.db,{show:t,onClose:c,size:"lg",children:[Object(o.jsx)(n.gb,{closeButton:!0,children:Object(o.jsx)(n.hb,{children:"Selecciona los productos que quieres asignar a este usuario"})}),Object(o.jsx)(n.eb,{children:Object(o.jsx)(s.a,{type:"select",productsSelected:i,setProductsSelected:a})}),Object(o.jsx)(n.fb,{children:Object(o.jsx)(n.f,{color:"success",onClick:r,children:"Aceptar"})})]})},a=function(e){var t=e.show,c=e.setShow,r=e.onFinish;return Object(o.jsxs)(n.db,{show:t,color:"danger",onClose:function(){return c(!1)},size:"sm",children:[Object(o.jsx)(n.gb,{children:Object(o.jsx)(n.hb,{style:{fontWeight:"bold",width:"100%",textAlign:"center"},children:"Estas seguro?"})}),Object(o.jsx)(n.fb,{children:Object(o.jsxs)(n.tb,{style:{width:"100%"},children:[Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{color:"danger",onClick:r,style:{fontWeight:"bold",width:"100%"},children:"Si"})}),Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{onClick:function(){return c(!1)},color:"secondary",style:{fontWeight:"bold",width:"100%"},children:"No"})})]})})]})},l=c(91),u=function(e){var t=e.onFinish,c=e.show,s=e.setShow,i=e.nameEdit,a=Object(r.useState)(i||""),u=Object(l.a)(a,2),b=u[0],d=u[1],j=Object(r.useState)(!1),h=Object(l.a)(j,2),f=h[0],O=h[1];return Object(r.useEffect)((function(){return d(i||"")}),[i]),Object(o.jsx)(n.db,{show:c,onClose:s,size:"sm",children:Object(o.jsxs)(n.J,{className:f?"was-validated":"",children:[Object(o.jsx)(n.gb,{children:Object(o.jsxs)(n.hb,{style:{fontWeight:"bold",width:"100%",textAlign:"center"},children:["".concat(i?"Editar":"Crear"," ")," Cargo"]})}),Object(o.jsxs)(n.eb,{children:[Object(o.jsx)(n.Z,{htmlFor:"name",style:{fontWeight:"bold"},children:"Nombre"}),Object(o.jsx)(n.P,{id:"name",name:"name",value:b,required:!0,onChange:function(e){var t=e.target.value;return d(t)}})]}),Object(o.jsx)(n.fb,{children:Object(o.jsxs)(n.tb,{style:{width:"100%"},children:[Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{color:"success",onClick:function(){if(""===b)return O(!0);t(b),O(!1)},style:{fontWeight:"bold",width:"100%"},children:"".concat(i?"Editar":"Crear")})}),Object(o.jsx)(n.u,{col:"6",children:Object(o.jsx)(n.f,{onClick:function(){return s(!1)},color:"secondary",style:{fontWeight:"bold",width:"100%"},children:"Cancelar"})})]})})]})})}},756:function(e,t,c){"use strict";c.r(t);var n=c(23),r=c(91),s=c(646),o=c(2),i=c(763),a=c(653),l=c.n(a),u=c(650),b=c(651),d=c(17),j=["nombre","rut","numero_de_contacto","productos"],h=function(e){var t=e.handleClient,c=Object(o.useState)([]),n=Object(r.a)(c,2),a=n[0],h=n[1],f=Object(o.useState)(!1),O=Object(r.a)(f,2),m=O[0],x=O[1],g=Object(o.useState)(""),p=Object(r.a)(g,2),P=p[0],C=p[1],v=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;x(!0),C(e),Object(u.m)(t,e).then((function(e){h(e.map((function(e){return{ID:e.ID,nombre:"".concat(e.Names," ").concat(e.LastName),rut:e.Rut,numero_de_contacto:e.PhoneNumber}}))),x(!1)}))},y=Object(o.useCallback)((function(e,t){return l.a.debounce(v(e,t),1e3)}),[]);return Object(o.useEffect)(v,[]),Object(d.jsx)(s.y,{items:a,fields:j,itemsPerPage:5,onPageChange:function(e){return v(P,e)},loading:m,pagination:!0,tableFilter:{placeholder:"rut",label:"Filtrar"},striped:!0,onTableFilterChange:y,scopedSlots:{productos:function(e){return Object(d.jsx)(b.a,{color:"secondary",icon:i.a.cilListRich,onPress:function(){return t(e.ID)}})}}})},f=c(664),O=c(656),m=c(652);t.default=function(){var e=Object(m.a)(["colors"]).colors,t=Object(o.useState)(!1),c=Object(r.a)(t,2),i=c[0],a=c[1],l=Object(o.useState)([]),b=Object(r.a)(l,2),j=b[0],x=b[1],g=Object(o.useState)(""),p=Object(r.a)(g,2),P=p[0],C=p[1];return Object(d.jsxs)(d.Fragment,{children:[Object(d.jsx)(s.tb,{children:Object(d.jsx)(s.u,{xs:"12",sm:"6",lg:"12",children:Object(d.jsxs)(s.j,{children:[Object(d.jsx)(s.n,{style:{backgroundColor:e.primary,color:"#fff",fontWeight:"bold"},children:"clientes"}),Object(d.jsx)(s.k,{children:Object(d.jsx)(h,{handleClient:function(e){Object(O.b)(e).then((function(t){x(t.map((function(e){return{ProductID:e.ProductID.ID,Price:e.ProductID.BasePrice,ID:e.ID}}))),C(e),a(!0)}))}})})]})})}),Object(d.jsx)(f.c,{show:i,setShow:function(){return a(!1)},onFinish:function(){Promise.all(j.map((function(e){return e.ID?Object(u.s)(Object(n.a)(Object(n.a)({},e),{},{UserID:P})):Object(u.d)(Object(n.a)(Object(n.a)({},e),{},{UserID:P}))}))).then((function(){a(!1),x([]),C("")}))},setProductsSelected:x,productsSelected:j})]})}}}]);
//# sourceMappingURL=20.291f1e16.chunk.js.map