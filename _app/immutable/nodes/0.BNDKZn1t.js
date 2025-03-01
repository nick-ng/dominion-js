import{a as x,t as w}from"../chunks/CHjdsA0P.js";import"../chunks/VakZnCW4.js";import{a as tt,t as et,X as Z,Z as K,g as v,u as l,j as E,au as O,a2 as r,a3 as o,r as a,av as rt,aw as at}from"../chunks/VB2Szy_e.js";import{e as N,d as ot}from"../chunks/CFGUr_YW.js";import{b as Q,a as R,s as V,d as h,e as W}from"../chunks/BA7JV7bM.js";import{s as B,o as p,r as S,a as nt}from"../chunks/DCJvbQvC.js";import{i as Y}from"../chunks/BPyFM2wd.js";import{b as st,a as C}from"../chunks/CBmiCr12.js";function lt(b,u,s,f,t){var n=()=>{f(s[b])};s.addEventListener(u,n),t?tt(()=>{s[b]=t()}):n(),(s===document.body||s===window||s===document)&&et(()=>{s.removeEventListener(u,n)})}const it="auto",dt=!1,Ct=Object.freeze(Object.defineProperty({__proto__:null,prerender:it,ssr:dt},Symbol.toStringTag,{value:"Module"}));var ct=w('<button class="vignette absolute bottom-0 left-0 right-0 top-0 z-10 border-none" aria-label="close-vignette"></button>'),vt=w('<details><summary class="button-default no-underline">Options</summary> <!> <div class="relative"><div class="absolute right-0 z-20 border border-gray-300 bg-main-bg p-0 can-hover:top-full-1 cannot-hover:top-full-2"><table class="options-table border-separate border-spacing-2 svelte-1nqg35e"><tbody><tr><td class="svelte-1nqg35e">Animation Speed</td><td class="svelte-1nqg35e"><input type="range"></td></tr><tr><td class="svelte-1nqg35e"><label for="opponentAllUpsideDownControl" class="svelte-1nqg35e">Opponent Upside Down</label></td><td class="svelte-1nqg35e"><input id="opponentAllUpsideDownControl" type="checkbox" class="svelte-1nqg35e"></td></tr><tr><td class="svelte-1nqg35e"><label for="dragCardFromCenterControl" class="svelte-1nqg35e">Drag Cards From Centre</label></td><td class="svelte-1nqg35e"><input id="dragCardFromCenterControl" type="checkbox" class="svelte-1nqg35e"></td></tr><tr><td class="svelte-1nqg35e"><label for="invertScrollDirectionControl" class="svelte-1nqg35e">Invert Scroll Direction</label></td><td class="svelte-1nqg35e"><input id="invertScrollDirectionControl" type="checkbox" class="svelte-1nqg35e"></td></tr><tr class="can-hover:hidden"><td class="svelte-1nqg35e"><label for="showFullScreenButtonControl" class="svelte-1nqg35e">Full Screen Button</label></td><td class="svelte-1nqg35e"><input id="showFullScreenButtonControl" type="checkbox" class="svelte-1nqg35e"></td></tr></tbody></table> <hr> <div class="px-3 py-1"><a href="https://github.com/nick-ng/dominion-js" target="_blank">GitHub</a></div></div></div></details>');function ut(b,u){Z(u,!1);const[s,f]=V(),t=()=>W(p,"$optionsStore",s);let n=O(!1),i=O(null);Y();var c=vt(),m=r(c);Q(m,e=>E(i,e),()=>v(i));var y=o(m,2);{var $=e=>{var X=ct();N("click",X,()=>{v(i)&&v(i).click()}),x(e,X)};R(y,e=>{v(n)&&e($)})}var q=o(y,2),d=r(q),g=r(d),A=r(g),k=r(A),U=o(r(k)),_=r(U);S(_),B(_,"min",1),B(_,"max",11),B(_,"step",1),a(U),a(k);var F=o(k),z=o(r(F)),L=r(z);S(L),a(z),a(F);var D=o(F),T=o(r(D)),G=r(T);S(G),a(T),a(D);var j=o(D),H=o(r(j)),I=r(H);S(I),a(H),a(j);var J=o(j),M=o(r(J)),P=r(M);S(P),a(M),a(J),a(A),a(g),rt(4),a(d),a(q),a(c),st(_,()=>t().animationSpeed,e=>h(p,l(t).animationSpeed=e,l(t))),C(L,()=>t().opponentAllUpsideDown,e=>h(p,l(t).opponentAllUpsideDown=e,l(t))),C(G,()=>t().dragCardFromCenter,e=>h(p,l(t).dragCardFromCenter=e,l(t))),C(I,()=>t().invertScrollDirection,e=>h(p,l(t).invertScrollDirection=e,l(t))),C(P,()=>t().showFullScreenButton,e=>h(p,l(t).showFullScreenButton=e,l(t))),lt("open","toggle",c,e=>E(n,e),()=>v(n)),x(b,c),K(),f()}var pt=w('<button class="can-hover:hidden">Toggle Full Screen</button>'),bt=w('<div class="flex h-screen max-h-screen flex-col justify-start px-2 pt-2"><nav class="mb-1 flex flex-row justify-between gap-2"><a class="button-default inline-block px-2 no-underline" href="simulator">Simulator</a> <a class="button-default inline-block px-2 no-underline" href="card-list">Card List</a> <div class="flex-grow"></div> <!> <!></nav> <!></div>');function xt(b,u){Z(u,!1);const[s,f]=V(),t=()=>W(p,"$optionsStore",s);let n=O(null);Y();var i=bt();ot(d=>{at.title="Jurisdiction"});var c=r(i),m=o(r(c),6);{var y=d=>{var g=pt();N("click",g,()=>{document.fullscreenElement?document.exitFullscreen():v(n)&&v(n).requestFullscreen()}),x(d,g)};R(m,d=>{t().showFullScreenButton&&document.fullscreenEnabled&&d(y)})}var $=o(m,2);ut($,{}),a(c);var q=o(c,2);nt(q,u,"default",{}),a(i),Q(i,d=>E(n,d),()=>v(n)),x(b,i),K(),f()}export{xt as component,Ct as universal};
