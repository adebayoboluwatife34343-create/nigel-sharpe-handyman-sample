import {T,stage,initReveal,initMenu,initQuote,addLights,reduced,clamp,lerp,$} from './common.js';
initMenu();initQuote();initReveal();
const tiles=$('#tiles');if(tiles){const c=innerWidth<700?6:10,r=innerWidth<700?9:7;tiles.style.setProperty('--c',c);tiles.style.setProperty('--r',r);for(let y=0;y<r;y++)for(let x=0;x<c;x++){const i=document.createElement('i');i.style.animationDelay=(.05*y+.03*x)+'s,'+(2.15+.02*x+.02*(r-y))+'s';tiles.appendChild(i)}
 const kill=()=>{document.documentElement.classList.add('intro-skip')};setTimeout(kill,3200);addEventListener('keydown',kill,{once:true})}
const host=$('#roof'),btn=$('#fixbtn'),lab=$('#roofState');let fixed=false;
const ctx=stage(host,ctx=>{
 const {scene,cam}=ctx;cam.position.set(0,2.2,16.5);addLights(ctx,{fill:0xaec9e0,ground:0x1d2b38,ki:2.4,hi:1.5});
 const g=new T.Group();scene.add(g);const roof=new T.Group();g.add(roof);
 const C=9,R=7,tw=1.02,th=.78,n=C*R;const geo=new T.BoxGeometry(tw*.96,th,.07);
 const mat=new T.MeshStandardMaterial({color:0xffffff,roughness:.72,metalness:.12});const im=new T.InstancedMesh(geo,mat,n-1);const col=new T.Color(),m=new T.Matrix4();const shades=[0x34495c,0x3d566d,0x2c3f50,0x46647e,0x395068];
 let k=0,gx=4,gy=3;let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
 for(let y=0;y<R;y++)for(let x=0;x<C;x++){if(x===gx&&y===gy)continue;const px=(x-(C-1)/2)*tw+(y%2?tw*.5:0)*.0,py=(y-(R-1)/2)*th*.82;m.makeTranslation(px+((y%2)?.25:-.25),py,y*.012);im.setMatrixAt(k,m);col.setHex(shades[Math.floor(rnd()*shades.length)]);im.setColorAt(k,col);k++}
 roof.add(im);
 const rafter=new T.MeshStandardMaterial({color:0x14202b,roughness:.9});
 for(let i=0;i<5;i++){const b=new T.Mesh(new T.BoxGeometry(.18,R*th*.9,.14),rafter);b.position.set((i-2)*2.35,0,-.12);roof.add(b)}
 const bat=new T.Mesh(new T.BoxGeometry(C*tw,.1,.1),rafter);for(let y=0;y<R;y++){const b=bat.clone();b.position.set(0,(y-(R-1)/2)*th*.82-.2,-.04);roof.add(b)}
 const ridge=new T.Mesh(new T.CylinderGeometry(.22,.22,C*tw+.4,20,1,false,0,Math.PI),new T.MeshStandardMaterial({color:0x4fd6c8,metalness:.5,roughness:.35}));ridge.rotation.z=Math.PI/2;ridge.rotation.y=Math.PI;ridge.position.set(0,(R*th*.82)/2+.15,.05);roof.add(ridge);
 const gut=new T.Mesh(new T.CylinderGeometry(.24,.24,C*tw+.2,20,1,true,Math.PI,Math.PI),new T.MeshStandardMaterial({color:0x9db4c7,metalness:.7,roughness:.3,side:T.DoubleSide}));gut.rotation.z=Math.PI/2;gut.position.set(0,-(R*th*.82)/2-.35,.18);roof.add(gut);
 const hole=new T.Mesh(new T.PlaneGeometry(tw*.96,th),new T.MeshBasicMaterial({color:0x0b131a}));hole.position.set((gx-(C-1)/2)*tw-.25*0,(gy-(R-1)/2)*th*.82,-.02);hole.position.x+=(gy%2)?.25:-.25;roof.add(hole);
 const spare=new T.Mesh(geo,new T.MeshStandardMaterial({color:0x4fd6c8,roughness:.5,metalness:.2,emissive:0x0b4d46,emissiveIntensity:.8}));roof.add(spare);
 const hx=hole.position.x,hy=hole.position.y;let fx=0;
 roof.position.y=.1;
 return {tick(c,dt){const S=c.state;const target=fixed?1:clamp((S.sy-.05)/.6);fx=lerp(fx,reduced?(fixed?1:0):target,reduced?1:.08);
  spare.position.set(hx+(1-fx)*3.2,hy+(1-fx)*2.6,.05+(1-fx)*2.4);spare.rotation.set((1-fx)*.9,(1-fx)*-.6,(1-fx)*.5);
  const mix=new T.Color(0x4fd6c8).lerp(new T.Color(0x3d566d),clamp(fx*1.2));spare.material.color.copy(mix);spare.material.emissiveIntensity=.8*(1-fx);
  if(lab){const t=fx>.97?'ROOF REPAIRED':'ONE TILE HAS SLIPPED';if(lab.textContent!==t)lab.textContent=t}
  const idle=reduced?0:Math.sin(S.t*.5)*.08;
  g.rotation.x=-.62+S.rx*.5+(reduced?0:S.py*.1);g.rotation.y=-.38+S.ry+(reduced?0:S.px*.25)+idle;g.position.y=.1}}
},{fov:32,cam:[0,2,16.5]});
if(btn)btn.addEventListener('click',()=>{fixed=!fixed;btn.setAttribute('aria-pressed',fixed);btn.textContent=fixed?'Slip a tile again':'Replace the slipped tile';if(ctx)ctx.invalidate()});
