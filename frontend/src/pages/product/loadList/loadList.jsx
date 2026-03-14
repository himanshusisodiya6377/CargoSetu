import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLoads, deleteLoad, sellLoad } from "../../../redux/features/loadSlice";
import { useRedirectLoggedOutUser } from "../../../hooks/useRedirectLoggedOutUser";
import { FiEye, FiEdit2, FiTrash2, FiPlusCircle } from "react-icons/fi";

const STATUS_COLORS = {
  OPEN:       "bg-blue-100 text-blue-700",
  BIDDING:    "bg-yellow-100 text-yellow-700",
  ASSIGNED:   "bg-purple-100 text-purple-700",
  IN_TRANSIT: "bg-orange-100 text-orange-700",
  DELIVERED:  "bg-green-100 text-green-700",
};

const LoadList = () =>{
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  const {loads, isLoading} = useSelector((state) => state.load);
  const load = loads?.data ?? [];

  useEffect(() =>{
    dispatch(getLoads());
  },[dispatch]);

  const delProduct =(id)=>{
    if(window.confirm("Are you sure you want to delete this load?")){
      dispatch(deleteLoad(id));
    }
  };

  const handleSellProduct = async(id)=>{
    if(!window.confirm("Assign this load to the lowest bidder?")) return;
    try{
      await dispatch(sellLoad(id)).unwrap();
      dispatch(getLoads());
    }catch(error){
      console.error(error);
    }
  };

  return(
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">My Loads</h2>
          <p className="text-gray_100 text-sm mt-1">Manage all your posted loads.</p>
        </div>
        <NavLink to="/add" className="flex items-center gap-2 bg-green text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary transition">
          <FiPlusCircle size={16} />
          Post Load
        </NavLink>
      </div>

      <div className="shadow-s1 p-6 rounded-lg">
        {isLoading ? (<p className="text-gray_100 text-sm py-6 text-center">Loading...</p>) : load.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No loads found.</p>
            <NavLink to="/add" className="text-green text-sm font-medium hover:underline mt-2 inline-block">
              Post your first load →
            </NavLink>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray_100 border-b">
                  <th className="py-2 px-3">Title</th>
                  <th className="py-2 px-3">Route</th>
                  <th className="py-2 px-3 text-center">Budget</th>
                  <th className="py-2 px-3 text-center">Bids</th>
                  <th className="py-2 px-3 text-center">Lowest Bid</th>
                  <th className="py-2 px-3 text-center">Verified</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-center">Sell</th>
                  <th className="py-2 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {load.map((product) =>(
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800 max-w-[130px] truncate">
                      {product.title || "Untitled"}
                    </td>
                    <td className="py-3 px-3 text-xs text-gray_100">
                      {product.pickupLocation} → {product.dropLocation}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-gray-700">
                      ₹{product.maxBudget ?? "—"}
                    </td>
                    <td className="py-3 px-3 text-center">{product.totalBids ?? 0}</td>
                    <td className="py-3 px-3 text-center font-semibold text-green">
                      {product.currentLowestBid != null ? `₹${product.currentLowestBid}` : "—"}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${product.isVerified ? "bg-green-500" : "bg-red-400"}`}></span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[product.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {product.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {product.status === "ASSIGNED" ? (
                        <span className="text-xs text-red-400 font-medium">Sold</span>
                      ) : (
                        <button onClick={() => handleSellProduct(product._id)} disabled={!product.isVerified} className={`text-xs px-3 py-1 rounded-lg font-medium transition ${product.isVerified ? "bg-green text-white hover:bg-primary" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                          Sell
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center justify-center gap-2">
                        <NavLink to={`/load/${product._id}`} className="text-gray-400 hover:text-green" title="View">
                          <FiEye size={15} />
                        </NavLink>
                        <NavLink to={`/product/update/${product._id}`} className="text-gray-400 hover:text-green" title="Edit">
                          <FiEdit2 size={15} />
                        </NavLink>
                        <button onClick={() => delProduct(product._id)} disabled={product.status === "ASSIGNED" || (product.totalBids ?? 0)>0} title={(product.totalBids ?? 0) > 0 ? "Cannot delete: bids placed" : "Delete"} className={`${product.status === "ASSIGNED" || (product.totalBids ?? 0) > 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-red-500"}`}>
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};

export default LoadList;