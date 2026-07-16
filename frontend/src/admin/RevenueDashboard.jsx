import { useEffect, useState, useCallback } from "react";
import commissionService from "../redux/services/commissionService";
import { useWebSocket } from "../hooks/useWebSocket";
import { BsCashCoin } from "react-icons/bs";
import { FiDollarSign, FiPackage, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";

const RevenueDashboard = () => {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newPercentage, setNewPercentage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revenueRes, configRes] = await Promise.all([
        commissionService.getRevenue(),
        commissionService.getConfig(),
      ]);
      setData(revenueRes.data);
      setConfig(configRes.data);
      setNewPercentage(String(configRes.data.percentage));
    } catch {
      toast.error("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useWebSocket(null, {
    loadUpdate: useCallback(() => { fetchData(); }, []),
  });

  const handleUpdateConfig = async () => {
    const val = parseFloat(newPercentage);
    if (isNaN(val) || val < 0 || val > 100) {
      toast.error("Percentage must be between 0 and 100");
      return;
    }
    try {
      const res = await commissionService.updateConfig(val);
      setConfig(res.data);
      setEditing(false);
      toast.success("Commission rate updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading revenue data...</p>;
  }

  return (
    <section className="space-y-6">
      <div className="shadow-s1 p-6 rounded-lg flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Revenue Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">Platform commission and payment overview</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green transition">
          <FiRefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Commission Config */}
      <div className="shadow-s1 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-700">Commission Configuration</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-sm text-green hover:underline">
              Edit
            </button>
          )}
        </div>
        {editing ? (
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={newPercentage}
              onChange={(e) => setNewPercentage(e.target.value)}
              className="w-24 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green"
              min="0"
              max="100"
              step="0.5"
            />
            <span className="text-sm text-gray-600">%</span>
            <button onClick={handleUpdateConfig} className="bg-green text-white text-sm px-4 py-2 rounded-lg hover:bg-primary transition">
              Save
            </button>
            <button onClick={() => { setEditing(false); setNewPercentage(String(config?.percentage)); }} className="text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold text-gray-800">{config?.percentage}%</p>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="shadow-s1 p-5 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-green_100 rounded-lg text-green shrink-0">
            <BsCashCoin size={24} />
          </div>
          <div>
            <p className="text-xs text-gray_100">Platform Commission</p>
            <p className="text-2xl font-bold text-gray-800">₹{data?.summary?.totalCommission?.toLocaleString() || "0"}</p>
          </div>
        </div>

        <div className="shadow-s1 p-5 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 shrink-0">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-gray_100">Total Driver Earnings</p>
            <p className="text-2xl font-bold text-gray-800">₹{data?.summary?.totalDriverEarnings?.toLocaleString() || "0"}</p>
          </div>
        </div>

        <div className="shadow-s1 p-5 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600 shrink-0">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="text-xs text-gray_100">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">₹{data?.summary?.totalRevenue?.toLocaleString() || "0"}</p>
          </div>
        </div>

        <div className="shadow-s1 p-5 rounded-lg flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-lg text-orange-600 shrink-0">
            <FiPackage size={24} />
          </div>
          <div>
            <p className="text-xs text-gray_100">Total Loads Paid</p>
            <p className="text-2xl font-bold text-gray-800">{data?.summary?.totalLoads || 0}</p>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="shadow-s1 p-6 rounded-lg">
        <h3 className="text-base font-semibold text-gray-700 mb-4">Payment History</h3>
        {data?.payments?.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead>
                <tr className="text-xs uppercase text-gray_100 border-b">
                  <th className="py-2 px-3">Load</th>
                  <th className="py-2 px-3">Sender</th>
                  <th className="py-2 px-3">Driver</th>
                  <th className="py-2 px-3 text-center">Bid Amount</th>
                  <th className="py-2 px-3 text-center">Commission</th>
                  <th className="py-2 px-3 text-center">Driver Earnings</th>
                  <th className="py-2 px-3 text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.payments?.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800 max-w-[140px] truncate">{p.load?.title || "—"}</td>
                    <td className="py-3 px-3 text-xs text-gray_100">{p.sender?.name || "—"}</td>
                    <td className="py-3 px-3 text-xs text-gray_100">{p.driver?.name || "—"}</td>
                    <td className="py-3 px-3 text-center font-medium">₹{p.amount?.toLocaleString()}</td>
                    <td className="py-3 px-3 text-center text-orange-600 font-medium">₹{p.commissionAmount?.toLocaleString() || "—"}</td>
                    <td className="py-3 px-3 text-center text-green-600 font-medium">₹{p.driverAmount?.toLocaleString() || "—"}</td>
                    <td className="py-3 px-3 text-center text-xs text-gray_100">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</td>
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

export default RevenueDashboard;
