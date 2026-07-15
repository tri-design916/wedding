import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowClockwise, CalendarBlank, CaretDown, CaretLeft, CaretRight, ChatCircle, Check, Copy, Phone, ShareNetwork, X } from "@phosphor-icons/react";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const asset = path => `${import.meta.env.BASE_URL}assets/${path}`;
const gallery = Array.from({ length: 15 }, (_, i) => ({ name: `gallery-${String(i + 1).padStart(2, "0")}`, src: asset(`gallery/gallery-${String(i + 1).padStart(2, "0")}.jpg`) }));
const couple = [{ label:"신랑", name:"이재모", phone:"010-9228-4689" },{ label:"신부", name:"서현아", phone:"010-6619-6100" }];
const family = {
  groom:[{label:"아버지",name:"이한수",phone:"010-9196-6138"},{label:"어머니",name:"김용선",phone:"010-9126-4689"}],
  bride:[{label:"아버지",name:"서정호",phone:"010-3580-9693"},{label:"어머니",name:"이세실리아",phone:"010-7648-8843"}],
};
const accounts = {
  groom:[{role:"신랑",name:"이재모",bank:"신한은행",number:"110-437-874920"},{role:"아버지",name:"이한수",bank:"국민은행",number:"390402-04-137933"},{role:"어머니",name:"김용선",bank:"신한은행",number:"110-426-35944"}],
  bride:[{role:"신부",name:"서현아",bank:"토스",number:"1000-1431-6249"},{role:"아버지",name:"서정호",bank:"하나은행",number:"252-18-108710"},{role:"어머니",name:"이세실리아",bank:"기업은행",number:"194-068715-02-017"}],
};

function Intro(){
  const videoRef=useRef(null); const [ended,setEnded]=useState(false); const [needsTap,setNeedsTap]=useState(false);
  useEffect(()=>{
    const video=videoRef.current;
    if(!video||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    video.play().catch(()=>setNeedsTap(true));
  },[]);
  const replay=()=>{const video=videoRef.current;if(!video)return;video.currentTime=0;video.play().catch(()=>{});setEnded(false)};
  const tapToPlay=()=>{const video=videoRef.current;if(!video)return;video.play().then(()=>setNeedsTap(false)).catch(()=>{})};
  return <section className="intro" aria-label="두 사람의 시간 이야기">
    <p className="intro-kicker">OUR STORY, IN REVERSE</p>
    <video ref={videoRef} className="intro-video" src={asset("photos/intro.mp4")} autoPlay muted playsInline preload="auto" poster={asset("photos/intro-poster.jpg")} onEnded={()=>setEnded(true)}/>
    {needsTap&&!ended&&<button className="intro-replay" onClick={tapToPlay} aria-label="영상 재생"><ArrowClockwise size={22}/></button>}
    {ended&&<button className="intro-replay" onClick={replay} aria-label="영상 다시 재생"><ArrowClockwise size={22}/></button>}
  </section>
}

function Hero(){return <section className="hero" aria-labelledby="hero-title"><img src={asset("photos/hero.jpg")} alt="푸른 들판에서 서로를 바라보는 이재모와 서현아"/><div className="hero-copy"><p className="hero-edition">THE FIRST EDITION · 2026</p><h1 id="hero-title">WEDDING<br/>INVITATION</h1><div className="hero-names"><span>Jae Mo</span><span>Hyeon A</span></div><div className="hero-date hero-date-left"><strong>Sat</strong><strong>Oct</strong><strong>31</strong></div><div className="hero-date hero-date-right"><strong>At</strong><strong>3:00</strong><strong>P.M.</strong></div></div></section>}
function SectionTitle({eyebrow,children}){
  const ref=useRef(null); const [shown,setShown]=useState(false);
  useEffect(()=>{
    const el=ref.current;
    if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches){setShown(true);return}
    const io=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){setShown(true);io.disconnect()}},{threshold:.4});
    io.observe(el);
    return()=>io.disconnect();
  },[]);
  return <header ref={ref} className={`section-heading ${shown?"is-shown":""}`}><p>{eyebrow}</p><h2>{children}</h2></header>
}

