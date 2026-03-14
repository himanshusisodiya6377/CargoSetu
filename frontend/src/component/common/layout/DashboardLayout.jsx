import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../../redux/features/authSlice";
import { Sidebar } from "../../admin/Sidebar";
import { Container } from "../Design";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

const DashboardLayout = ({children}) => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() =>{
    if (!user) {
      dispatch(getUserProfile());
    }
  }, [dispatch, user]);

  const role = user?.role;

  return (
    <div className="mt-24 lg:mt-32 pb-10">
      <Container className="">

        {/* Mobile sidebar toggle */}
        <button onClick={() => setSidebarOpen((o) => !o)} className="lg:hidden mb-4 flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {sidebarOpen ? <AiOutlineClose size={18} /> : <AiOutlineMenu size={18} />}
          {sidebarOpen ? "Close Menu" : "Menu"}
        </button>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Sidebar */}
          <div className={`${sidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-[25%] shadow-s1 py-6 px-5 rounded-lg`}>
            <Sidebar role={role} onNavigate={() => setSidebarOpen(false)} />
          </div>

          {/* Content */}
          <div className="w-full lg:w-[75%] min-w-0 rounded-lg">
            {children}
          </div>

        </div>
      </Container>
    </div>
  );
};

export default DashboardLayout;