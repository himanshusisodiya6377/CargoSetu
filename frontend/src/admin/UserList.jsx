import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../redux/features/authSlice";
import { useEffect, useState } from "react";
import { User2 } from "../component/hero/Hero";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

const ROLE_COLORS ={
  Sender: "bg-blue-100 text-blue-700",
  Driver: "bg-green-100 text-green-700",
  Admin: "bg-purple-100 text-purple-700",
};

const UserList = () =>{
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.auth);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, userId: null, userName: ""});

  useEffect(() =>{
    if (!users) dispatch(getAllUsers());
  },[dispatch]);

  const confirmDelete = (user)=>
    setDeleteConfirm({ open: true, userId: user._id, userName: user.name });

  const handleDelete = async ()=>{
    const result = await dispatch(deleteUser(deleteConfirm.userId));
    if (!result.error) toast.success("User deleted successfully");
    else toast.error(result.payload);
    setDeleteConfirm({open: false, userId: null, userName: ""});
  };

  return (
    <section className="shadow-s1 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
        <button onClick={() => dispatch(getAllUsers())} className="text-sm text-green hover:underline">Refresh</button>
      </div>
      <hr />

      {isLoading && !users ? (
        <p className="text-center text-gray_100 py-8">Loading users...</p>) : !users || users.length === 0 ? (<p className="text-center text-gray_100 py-8">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray_100 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) =>(
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={user.photo || User2} alt={user.name} className="w-9 h-9 rounded-full object-cover shrink-0"/>
                      <span className="font-medium text-gray-800 capitalize">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray_100">{user.email}</td>
                  <td className="px-4 py-3 text-gray_100">{user.phone || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray_100 text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => confirmDelete(user)} title="Delete user" className="p-1.5 rounded text-red-500 hover:bg-red-50">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/*Delete Confirm Modal*/}
      {deleteConfirm.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-semibold text-gray-800">Delete User?</h3>
            <p className="text-sm text-gray_100">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-800 capitalize">{deleteConfirm.userName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm({ open: false, userId: null, userName: "" })} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserList;
