import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBids, updateMyBid, deleteMyBid } from "../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../hooks/useRedirectLoggedOutUser";
import { useWebSocket } from "../../hooks/useWebSocket";
import { FaTrash, FaEdit } from "react-icons/fa";
import { STATUS_COLORS as STATUS_BADGE } from "../../utils/data";

const MyBids = ()=>{
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.load);
  const [editing, setEditing] = useState({});

  useEffect(()=>{
    dispatch(fetchMyBids());
  },[dispatch]);

  useWebSocket(null, {
    bidWon: useCallback(() => { dispatch(fetchMyBids()); }, [dispatch]),
    loadUpdate: useCallback(() => { dispatch(fetchMyBids()); }, [dispatch]),
    loadStatusChange: useCallback(() => { dispatch(fetchMyBids()); }, [dispatch]),
  });

  const canModify =(bid)=>
    bid.load?.status === "OPEN" && new Date(bid.load?.bidEndTime) > new Date();

  const startEdit =(bid)=>
    setEditing((prev)=>({...prev, [bid._id]: String(bid.amount)}));

  const cancelEdit =(id)=>
    setEditing((prev) =>{const n = { ...prev}; delete n[id];return n});

  const submitEdit = (bid)=>{
    const amount = Number(editing[bid._id]);
    if(!amount || amount <= 0) return;
    dispatch(updateMyBid({ id: bid._id, amount })).then((res) =>{
      if(res.meta.requestStatus === "fulfilled") cancelEdit(bid._id);
    })};

  const handleDelete = (bid)=>{
    if(window.confirm("Withdraw this bid?")) dispatch(deleteMyBid(bid._id));
  };

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800">My Bids</h2>
        <p className="text-sm text-gray_100 mt-1">
          All bids you have placed. You can edit or withdraw bids while the load is still open.
        </p>
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        {isLoading ? ( <p className="text-center py-10 text-gray_100 text-sm">Loading...</p>) : !myBids?.length ? (
          <div className="text-center py-14 text-gray-400">
            <p className="text-sm">You haven't placed any bids yet.</p>
            <NavLink to="/auction" className="text-green text-sm font-medium hover:underline mt-2 inline-block">
              Browse live auctions →
            </NavLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray_100 border-b">
                  <th className="py-2 px-3">Load</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Your Bid</th>
                  <th className="py-2 px-3 text-center">Bid Status</th>
                  <th className="py-2 px-3">Load Status</th>
                  <th className="py-2 px-3 text-center">Bid Ends</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myBids.map((bid) =>{
                  const load = bid.load;
                  const isEditing = bid._id in editing;
                  const modifiable = canModify(bid);

                  return (
                    <tr key={bid._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-800 max-w-[140px] truncate">{load?.title ?? "—"}</td>
                      <td className="py-3 px-3 text-xs text-gray_100">{load?.pickupLocation} → {load?.dropLocation}</td>
                      <td className="py-3 px-3 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editing[bid._id]}
                            onChange={(e) =>
                              setEditing((p) => ({ ...p, [bid._id]: e.target.value }))
                            }
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-sm text-center focus:outline-none focus:ring-1 focus:ring-green"
                            min="1"
                            step="100"
                          />
                        ) : (
                          <span className="font-semibold text-green">₹{bid.amount?.toLocaleString()}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bid.status === "WON" ? "bg-green-100 text-green-700": bid.status === "LOST"? "bg-red-100 text-red-600": "bg-blue-100 text-blue-700"}`}>
                          {bid.status}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[load?.status] ?? "bg-gray-100 text-gray-600"}`}>
                          {load?.status?.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center text-xs text-gray_100">
                        {load?.bidEndTime ? new Date(load.bidEndTime).toLocaleString(): "—"}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center justify-center gap-2">
                          <NavLink to={`/load/${load?._id}`} className="text-gray-400 hover:text-green" title="View load">
                            <FiEye size={15} />
                          </NavLink>

                          {modifiable && (
                            <>
                              {isEditing ? (
                                <>
                                  <button onClick={() => submitEdit(bid)} className="text-green hover:text-green-700" title="Save">
                                    <FiCheck size={15} />
                                  </button>
                                  <button onClick={() => cancelEdit(bid._id)} className="text-gray-400 hover:text-gray-600" title="Cancel">
                                    <FiX size={15} />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => startEdit(bid)} className="text-gray-400 hover:text-green" title="Edit bid">
                                  <FiEdit2 size={15} />
                                </button>
                              )}

                              <button onClick={() => handleDelete(bid)} className="text-gray-400 hover:text-red-500" title="Withdraw bid">
                                <FiTrash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBids;
