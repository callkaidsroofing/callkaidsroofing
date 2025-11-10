import { Link, useLocation } from "react-router-dom";
export default function Breadcrumbs(){
  const parts = useLocation().pathname.split("/").filter(Boolean);
  const crumbs = parts.map((p,i)=>({ name:p, path:"/"+parts.slice(0,i+1).join("/") }));
  return (
    <nav className="text-sm">
      <Link to="/internal/v2/home" className="underline">Home</Link>
      {crumbs.map(c=> <span key={c.path}> / <Link to={c.path} className="underline">{c.name}</Link></span>)}
    </nav>
  );
}
