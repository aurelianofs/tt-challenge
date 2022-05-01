import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <div className="grow flex">
        <Sidebar />
        <div className="p-5 grow">
          { children }
        </div>
      </div>
    </div>
  )
}
