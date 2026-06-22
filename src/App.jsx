import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, CalendarBlank, CaretDown, ChatCircle, Check, Copy, MapPin, Phone, ShareNetwork } from "@phosphor-icons/react";

const asset = path => `${import.meta.env.BASE_URL}assets/${path}`;
const scenes = Array.from({ length: 6 }, (_, i) => asset(`scenes/scene-${i + 1}.png`));
const gallery = ["DSC_4728","DSC_4853","DSC_5023","DSC_5245","DSC_5462","DSC_5526","DSC_5681","DSC_5739","DSC_5936","DSC_6207","DSC_6261","DJI_0663"].map(name => ({ name, src: asset(`photos/${name}.jpg`) }));
const couple = [{ label:"신랑", name:"이재모", phone:"010-0000-0001" },{ label:"신부", name:"서현아", phone:"010-0000-0002" }];
const family = {
  groom:[{label:"아버지",name:"이성호",phone:"010-0000-0003"},{label:"어머니",name:"김정희",phone:"010-0000-0004"}],
  bride:[{label:"아버지",name:"서영수",phone:"010-0000-0005"},{label:"어머니",name:"박미경",phone:"010-0000-0006"}],
};
const accounts = {
  groom:[{role:"신랑",name:"이재모",bank:"국민은행",number:"000000-00-000001"},{role:"아버지",name:"이성호",bank:"국민은행",number:"000000-00-000002"},{role:"어머니",name:"김정희",bank:"국민은행",number:"000000-00-000003"}],
  bride:[{role:"신부",name:"서현아",bank:"신한은행",number:"000-000-000001"},{role:"아버지",name:"서영수",bank:"신한은행",number:"000-000-000002"},{role:"어머니",name:"박미경",bank:"신한은행",number:"000-000-000003"}],
};

function Intro(){
  const ref=useRef(null); const [progress,setProgress]=useState(0);
  useEffect(()=>{let frame=0; const update=()=>{const el=ref.current;if(!el)return;const r=el.getBoundingClientRect();setProgress(Math.min(1,Math.max(0,-r.top/(el.offsetHeight-innerHeight))))};const onScroll=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update)};update();addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);return()=>{cancelAnimationFrame(frame);removeEventListener("scroll",onScroll);removeEventListener("resize",onScroll)}},[]);
  const opacity=i=>{
    const distance=Math.abs(progress-i/5);
    const holdRadius=.07;
    const fadeEdge=.11;
    if(distance<=holdRadius)return 1;
    if(distance>=fadeEdge)return 0;
    return 1-(distance-holdRadius)/(fadeEdge-holdRadius);
  };
  const active=Math.min(6,Math.floor(progress*6)+1);
  return <section className="intro" ref={ref} aria-label="두 사람의 시간 이야기"><div className="intro-sticky"><p className="intro-kicker">OUR STORY, IN REVERSE</p>{scenes.map((src,i)=><img key={src} className="scene-image" src={src} alt={`${i+1}번째 시간 장면`} style={{opacity:opacity(i)}} loading={i<2?"eager":"lazy"}/>)}<div className="intro-progress" aria-hidden="true"><span>{String(active).padStart(2,"0")}</span><div><i style={{transform:`scaleX(${progress})`}}/></div><span>06</span></div><div className={`scroll-cue ${progress>.08?"is-hidden":""}`}><ArrowDown size={17}/><span>천천히 스크롤해 주세요</span></div></div></section>
}

function Hero(){return <section className="hero" aria-labelledby="hero-title"><img src={asset("photos/hero.jpg")} alt="푸른 들판에서 서로를 바라보는 이재모와 서현아"/><div className="hero-copy"><p className="hero-edition">THE FIRST EDITION · 2026</p><h1 id="hero-title">WEDDING<br/>INVITATION</h1><div className="hero-names"><span>Jae Mo</span><span>Hyun A</span></div><div className="hero-date hero-date-left"><strong>Sat</strong><strong>Oct</strong><strong>31</strong></div><div className="hero-date hero-date-right"><strong>At</strong><strong>3:00</strong><strong>P.M.</strong></div><p className="hero-caption">We found a beautiful forever<br/>in each other.</p><div className="hero-local"><span>2026년 10월 31일</span><span>토요일 오후 3시</span></div></div></section>}
function SectionTitle({eyebrow,children}){return <header className="section-heading"><p>{eyebrow}</p><h2>{children}</h2></header>}

