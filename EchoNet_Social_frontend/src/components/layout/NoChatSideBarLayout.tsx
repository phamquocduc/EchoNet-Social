import type { LayoutPropsType } from "../../types/LayoutPropsType";
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";

export default function NoChatSidebarLayout({ Content }: LayoutPropsType) {
  return (
    <div className="min-h-screen flex flex-col">
       <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex justify-center">{Content}</main>
      </div>
    </div>
  )
}