import type { LayoutPropsType } from "../../types/LayoutPropsType";
import Header from "./header/Header";
import ChatSidebar from "./sidebar/ChatSidebar";
import Sidebar from "./sidebar/Sidebar";

export default function DefaultLayout({ Content }: LayoutPropsType) {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex justify-center">
          {Content}
        </main>
        <ChatSidebar />
      </div>
    </div>
  )
}