import{i as C,u as w,a as m,h as n,t as i,q as b}from"./VB2Szy_e.js";import{l as t}from"./CFGUr_YW.js";import{i as q}from"./BA7JV7bM.js";function g(e,c,a=c){var f=C();t(e,"input",r=>{var d=r?e.defaultValue:e.value;if(d=k(e)?u(d):d,a(d),f&&d!==(d=c())){var v=e.selectionStart,s=e.selectionEnd;e.value=d??"",s!==null&&(e.selectionStart=v,e.selectionEnd=Math.min(s,e.value.length))}}),(n&&e.defaultValue!==e.value||w(c)==null&&e.value)&&a(k(e)?u(e.value):e.value),m(()=>{var r=c();k(e)&&r===u(e.value)||e.type==="date"&&!r&&!e.value||r!==e.value&&(e.value=r??"")})}const _=new Set;function B(e,c,a,f,r=f){var d=a.getAttribute("type")==="checkbox",v=e;let s=!1;if(c!==null)for(var h of c)v=v[h]??(v[h]=[]);v.push(a),t(a,"change",()=>{var l=a.__value;d&&(l=S(v,l,a.checked)),r(l)},()=>r(d?[]:null)),m(()=>{var l=f();if(n&&a.defaultChecked!==a.checked){s=!0;return}d?(l=l||[],a.checked=l.includes(a.__value)):a.checked=q(a.__value,l)}),i(()=>{var l=v.indexOf(a);l!==-1&&v.splice(l,1)}),_.has(v)||(_.add(v),b(()=>{v.sort((l,o)=>l.compareDocumentPosition(o)===4?-1:1),_.delete(v)})),b(()=>{if(s){var l;if(d)l=S(v,l,a.checked);else{var o=v.find(y=>y.checked);l=o==null?void 0:o.__value}r(l)}})}function D(e,c,a=c){t(e,"change",f=>{var r=f?e.defaultChecked:e.checked;a(r)}),(n&&e.defaultChecked!==e.checked||w(c)==null)&&a(e.checked),m(()=>{var f=c();e.checked=!!f})}function S(e,c,a){for(var f=new Set,r=0;r<e.length;r+=1)e[r].checked&&f.add(e[r].__value);return a||f.delete(c),Array.from(f)}function k(e){var c=e.type;return c==="number"||c==="range"}function u(e){return e===""?null:+e}export{D as a,g as b,B as c};
