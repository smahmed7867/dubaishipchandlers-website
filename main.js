(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce||!window.gsap||!window.ScrollTrigger){document.documentElement.classList.add('static');return}
document.documentElement.classList.add('js');
gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();
// 1. Story: forklift -> truck pans right, ghost text, grey->dark
const s=gsap.timeline({scrollTrigger:{trigger:'.story',start:'top top',end:'bottom bottom',scrub:.6}});
s.to('.p1 img',{scale:1.18,xPercent:-4,duration:1,ease:'none'},0)
 .to('.c1',{yPercent:-40,opacity:0,duration:.5},0.15)
 .to('.hint',{opacity:0,duration:.1},0)
 .to('.p2',{clipPath:'inset(0 0 0 0%)',duration:.7,ease:'power2.inOut'},0.55)
 .fromTo('.p2 img',{scale:1.15,xPercent:-8},{scale:1.05,xPercent:6,duration:1.6,ease:'none'},0.55)
 .to('.c2',{opacity:1,y:0,duration:.3},1.0).from('.c2',{x:80,duration:.3},1.0)
 .to('.bggrad',{opacity:1,duration:.4},1.7)
 .set('.p1',{opacity:0},1.85).to('.p2',{opacity:0,xPercent:30,duration:.5},1.9)
 .to('.c2',{opacity:0,duration:.2},1.9)
 .fromTo('.ghost',{x:()=>innerWidth},{x:()=>-document.querySelector('.ghost').offsetWidth*0.6,duration:1.3,ease:'none'},1.7);
gsap.set('.ghost',{yPercent:-50});
// 2. Services: horizontal scroll
mm.add('(min-width:861px)',()=>{ ScrollTrigger.refresh();
 const tr=document.querySelector('.track');
 gsap.to(tr,{x:()=>-(tr.scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'.svc',pin:'.svcpin',start:'top top',end:()=>'+='+(tr.scrollWidth-innerWidth+200),scrub:.6,invalidateOnRefresh:true}});
 gsap.from('.svchead h2',{x:-120,opacity:0,scrollTrigger:{trigger:'.svc',start:'top 70%',end:'top 10%',scrub:true}});
 // 3. split with ship channel
 const ship=document.querySelector('.channel img');
 const t=gsap.timeline({scrollTrigger:{trigger:'.split',pin:'.splitpin',start:'top top',end:'+=150%',scrub:.6}});
 t.fromTo(ship,{yPercent:-100},{y:()=>document.querySelector('.channel').offsetHeight,yPercent:0,ease:'none'},0)
  .from('.lcol>*',{x:-80,opacity:0,stagger:.08,duration:.3},0).from('.stat',{x:80,opacity:0,stagger:.08,duration:.3},0);
});
mm.add('(max-width:860px)',()=>{
 gsap.to('.track',{x:()=>-(document.querySelector('.track').scrollWidth-innerWidth),ease:'none',scrollTrigger:{trigger:'.svc',pin:'.svcpin',start:'top top',end:'+=200%',scrub:.5,invalidateOnRefresh:true}});
 gsap.fromTo('.channel img',{yPercent:-100},{yPercent:100,ease:'none',scrollTrigger:{trigger:'.channel',start:'top bottom',end:'bottom top',scrub:true}});
});
// counters
document.querySelectorAll('.stat b[data-n]').forEach(b=>{const o={v:0},n=+b.dataset.n,suf=b.dataset.s;
 ScrollTrigger.create({trigger:b,start:'top 85%',once:true,onEnter:()=>gsap.to(o,{v:n,duration:1.4,ease:'power2.out',onUpdate:()=>b.textContent=Math.round(o.v)+suf})})});
// 4. panels slide away revealing sea
const r=gsap.timeline({scrollTrigger:{trigger:'.reveal',start:'top top',end:'bottom bottom',scrub:.6}});
r.to('.pl',{xPercent:-100,duration:1},0).to('.pr',{xPercent:100,duration:1},0).to('.sea',{scale:1,duration:2,ease:'none'},0)
 .fromTo('.seah',{opacity:0,y:60,scale:.9},{opacity:1,y:0,scale:1,duration:.8},.6);
// 5. white block slides up + section text slide-ins
gsap.from('.ports-s',{yPercent:12,scrollTrigger:{trigger:'.ports-s',start:'top bottom',end:'top 40%',scrub:true}});
gsap.utils.toArray('.ports-s h2,.why h2,.rfq h2,.region,.why .card').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
gsap.fromTo('.whyimg',{clipPath:'inset(30% 0 30% 0)'},{clipPath:'inset(0% 0 0% 0)',scrollTrigger:{trigger:'.why',start:'top 80%',end:'top 20%',scrub:true}});
gsap.fromTo('.whyimg img',{scale:1.3},{scale:1,scrollTrigger:{trigger:'.why',start:'top bottom',end:'bottom top',scrub:true}});
// IMPA grid: light reveal as rows enter
ScrollTrigger.batch('.stock > div',{start:'top 90%',once:true,onEnter:batch=>gsap.from(batch,{y:28,opacity:0,duration:.55,stagger:.06,ease:'power2.out'})});
ScrollTrigger.batch('.ic',{start:'top 92%',once:true,onEnter:batch=>gsap.from(batch,{y:20,opacity:0,duration:.45,stagger:.025,ease:'power2.out'})});
// Stores: photos start as a tight cluster and spread to the edges while the heading stays pinned behind them.
const shots=gsap.utils.toArray('.supply .shot');
function placeShots(p){
 const vw=innerWidth,vh=innerHeight;
 shots.forEach(el=>{
  const w=el.offsetWidth,h=el.offsetHeight;
  if(!w||!h)return;
  const cx=+el.dataset.cx,cy=+el.dataset.cy,dx=+el.dataset.dx,dy=+el.dataset.dy,s0=+el.dataset.s,r0=+el.dataset.r;
  const px=(vw*0.5+dx)+((cx*vw)-(vw*0.5+dx))*p;
  const py=(vh*0.47+dy)+((cy*vh)-(vh*0.47+dy))*p;
  gsap.set(el,{x:px-w/2,y:py-h/2,scale:s0+(1-s0)*p,rotation:r0*(1-p),transformOrigin:'50% 50%',force3D:true});
 });
 const sub=p<0.18?1:Math.max(0,1-(p-0.18)/0.22);
 const credit=Math.max(0,(p-0.74)/0.26);
 gsap.set('.supplysub',{opacity:sub});
 gsap.set('.supply .shot figcaption',{opacity:Math.max(0,(p-0.58)/0.32)});
 gsap.set('.photocredit',{opacity:credit,pointerEvents:credit>0.45?'auto':'none'});
 gsap.set('.supplyh',{scale:1+p*0.04,opacity:1-p*0.22});
}
mm.add('(min-width:861px)',()=>{
 const st=ScrollTrigger.create({trigger:'.supply',start:'top top',end:'bottom bottom',scrub:.45,invalidateOnRefresh:true,onUpdate:self=>placeShots(self.progress)});
 placeShots(st.progress||0);
 const onLoad=()=>{placeShots(st.progress||0)};
 addEventListener('load',onLoad);
 return()=>removeEventListener('load',onLoad);
});
mm.add('(max-width:860px)',()=>{
 gsap.from('.supply .shot',{y:24,opacity:0,duration:.5,stagger:.06,ease:'power2.out',immediateRender:false,scrollTrigger:{trigger:'.supply',start:'top 86%'}});
});
})();