function Calendar(){const days=useMemo(()=>[...Array(4).fill(null),...Array.from({length:31},(_,i)=>i+1)],[]);return <div className="calendar-card"><div className="calendar-top"><div><span>OCTOBER</span><strong>31</strong></div><p>2026<br/>SATURDAY</p></div><div className="calendar-weekdays">{["S","M","T","W","T","F","S"].map((d,i)=><span key={`${d}-${i}`}>{d}</span>)}</div><div className="calendar-days">{days.map((d,i)=><span key={i} className={d===31?"selected":""}>{d}</span>)}</div></div>}

function Gallery(){
  const[openIndex,setOpenIndex]=useState(null);
  const touchRef=useRef({x:0,swiped:false});
  useEffect(()=>{
    if(openIndex===null)return;
    const onKey=e=>{if(e.key==="Escape")setOpenIndex(null)};
    addEventListener("keydown",onKey);
    return()=>removeEventListener("keydown",onKey);
  },[openIndex]);
  const onTouchStart=e=>{touchRef.current={x:e.touches[0].clientX,swiped:false}};
  const onTouchMove=e=>{if(Math.abs(e.touches[0].clientX-touchRef.current.x)>10)touchRef.current.swiped=true};
  const onTouchEnd=e=>{
    const dx=e.changedTouches[0].clientX-touchRef.current.x;
    if(Math.abs(dx)>50)setOpenIndex(i=>Math.min(gallery.length-1,Math.max(0,i+(dx<0?1:-1))));
  };
  const onLightboxClick=()=>{
    if(touchRef.current.swiped){touchRef.current.swiped=false;return}
    setOpenIndex(null);
  };
  const go=(delta,e)=>{e.stopPropagation();setOpenIndex(i=>Math.min(gallery.length-1,Math.max(0,i+delta)))};
  return <>
    <div className="gallery-grid">{gallery.map((image,i)=><figure key={image.name}><img src={image.src} alt={`웨딩 스냅 ${i+1}`} loading="lazy" draggable="false" onClick={()=>setOpenIndex(i)}/></figure>)}</div>
    {openIndex!==null&&<div className="gallery-lightbox" role="dialog" aria-modal="true" onClick={onLightboxClick} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <img src={gallery[openIndex].src} alt={`웨딩 스냅 ${openIndex+1}`} draggable="false"/>
      {openIndex>0&&<button className="lightbox-nav lightbox-prev" onClick={e=>go(-1,e)} aria-label="이전 사진"><CaretLeft size={22}/></button>}
      {openIndex<gallery.length-1&&<button className="lightbox-nav lightbox-next" onClick={e=>go(1,e)} aria-label="다음 사진"><CaretRight size={22}/></button>}
      <span className="lightbox-count" aria-hidden="true">{openIndex+1} / {gallery.length}</span>
    </div>}
  </>
}

function LocationImage(){
  const[open,setOpen]=useState(false);
  const[scale,setScale]=useState(1);
  const[pos,setPos]=useState({x:0,y:0});
  const gestureRef=useRef({});
  const lastTapRef=useRef(0);
  useEffect(()=>{
    if(!open)return;
    const onKey=e=>{if(e.key==="Escape")setOpen(false)};
    addEventListener("keydown",onKey);
    return()=>removeEventListener("keydown",onKey);
  },[open]);
  const openLightbox=()=>{setScale(1);setPos({x:0,y:0});setOpen(true)};
  const dist=(t1,t2)=>Math.hypot(t1.clientX-t2.clientX,t1.clientY-t2.clientY);
  const onTouchStart=e=>{
    const g=gestureRef.current;
    if(e.touches.length===2){
      g.pinching=true; g.moved=false;
      g.startDist=dist(e.touches[0],e.touches[1]); g.startScale=scale;
    } else if(e.touches.length===1){
      g.pinching=false; g.moved=false;
      g.startX=e.touches[0].clientX; g.startY=e.touches[0].clientY; g.startPos={...pos};
    }
  };
  const onTouchMove=e=>{
    const g=gestureRef.current;
    if(e.touches.length===2&&g.pinching){
      const d=dist(e.touches[0],e.touches[1]);
      setScale(Math.min(4,Math.max(1,g.startScale*(d/g.startDist))));
      g.moved=true;
    } else if(e.touches.length===1&&scale>1){
      const dx=e.touches[0].clientX-g.startX, dy=e.touches[0].clientY-g.startY;
      if(Math.abs(dx)>5||Math.abs(dy)>5)g.moved=true;
      setPos({x:g.startPos.x+dx,y:g.startPos.y+dy});
    }
  };
  const onTouchEnd=e=>{
    const g=gestureRef.current;
    if(scale<1.02&&scale!==1){setScale(1);setPos({x:0,y:0})}
    if(e.touches.length===0&&!g.moved){
      const now=Date.now();
      if(now-lastTapRef.current<300){
        if(scale>1){setScale(1);setPos({x:0,y:0})}else{setScale(2.4)}
      }
      lastTapRef.current=now;
    }
  };
  return <>
    <img className="location-image" src={asset("photos/location.png")} alt="광명아이벡스컨벤션 위치 및 오시는 길 안내" onClick={openLightbox} role="button" tabIndex={0}/>
    {open&&<div className="location-lightbox" role="dialog" aria-modal="true" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <button className="location-lightbox-close" onClick={()=>setOpen(false)} aria-label="닫기"><X size={20}/></button>
      <img src={asset("photos/location.png")} alt="광명아이벡스컨벤션 위치 및 오시는 길 안내 확대" draggable="false" style={{transform:`translate(${pos.x}px, ${pos.y}px) scale(${scale})`}}/>
    </div>}
  </>
}

