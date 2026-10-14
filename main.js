// Starfield + typewriter + nav + carousel + reveal + telemetry
(function(){
  // Starfield
  const c = document.getElementById('starfield');
  if(c){
    const ctx = c.getContext('2d');
    let stars=[], shoot=null, W,H;
    function resize(){ W=c.width=innerWidth; H=c.height=innerHeight;
      stars = Array.from({length: Math.min(280, W*H/6000)}, ()=>({
        x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.6+.3,
        p:Math.random()*Math.PI*2, s:.5+Math.random()*1.5 }));
    }
    resize(); addEventListener('resize', resize);
    function frame(t){
      ctx.clearRect(0,0,W,H);
      for(const s of stars){
        s.p+=.02*s.s;
        const tw = .4+.6*Math.abs(Math.sin(s.p));
        ctx.globalAlpha=tw; ctx.fillStyle='#dbeafe';
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,7); ctx.fill();
      }
      ctx.globalAlpha=1;
      if(!shoot && Math.random()<.006) shoot={x:Math.random()*W, y:Math.random()*H*.4, vx:7, vy:3, life:1};
      if(shoot){
        ctx.strokeStyle='rgba(103,232,249,'+shoot.life+')'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(shoot.x,shoot.y);
        ctx.lineTo(shoot.x-60*shoot.life, shoot.y-26*shoot.life); ctx.stroke();
        shoot.x+=shoot.vx; shoot.y+=shoot.vy; shoot.life-=.02;
        if(shoot.life<=0) shoot=null;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  // Mobile nav
  const btn=document.getElementById('menuBtn'), links=document.getElementById('navLinks');
  if(btn&&links) btn.onclick=()=>links.classList.toggle('open');

  // Typewriter
  const tw=document.getElementById('typewriter');
  const phrases=[
    '> initializing orbital portfolio... OK',
    '> field: astrophysical systems engineering',
    '> speciality: exoplanet data • orbital mechanics • full-stack telemetry',
    '> status: open to collaboration across the galaxy'
  ];
  if(tw){
    let pi=0, ci=0, del=false;
    (function tick(){
      const full=phrases[pi];
      tw.textContent = del ? full.slice(0,--ci) : full.slice(0,++ci);
      let d = del?22:45;
      if(!del && ci===full.length){ d=1200; del=true; }
      else if(del && ci===0){ del=false; pi=(pi+1)%phrases.length; d=350; }
      setTimeout(tick,d);
    })();
  }

  // Reveal on scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Skill bars
  const bars=document.querySelectorAll('.bar i');
  const io2=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ e.target.style.width=e.target.dataset.w+'%'; io2.unobserve(e.target); }
  }),{threshold:.4});
  bars.forEach(b=>io2.observe(b));

  // Fake telemetry
  const tel=document.getElementById('telemetryLive');
  if(tel){
    setInterval(()=>{
      const alt=(408+Math.random()*2).toFixed(2);
      const vel=(7.66+Math.random()*.02).toFixed(3);
      const sig=(98+Math.random()*2).toFixed(1);
      tel.innerHTML=`ALT ${alt} km &nbsp;•&nbsp; VEL ${vel} km/s<br>SIG ${sig}% &nbsp;•&nbsp; SOL ${ (1360+Math.random()*4).toFixed(1)} W/m²<br>UPTIME ${(Math.random()*99+1).toFixed(4)}%`;
    },1200);
  }

  // Carousel
  const track=document.getElementById('slideTrack');
  if(track){
    const slides=[...track.children], dotsBox=document.getElementById('dots');
    let i=0, timer;
    slides.forEach((_,k)=>{
      const d=document.createElement('button');
      d.setAttribute('aria-label','Go to slide '+(k+1));
      d.onclick=()=>go(k,true);
      dotsBox.appendChild(d);
    });
    const dots=[...dotsBox.children];
    function go(k, manual){
      i=(k+slides.length)%slides.length;
      track.style.transform=`translateX(-${i*100}%)`;
      dots.forEach((d,j)=>d.classList.toggle('on',j===i));
      document.getElementById('capCount').textContent=(i+1)+' / '+slides.length;
      if(manual) restart();
    }
    function restart(){ clearInterval(timer); timer=setInterval(()=>go(i+1),4500); }
    document.getElementById('prevBtn').onclick=()=>go(i-1,true);
    document.getElementById('nextBtn').onclick=()=>go(i+1,true);
    go(0); restart();
  }

  // Contact fake send
  const f=document.getElementById('contactForm');
  if(f) f.addEventListener('submit',e=>{
    e.preventDefault();
    document.getElementById('formMsg').textContent='✓ Transmission received. Signal bounced off Europa and back. I will reply within 24 light-hours.';
    f.reset();
  });

  // Footer year
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // Light / dark mode toggle (persisted)
  const tb=document.getElementById('themeBtn');
  function setTheme(light){
    document.body.classList.toggle('light',light);
    if(tb) tb.textContent=light?'☀️':'🌙';
    try{ localStorage.setItem('cosmos-theme',light?'light':'dark'); }catch(e){}
  }
  if(tb){
    let saved=null; try{ saved=localStorage.getItem('cosmos-theme'); }catch(e){}
    setTheme(saved==='light');
    tb.onclick=()=>setTheme(!document.body.classList.contains('light'));
  }
})();
