(()=>{var e={576:(e,t,n)=>{"use strict";n.d(t,{Z:()=>s});const o=require("axios");var a=n.n(o),i=n(689),r=n.n(i);const s=function(e){const[t,n]=(0,i.useState)(!1),[o,s]=(0,i.useState)(""),[c,l]=(0,i.useState)(),[d,u]=(0,i.useState)("");return r().createElement("div",{className:"card"},r().createElement("div",{className:"our-card-top"},t&&r().createElement("div",{className:"our-custom-input"},r().createElement("div",{className:"our-custom-input-interior"},r().createElement("input",{onChange:e=>l(e.target.files[0]),className:"form-control form-control-sm",type:"file"}))),r().createElement("img",{src:e.photo?`/uploaded-photos/${e.photo}`:"/fallback.png",className:"card-img-top",alt:`${e.funcao} named ${e.name}`})),r().createElement("div",{className:"card-body"},!t&&r().createElement(r().Fragment,null,r().createElement("h4",null,e.name),r().createElement("p",{className:"text-muted small"},e.funcao),!e.readOnly&&r().createElement(r().Fragment,null,r().createElement("button",{onClick:()=>{n(!0),s(e.name),u(e.funcao),l("")},className:"btn btn-sm btn-primary"},"Edit")," ",r().createElement("button",{onClick:async()=>{a().delete(`/funcionario/${e.id}`),e.setFuncionarios((t=>t.filter((t=>t._id!=e.id))))},className:"btn btn-sm btn-outline-danger"},"Delete"))),t&&r().createElement("form",{onSubmit:async function(t){t.preventDefault(),n(!1),e.setFuncionarios((t=>t.map((function(t){return t._id==e.id?{...t,name:o,funcao:d}:t}))));const i=new FormData;c&&i.append("photo",c),i.append("_id",e.id),i.append("name",o),i.append("funcao",d);const r=await a().post("/update-funcionario",i,{headers:{"Content-Type":"multipart/form-data"}});r.data&&e.setFuncionarios((t=>t.map((function(t){return t._id==e.id?{...t,photo:r.data}:t}))))}},r().createElement("div",{className:"mb-1"},r().createElement("input",{autoFocus:!0,onChange:e=>s(e.target.value),type:"text",className:"form-control form-control-sm",value:o})),r().createElement("div",{className:"mb-2"},r().createElement("input",{onChange:e=>u(e.target.value),type:"text",className:"form-control form-control-sm",value:d})),r().createElement("button",{className:"btn btn-sm btn-success"},"Save")," ",r().createElement("button",{onClick:()=>n(!1),className:"btn btn-sm btn-outline-secondary"},"Cancel"))))}},860:e=>{"use strict";e.exports=require("express")},470:e=>{"use strict";e.exports=require("fs-extra")},13:e=>{"use strict";e.exports=require("mongodb")},738:e=>{"use strict";e.exports=require("multer")},689:e=>{"use strict";e.exports=require("react")},684:e=>{"use strict";e.exports=require("react-dom/server")},109:e=>{"use strict";e.exports=require("sanitize-html")},441:e=>{"use strict";e.exports=require("sharp")},17:e=>{"use strict";e.exports=require("path")}},t={};function n(o){var a=t[o];if(void 0!==a)return a.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{const{MongoClient:e,ObjectId:t}=n(13),o=n(860),a=n(738);upload=a();const i=n(109),r=n(470),s=n(441),c=o();let l;c.set("view engine","ejs"),c.set("views","./views"),c.use(o.static("public"));const d=n(17),u=n(689),m=n(684),p=n(576).Z;r.ensureDirSync(d.join("public","uploaded-photos"));const f=`mongodb+srv://aep:${encodeURIComponent("aep")}@aep.3myjgmm.mongodb.net/Aep`;function b(e,t,n){"string"!=typeof e.body.name&&(e.body.name=""),"string"!=typeof e.body.funcao&&(e.body.funcao=""),"string"!=typeof e.body._id&&(e.body._id=""),e.cleanData={name:i(e.body.name.trim(),{aloowedTags:[],allowedAttributes:{}}),funcao:i(e.body.funcao.trim(),{aloowedTags:[],allowedAttributes:{}})},n()}c.use(o.json()),c.use(o.urlencoded({extended:!1})),c.get("/",(async(e,t)=>{const n=await l.collection("funcionarios").find().toArray(),o=m.renderToString(u.createElement("div",{className:"container"},!n.length&&u.createElement("p",null,"Não possui nenhum funcionário na lista ainda, o administrador precisa adicionar."),u.createElement("div",{className:"funcionario-grid mb-3"},n.map((e=>u.createElement(p,{key:e._id,name:e.name,funcao:e.funcao,photo:e.photo,id:e._id,readOnly:!0})))),u.createElement("p",null,u.createElement("a",{href:"/admin"},"Login / Gerenciar a lista de funcionários."))));t.render("home",{generatedHTML:o})})),c.use(((e,t,n)=>{t.set("WWW-Authenticate","Basic realm='Aep"),"Basic YWVwOmFlcA=="==e.headers.authorization?n():(console.log(e.headers.authorization),t.status(401).send("Tente novamente"))})),c.get("/admin",((e,t)=>{t.render("admin")})),c.get("/api/funcionarios",(async(e,t)=>{const n=await l.collection("funcionarios").find().toArray();t.json(n)})),c.post("/create-funcionario",upload.single("photo"),b,(async(e,n)=>{if(e.file){const t=`${Date.now()}.jpg`;await s(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(d.join("public","uploaded-photos",t)),e.cleanData.photo=t}console.log(e.body);const o=await l.collection("funcionarios").insertOne(e.cleanData),a=await l.collection("funcionarios").findOne({_id:new t(o.insertedId)});n.send(a)})),c.delete("/funcionario/:id",(async(e,n)=>{"string"!=typeof e.params.id&&(e.params.id="");const o=await l.collection("funcionarios").findOne({_id:new t(e.params.id)});o.photo&&r.remove(d.join("public","uploaded-photos",o.photo)),l.collection("funcionarios").deleteOne({_id:new t(e.params.id)}),n.send("Good job")})),c.post("/update-funcionario",upload.single("photo"),b,(async(e,n)=>{if(e.file){const o=`${Date.now()}.jpg`;await s(e.file.buffer).resize(844,456).jpeg({quality:60}).toFile(d.join("public","uploaded-photos",o)),e.cleanData.photo=o;const a=await l.collection("funcionarios").findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData});a.value.photo&&r.remove(d.join("public","uploaded-photos",a.value.photo)),n.send(o)}else l.collection("funcionarios").findOneAndUpdate({_id:new t(e.body._id)},{$set:e.cleanData}),n.send(!1)})),async function(){const t=new e(f);try{await t.connect(),l=t.db(),console.log("Connected to MongoDB")}catch(e){console.error(e)}c.listen(8080,(()=>{console.log("Server started on port 8080")}))}()})()})();