function Calendar(){const days=useMemo(()=>[...Array(4).fill(null),...Array.from({length:31},(_,i)=>i+1)],[]);return <div className="calendar-card"><div className="calendar-top"><div><span>OCTOBER</span><strong>31</strong></div><p>2026<br/>SATURDAY</p></div><div className="calendar-weekdays">{["S","M","T","W","T","F","S"].map((d,i)=><span key={`${d}-${i}`}>{d}</span>)}</div><div className="calendar-days">{days.map((d,i)=><span key={i} className={d===31?"selected":""}>{d}</span>)}</div></div>}

function Gallery(){return <div className="gallery-grid">{gallery.map((image,i)=><figure key={image.name}><img src={image.src} alt={`웨딩 스냅 ${i+1}`} loading="lazy" draggable="false"/><span>{String(i+1).padStart(2,"0")}</span></figure>)}</div>}

function KakaoMap(){
  const ref=useRef(null);
  useEffect(()=>{
    let timer=0;let attempts=0;
    const render=()=>{
      if(!ref.current||ref.current.dataset.rendered)return;
      if(typeof window.daum?.roughmap?.Lander!=="function"){if(attempts++<30)timer=setTimeout(render,100);return}
      const width=Math.round(ref.current.getBoundingClientRect().width);
      new window.daum.roughmap.Lander({timestamp:"1782099266604",key:"2re2tzvwi6sq",mapWidth:String(width),mapHeight:"280"}).render();
      ref.current.dataset.rendered="true";
    };
    render();
    return()=>clearTimeout(timer);
  },[]);
  return <div className="kakao-map-wrap"><div ref={ref} id="daumRoughmapContainer1782099266604" className="root_daum_roughmap root_daum_roughmap_landing" aria-label="광명아이벡스컨벤션 카카오 지도"/></div>;
}

function ContactRow({contact}){return <div className="contact-row"><div><small>{contact.label}</small><strong>{contact.name}</strong></div><div className="contact-actions"><a href={`tel:${contact.phone}`} aria-label={`${contact.name}에게 전화`}><Phone size={19}/></a><a href={`sms:${contact.phone}`} aria-label={`${contact.name}에게 문자`}><ChatCircle size={19}/></a></div></div>}
function AccountGroup({title,list,onCopy}){const[open,setOpen]=useState(false);return <div className={`account-group ${open?"open":""}`}><button className="account-toggle" onClick={()=>setOpen(!open)} aria-expanded={open}><span>{title}</span><CaretDown size={18}/></button>{open&&<div className="account-list">{list.map(a=><div className="account-row" key={a.number}><div><small>{a.role} · {a.name}</small><p>{a.bank} {a.number}</p></div><button onClick={()=>onCopy(a.number)} aria-label={`${a.name} 계좌번호 복사`}><Copy size={18}/></button></div>)}</div>}</div>}

