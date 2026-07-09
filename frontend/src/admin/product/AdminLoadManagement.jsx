import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminLoads,deleteAdminLoad,fetchLoadBids,deleteBidAdmin} from "../../redux/features/loadSlice";
import { NavLink } from "react-router-dom";
import { FiTrash2, FiEye } from "react-icons/fi";
import { TbGavel } from "react-icons/tb";

const STATUS_COLORS ={
  OPEN: "bg-blue-100 text-blue-700",
  BIDDING: "bg-yellow-100 text-yellow-700",
  ENDED: "bg-gray-100 text-gray-600",
  ASSIGNED: "bg-purple-100 text-purple-700",
  IN_TRANSIT: "bg-orange-100 text-orange-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export const AdminLoadManagement = () =>{
  const dispatch = useDispatch();
  const {adminLoads, loadBids, isLoading} = useSelector((state) => state.load);

  // Bids modal state
  const [bidsModal, setBidsModal] = useState({open: false, loadId: null, loadTitle: ""});
  // Confirm delete load
  const [deleteConfirm, setDeleteConfirm] = useState({open: false, loadId: null});

  useEffect(() =>{
    dispatch(fetchAdminLoads());
  },[dispatch]);

  const confirmDeleteLoad = (id) => setDeleteConfirm({open: true, loadId: id});

  const handleDeleteLoad = async () => {
    await dispatch(deleteAdminLoad(deleteConfirm.loadId));
    setDeleteConfirm({ open: false, loadId: null });
  };

  //── View / delete bids
  const openBidsModal = (load) =>{
    setBidsModal({open: true, loadId: load._id, loadTitle: load.title});
    dispatch(fetchLoadBids(load._id))};

  const handleDeleteBid = (bidId) =>dispatch(deleteBidAdmin(bidId));

  return (
    <section className="shadow-s1 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">All Loads</h2>
        <button onClick={() => dispatch(fetchAdminLoads())} className="text-sm text-green hover:underline">Refresh</button>
      </div>
      <hr />

      {isLoading ? (<p className="text-center text-gray_100 py-8">Loading loads...</p>) : adminLoads.length === 0 ? (<p className="text-center text-gray_100 py-8">No loads found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray_100 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Bids</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {adminLoads.map((load) =>(
                <tr key={load._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 max-w-[160px] truncate">
                    <NavLink to={`/load/${load._id}`} className="hover:text-green hover:underline">{load.title}</NavLink>
                  </td>
                  <td className="px-4 py-3 text-gray_100">
                    {load.sender?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray_100 text-xs">
                    {load.pickupLocation} → {load.dropLocation}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[load.status] ?? "bg-gray-100 text-gray-600"}`}>{load.status?.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-gray_100">{load.totalBids ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {/* View bids */}
                      <button onClick={() => openBidsModal(load)} title="View bids" className="p-1.5 rounded text-blue-600 hover:bg-blue-50">
                        <TbGavel size={16} />
                      </button>
                      {/* View detail */}
                      <NavLink to={`/load/${load._id}`} title="View details" className="p-1.5 rounded text-gray-500 hover:bg-gray-100"><FiEye size={16} /></NavLink>
                      {/* Delete */}
                      <button onClick={() => confirmDeleteLoad(load._id)} title="Delete load" className="p-1.5 rounded text-red-500 hover:bg-red-50">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
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
            <h3 className="text-base font-semibold text-gray-800">Delete Load?</h3>
            <p className="text-sm text-gray_100">
              This will permanently delete the load and all associated bids. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteLoad} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm({ open: false, loadId: null })} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bids Modal*/}
      {bidsModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800 truncate pr-4">
                Bids — {bidsModal.loadTitle}
              </h3>
              <button onClick={() => setBidsModal({open: false, loadId: null, loadTitle: ""})} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                ✕
              </button>
            </div>

            {isLoading ? (<p className="text-center text-gray_100 py-6">Loading bids...</p>) : loadBids.length === 0 ? (
              <p className="text-center text-gray_100 py-6">No bids placed yet.</p>
            ) : (
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray_100 uppercase text-xs sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Driver</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Amount (₹)</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loadBids.map((bid) => (
                      <tr key={bid._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {bid.driver?.name || "—"}
                        </td>
                        <td className="px-4 py-3 text-gray_100 text-xs">
                          {bid.driver?.email || "—"}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          ₹{bid.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bid.status === "WON" ? "bg-green-100 text-green-700" : bid.status === "LOST" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
                            {bid.status ?? "ACTIVE"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray_100 text-xs">
                          {bid.createdAt ? new Date(bid.createdAt).toLocaleString(): "—"}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteBid(bid._id)} title="Delete bid" className="p-1.5 rounded text-red-500 hover:bg-red-50">
                            <FiTrash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminLoadManagement;
