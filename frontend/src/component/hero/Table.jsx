import { TiEyeOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";

export const Table =({
  load = [],
  isWon = false,
  isAdmin = false,
  handleSellProduct,
  delProduct,
}) => {

  return (
    <div className="relative overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Commission</th>
            <th className="px-6 py-4">Original Price</th>
            <th className="px-6 py-4">Current Bid</th>

            {!isWon && (
              <>
                <th className="px-6 py-4">Verify</th>
                {!isAdmin && (
                  <>
                    <th className="px-6 py-4">Sell</th>
                    <th className="px-6 py-4">Actions</th>
                  </>
                )}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(load) && load.length > 0 ? (
            load.map((product) => (
              <tr key={product._id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="truncate block max-w-[180px]">
                    {product?.title || "Untitled"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {product?.adminCommission ?? 0}%
                </td>
                <td className="px-6 py-4">
                  {product?.maxBudget ?? "-"}
                </td>
                <td className="px-6 py-4">
                  {product?.lowestBid?.amount ?? "No Bid"}
                </td>

                {!isWon && (
                  <>
                    <td className="px-6 py-4"> {product?.isVerified ? (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                          Yes
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>
                          No
                        </div>
                      )}
                    </td>
                    {!isAdmin && (
                      <td className="px-6 py-4">
                        {product?.status === "ASSIGNED" ? (
                          <button className="bg-red-500 text-white py-1 px-3 rounded-lg opacity-60 cursor-not-allowed" disabled>
                            Sold
                          </button>
                        ) : (
                          <button className={`py-1 px-3 rounded-lg ${product?.isVerified ? "bg-green text-white": "bg-gray-400 text-gray-700 cursor-not-allowed"}`} disabled={product?.isVerified !== true} onClick={() => handleSellProduct(product._id)}>
                            Sell
                          </button>
                        )}
                      </td>
                    )}
               
                    {!isAdmin && (
                      <td className="px-6 py-4 flex items-center gap-3">
                  
                        <NavLink to={`/load/${product._id}`} className="text-indigo-500 hover:text-indigo-700">
                          <TiEyeOutline size={22} />
                        </NavLink>
                 
                        <NavLink to={`/product/update/${product._id}`} className="text-green-600 hover:text-green-800">
                          <CiEdit size={22} />
                        </NavLink>
            
                        <button disabled={product?.status === "ASSIGNED" || product?.totalBids > 0} onClick={() => delProduct(product._id)} title={product?.totalBids > 0 ? "Cannot delete: bids have been placed" : "Delete"} className={`text-red-500 ${product?.status === "ASSIGNED" || product?.totalBids > 0 ? "opacity-40 cursor-not-allowed" : "hover:text-red-700"}`}>
                          <MdOutlineDeleteOutline size={22} />
                        </button>
                      </td>
                    )}

                  </>
                )}
                {isWon && (
                  <td className="px-6 py-4">
                    <button className="bg-green-600 text-white py-1 px-3 rounded-lg" disabled>
                      Victory
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-400">
                No loads available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};