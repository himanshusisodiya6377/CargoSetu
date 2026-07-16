import { FiCheckCircle, FiPackage, FiTruck } from "react-icons/fi";

const STEPS = [
  { key: "ASSIGNED",   label: "Assigned",   Icon: FiPackage },
  { key: "IN_TRANSIT", label: "In Transit",  Icon: FiTruck },
  { key: "DELIVERED",  label: "Delivered",   Icon: FiCheckCircle },
];

const TrackingBar = ({ status, compact }) => {
  const current = STEPS.findIndex((s) => s.key === status);
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${i <= current ? "bg-green-500" : "bg-gray-200"}`} />
            {i < STEPS.length - 1 && <div className={`w-6 h-0.5 ${i < current ? "bg-green-500" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center w-full gap-2">
      {STEPS.map(({ key, label, Icon }, i) => (
        <div key={key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all font-semibold ${
              i < current
                ? "bg-green-500 border-green-500 text-white shadow-md"
                : i === current
                ? "bg-blue-500 border-blue-600 text-white shadow-lg animate-pulse"
                : "bg-gray-100 border-gray-300 text-gray-400"
            }`}>
              <Icon size={20} />
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap transition-all ${
              i <= current ? "text-green-600" : "text-gray-400"
            }`}>{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${
              i < current ? "bg-green-500" : i === current ? "bg-blue-500" : "bg-gray-300"
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackingBar;