function ContactRow({contact}){return <div className="contact-row"><div><small>{contact.label}</small><strong>{contact.name}</strong></div><div className="contact-actions"><a href={`tel:${contact.phone}`} aria-label={`${contact.name}에게 전화`}><Phone size={19}/></a><a href={`sms:${contact.phone}`} aria-label={`${contact.name}에게 문자`}><ChatCircle size={19}/></a></div></div>}
function AccountGroup({title,list,onCopy}){const[open,setOpen]=useState(false);return <div className={`account-group ${open?"open":""}`}><button className="account-toggle" onClick={()=>setOpen(!open)} aria-expanded={open}><span>{title}</span><CaretDown size={18}/></button>{open&&<div className="account-list">{list.map(a=><div className="account-row" key={a.number}><div><small>{a.role} · {a.name}</small><p>{a.bank} {a.number}</p></div><button onClick={()=>onCopy(a.number)} aria-label={`${a.name} 계좌번호 복사`}><Copy size={18}/></button></div>)}</div>}</div>}

function formatEntryDate(ts){
  if(!ts)return "";
  const d=ts.toDate();
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,"0")}.${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function Guestbook(){
  const[entries,setEntries]=useState([]);
  const[name,setName]=useState(""); const[message,setMessage]=useState("");
  const[submitting,setSubmitting]=useState(false); const[error,setError]=useState("");
  useEffect(()=>{
    if(!db)return;
    const q=query(collection(db,"guestbook"),orderBy("createdAt","desc"));
    const unsub=onSnapshot(q,snap=>setEntries(snap.docs.map(d=>({id:d.id,...d.data()}))),()=>setError("방명록을 불러오지 못했습니다"));
    return unsub;
  },[]);
  const submit=async e=>{
    e.preventDefault();
    if(!db||!name.trim()||!message.trim())return;
    setSubmitting(true); setError("");
    try{
      await addDoc(collection(db,"guestbook"),{name:name.trim().slice(0,20),message:message.trim().slice(0,200),createdAt:serverTimestamp()});
      setName(""); setMessage("");
    }catch{setError("등록하지 못했습니다. 잠시 후 다시 시도해 주세요")}
    finally{setSubmitting(false)}
  };
  return <div className="guestbook">
    <form className="guestbook-form" onSubmit={submit}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="이름" maxLength={20} required/>
      <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="따뜻한 축하의 한마디를 남겨주세요" maxLength={200} rows={3} required/>
      <button type="submit" disabled={submitting}>{submitting?"등록 중...":"방명록 남기기"}</button>
      {error&&<p className="guestbook-error">{error}</p>}
    </form>
    <div className="guestbook-list">
      {entries.length===0?<p className="guestbook-empty">아직 남겨진 메시지가 없습니다. 첫 메시지를 남겨주세요.</p>:entries.map(e=><div className="guestbook-entry" key={e.id}><div className="guestbook-entry-head"><strong>{e.name}</strong><time>{formatEntryDate(e.createdAt)}</time></div><p>{e.message}</p></div>)}
    </div>
  </div>
}

function App(){
  const[toast,setToast]=useState(""); const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
  const copyText=async(text,message="복사되었습니다")=>{try{await navigator.clipboard.writeText(text);notify(message)}catch{notify("복사하지 못했습니다")}};
  const share=async()=>{const data={title:"이재모 · 서현아의 결혼식",text:"2026년 10월 31일 오후 3시, 광명아이벡스컨벤션",url:location.href};if(navigator.share){try{await navigator.share(data)}catch{}}else copyText(location.href,"청첩장 링크가 복사되었습니다")};
  return <main>
    <Intro/><Hero/>
    <section className="invitation-section section-pad"><SectionTitle eyebrow="INVITATION">우리, 결혼합니다</SectionTitle><p className="invitation-copy">오랜 시간 서로의 곁을 지켜온 두 사람이<br/>이제 같은 방향을 바라보며 한 가족이 되려 합니다.<br/><br/>저희의 새로운 시작을 함께해 주시고<br/>따뜻한 마음으로 축복해 주세요.</p><div className="family-line"><p><span>이한수 · 김용선</span>의 장남 <strong>이재모</strong></p><p><span>서정호 · 이세실리아</span>의 차녀 <strong>서현아</strong></p></div></section>
    <section className="date-section section-pad"><SectionTitle eyebrow="THE DATE">시월의 마지막 토요일</SectionTitle><p className="date-lead">2026년 10월 31일 토요일<br/><strong>오후 3시</strong></p><Calendar/><a className="calendar-link" href={`${import.meta.env.BASE_URL}wedding-calendar.ics`} download="이재모-서현아-결혼식.ics" type="text/calendar"><CalendarBlank size={18}/> 휴대폰 캘린더에 저장</a></section>
    <section className="gallery-section section-pad"><SectionTitle eyebrow="OUR MOMENTS">빛나는 장면들</SectionTitle><p className="section-note">두 사람이 함께한 소중한 순간들입니다.</p><Gallery/></section>
    <section className="location-section section-pad"><SectionTitle eyebrow="LOCATION">오시는 길</SectionTitle><div className="venue-name"><strong>광명아이벡스컨벤션</strong><span>AK플라자 광명점 5층</span></div><p className="address">경기 광명시 양지로 17</p><LocationImage/><p className="cafe-note">※ 카페 폴바셋 청첩장 지참시 10% 할인 (폴바셋 AK플라자 광명점 한정)</p><div className="map-actions"><a href="https://map.naver.com/p/search/%EA%B4%91%EB%AA%85%EC%95%84%EC%9D%B4%EB%B2%A1%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98" target="_blank" rel="noreferrer">네이버지도로 보기</a><a href="https://map.kakao.com/?q=%EA%B4%91%EB%AA%85%EC%95%84%EC%9D%B4%EB%B2%A1%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98" target="_blank" rel="noreferrer">카카오맵으로 보기</a></div></section>
    <section className="contact-section section-pad"><SectionTitle eyebrow="CONTACT">축하의 마음 전하기</SectionTitle><div className="couple-contact">{couple.map(c=><ContactRow key={c.name} contact={c}/>)}</div><div className="family-contact-columns"><div><h3>신랑측 혼주</h3>{family.groom.map(c=><ContactRow key={c.name} contact={c}/>)}</div><div><h3>신부측 혼주</h3>{family.bride.map(c=><ContactRow key={c.name} contact={c}/>)}</div></div></section>
    <section className="account-section section-pad"><SectionTitle eyebrow="FOR YOUR HEART">마음 전하실 곳</SectionTitle><p className="section-note">축하의 마음을 전해주시는 모든 분께 감사드립니다.</p><div className="accounts"><AccountGroup title="신랑측 계좌번호" list={accounts.groom} onCopy={copyText}/><AccountGroup title="신부측 계좌번호" list={accounts.bride} onCopy={copyText}/></div></section>
    <section className="guestbook-section section-pad"><SectionTitle eyebrow="GUESTBOOK">방명록</SectionTitle><p className="section-note">축하의 마음을 자유롭게 남겨주세요.</p><Guestbook/></section>
    <footer><p className="footer-eyebrow">THANK YOU</p><p className="footer-names">JAE MO <i>&</i> HYEON A</p><button onClick={share}><ShareNetwork size={18}/> 청첩장 공유하기</button><small>2026. 10. 31 · GWANGMYEONG</small></footer>
    <div className={`toast ${toast?"show":""}`} role="status"><Check size={16}/>{toast}</div>
  </main>
}
export { App };
