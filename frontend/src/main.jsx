import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {Sparkles,LayoutDashboard,History,LogOut,ArrowRight,ShieldCheck,Database,Zap,Trash2,CheckCircle2,UserRound} from "lucide-react";
import {request} from "./api";
import "./styles.css";

const storeSession=(data)=>{localStorage.setItem("poc_token",data.token);localStorage.setItem("poc_user",JSON.stringify(data.user));};
const clearSession=()=>{localStorage.removeItem("poc_token");localStorage.removeItem("poc_user");};

function Auth({onAuth}){
 const [mode,setMode]=useState("login"),[form,setForm]=useState({name:"",email:"",password:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError("");try{const data=await request(`/auth/${mode}`,{method:"POST",body:JSON.stringify(form)});storeSession(data);onAuth(data.user);}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <main className="auth-shell"><section className="auth-brand"><div className="logo"><Sparkles size={20}/> Orbit AI</div><div><span className="eyebrow">PYTHON MIGRATION POC</span><h1>One workspace.<br/>Independent identity.<br/><em>Portable AI.</em></h1><p>A complete host application designed to prove that AI intelligence can be integrated without sharing the host's user database.</p></div><div className="trust-row"><span><ShieldCheck/>Own authentication</span><span><Database/>Own database</span><span><Zap/>AI-ready boundary</span></div></section>
 <section className="auth-panel"><form className="auth-card" onSubmit={submit}><div><span className="eyebrow">{mode==="login"?"WELCOME BACK":"CREATE WORKSPACE"}</span><h2>{mode==="login"?"Sign in to Orbit":"Start your account"}</h2><p>{mode==="login"?"Continue to your private AI workspace.":"Your account lives only in the POC database."}</p></div>
 {mode==="register"&&<label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Your name" required/></label>}
 <label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com" required/></label>
 <label>Password<input type="password" minLength="8" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Minimum 8 characters" required/></label>
 {error&&<div className="error">{error}</div>}<button className="primary" disabled={busy}>{busy?"Please wait...":mode==="login"?"Sign in":"Create account"}<ArrowRight size={18}/></button>
 <button type="button" className="text-button" onClick={()=>{setMode(mode==="login"?"register":"login");setError("")}}>{mode==="login"?"New here? Create an account":"Already have an account? Sign in"}</button></form></section></main>
}

function Result({item}){
 const r=item.result||item;
 return <div className="result-card"><div className="result-head"><div className="success-icon"><CheckCircle2/></div><div><span className="eyebrow">GENERATED DIRECTION</span><h2>{r.title}</h2><p>{r.summary}</p></div></div>
 <div className="idea-grid">{(r.ideas||[]).map((x,i)=><article className="idea" key={i}><span>0{i+1}</span><h3>{x.title}</h3><p>{x.angle}</p></article>)}</div>
 <div className="outline"><span className="eyebrow">RECOMMENDED OUTLINE</span>{(r.outline||[]).map((x,i)=><div key={i}><b>{String(i+1).padStart(2,"0")}</b>{x}</div>)}</div></div>
}

function Workspace({user,onLogout}){
 const [view,setView]=useState("studio"),[items,setItems]=useState([]),[latest,setLatest]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [form,setForm]=useState({topic:"",audience:"B2B technology leaders",tone:"Professional"});
 const load=()=>request("/generations").then(x=>setItems(x.items)).catch(e=>setError(e.message));
 useEffect(()=>{load()},[]);
 async function generate(e){e.preventDefault();setBusy(true);setError("");try{const data=await request("/generations",{method:"POST",body:JSON.stringify(form)});setLatest(data);await load();}catch(e){setError(e.message)}finally{setBusy(false)}}
 async function remove(id){try{await request("/generations/"+id,{method:"DELETE"});if(latest?.id===id)setLatest(null);await load()}catch(e){setError(e.message)}}
 return <div className="app-shell"><aside><div className="logo"><Sparkles size={19}/> Orbit AI</div><nav><button className={view==="studio"?"active":""} onClick={()=>setView("studio")}><LayoutDashboard/>AI Studio</button><button className={view==="history"?"active":""} onClick={()=>setView("history")}><History/>History <small>{items.length}</small></button></nav><div className="side-bottom"><div className="user-chip"><div>{user.name[0]?.toUpperCase()}</div><span><b>{user.name}</b><small>{user.email}</small></span></div><button onClick={onLogout}><LogOut/>Sign out</button></div></aside>
 <main className="workspace"><header><div><span className="eyebrow">INDEPENDENT HOST APPLICATION</span><h1>{view==="studio"?"AI Content Studio":"Generation history"}</h1></div><div className="status"><i/> Host DB connected</div></header>
 {error&&<div className="error banner">{error}</div>}
 {view==="studio"?<><section className="hero"><div><span className="pill"><Sparkles/> AI WORKSPACE</span><h2>Turn a rough topic into a <em>clear content direction.</em></h2><p>This POC currently uses its local AI adapter. Later, this exact boundary will call your existing Python AI backend without changing login or the user database.</p></div><div className="boundary"><span>HOST</span><b>Authenticated user</b><ArrowRight/><span>AI BOUNDARY</span><b>Replaceable adapter</b></div></section>
 <section className="studio-grid"><form className="composer" onSubmit={generate}><div className="section-title"><span>01</span><div><h3>What should we create?</h3><p>Give the studio enough context to shape useful directions.</p></div></div><label>Topic or objective<textarea value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} placeholder="e.g. Explain how AI agents can improve B2B sales operations" required minLength="5"/></label><label>Target audience<input value={form.audience} onChange={e=>setForm({...form,audience:e.target.value})}/></label><label>Tone<select value={form.tone} onChange={e=>setForm({...form,tone:e.target.value})}>{["Professional","Executive","Conversational","Technical"].map(x=><option key={x}>{x}</option>)}</select></label><button className="primary" disabled={busy}><Sparkles/>{busy?"Generating direction...":"Generate content direction"}</button></form>
 <div className="architecture"><span className="eyebrow">WHAT THIS PROVES</span><h3>The host remains in control.</h3><div><ShieldCheck/><p><b>Authentication stays here</b><small>Python never receives your password or session token.</small></p></div><div><Database/><p><b>User data stays here</b><small>Accounts and saved results belong to this POC database.</small></p></div><div><Zap/><p><b>AI is replaceable</b><small>The adapter can switch from local mock to Python without rebuilding the product.</small></p></div></div></section>
 {latest&&<Result item={latest}/>}</>:<section className="history-list">{items.length===0?<div className="empty"><History/><h3>No saved generations yet</h3><p>Create your first direction in AI Studio.</p></div>:items.map(x=><article className="history-item" key={x.id} onClick={()=>{setLatest(x);setView("studio")}}><div><span className="eyebrow">{new Date(x.createdAt+"Z").toLocaleString()} · {x.provider}</span><h3>{x.result.title||x.topic}</h3><p>{x.result.summary}</p></div><button onClick={e=>{e.stopPropagation();remove(x.id)}} aria-label="Delete"><Trash2/></button></article>)}</section>}
 </main></div>
}

function App(){const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem("poc_user"))}catch{return null}});useEffect(()=>{if(user&&localStorage.getItem("poc_token"))request("/me").then(x=>setUser(x.user)).catch(()=>{clearSession();setUser(null)})},[]);return user?<Workspace user={user} onLogout={()=>{clearSession();setUser(null)}}/>:<Auth onAuth={setUser}/>;}
createRoot(document.getElementById("root")).render(<App/>);