function App(){
  const[toast,setToast]=useState(""); const notify=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
  const copyText=async(text,message="복사되었습니다")=>{try{await navigator.clipboard.writeText(text);notify(message)}catch{notify("복사하지 못했습니다")}};
  const share=async()=>{const data={title:"이재모 · 서현아의 결혼식",text:"2026년 10월 31일 오후 3시, 광명아이벡스컨벤션",url:location.href};if(navigator.share){try{await navigator.share(data)}catch{}}else copyText(location.href,"청첩장 링크가 복사되었습니다")};
  return <main>
    <Intro/><Hero/>
    <section className="invitation-section section-pad"><SectionTitle eyebrow="INVITATION">우리, 결혼합니다</SectionTitle><p className="invitation-copy">오랜 시간 서로의 곁을 지켜온 두 사람이<br/>이제 같은 방향을 바라보며 한 가족이 되려 합니다.<br/><br/>저희의 새로운 시작을 함께해 주시고<br/>따뜻한 마음으로 축복해 주세요.</p><div className="family-line"><p><span>이성호 · 김정희</span>의 장남 <strong>이재모</strong></p><p><span>서영수 · 박미경</span>의 차녀 <strong>서현아</strong></p></div></section>
    <section className="date-section section-pad"><SectionTitle eyebrow="THE DATE">시월의 마지막 토요일</SectionTitle><p className="date-lead">2026년 10월 31일 토요일<br/><strong>오후 3시</strong></p><Calendar/><a className="calendar-link" href={`${import.meta.env.BASE_URL}wedding-calendar.ics`} download="이재모-서현아-결혼식.ics" type="text/calendar"><CalendarBlank size={18}/> 휴대폰 캘린더에 저장</a></section>
    <section className="gallery-section section-pad"><SectionTitle eyebrow="OUR MOMENTS">빛나는 장면들</SectionTitle><p className="section-note">두 사람이 함께한 소중한 순간들입니다.</p><Gallery/></section>
    <section className="location-section section-pad"><SectionTitle eyebrow="LOCATION">오시는 길</SectionTitle><div className="venue-name"><strong>광명아이벡스컨벤션</strong><span>AK플라자 광명점 5층</span></div><p className="address">경기 광명시 양지로 17</p><KakaoMap/><div className="map-actions"><a href="https://map.naver.com/p/search/%EA%B4%91%EB%AA%85%EC%95%84%EC%9D%B4%EB%B2%A1%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98" target="_blank" rel="noreferrer"><MapPin size={18}/>네이버 지도</a><a href="https://map.kakao.com/?q=%EA%B4%91%EB%AA%85%EC%95%84%EC%9D%B4%EB%B2%A1%EC%8A%A4%EC%BB%A8%EB%B2%A4%EC%85%98" target="_blank" rel="noreferrer"><MapPin size={18}/>카카오맵</a></div><div className="transit-note"><small>TRANSPORTATION</small><p>교통 및 주차 안내는 최종 정보 확인 후 업데이트될 예정입니다.</p></div></section>
    <section className="contact-section section-pad"><SectionTitle eyebrow="CONTACT">축하의 마음 전하기</SectionTitle><div className="couple-contact">{couple.map(c=><ContactRow key={c.name} contact={c}/>)}</div><div className="family-contact-columns"><div><h3>신랑측 혼주</h3>{family.groom.map(c=><ContactRow key={c.name} contact={c}/>)}</div><div><h3>신부측 혼주</h3>{family.bride.map(c=><ContactRow key={c.name} contact={c}/>)}</div></div></section>
    <section className="account-section section-pad"><SectionTitle eyebrow="FOR YOUR HEART">마음 전하실 곳</SectionTitle><p className="section-note">축하의 마음을 전해주시는 모든 분께 감사드립니다.</p><div className="accounts"><AccountGroup title="신랑측 계좌번호" list={accounts.groom} onCopy={copyText}/><AccountGroup title="신부측 계좌번호" list={accounts.bride} onCopy={copyText}/></div></section>
    <section className="closing-section"><img src={asset("photos/DSC_6207.jpg")} alt="함께 웃는 이재모와 서현아" loading="lazy"/><div className="closing-card"><p>저희의 소중한 날을<br/>함께해 주셔서 감사합니다.</p><span>보내주신 따뜻한 마음을 오래도록 간직하며<br/>서로 아끼고 사랑하며 잘 살아가겠습니다.</span><strong>이재모 · 서현아 드림</strong></div></section>
    <footer><p>JAE MO <i>&</i> HYUN A</p><button onClick={share}><ShareNetwork size={18}/> 청첩장 공유하기</button><small>2026. 10. 31 · GWANGMYEONG</small></footer>
    <div className={`toast ${toast?"show":""}`} role="status"><Check size={16}/>{toast}</div>
  </main>
}
export { App };
