const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:5001/api";
const token = () => localStorage.getItem("poc_token");
export async function request(path, options={}) {
  const headers = { "content-type":"application/json", ...(options.headers||{}) };
  if (token()) headers.authorization = `Bearer ${token()}`;
  const res = await fetch(API+path,{...options,headers});
  if (res.status===204) return null;
  const body = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}
