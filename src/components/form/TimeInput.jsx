import { FaClock, FaExclamationTriangle } from "react-icons/fa";

const TimeInput = ({ label, error, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <FaClock className="text-blue-600" />
        {label}
      </label>

      <div className="relative">
        <input
          type="time"
          {...props}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition ${
            error ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
          }`}
        />
        <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {error && <p className="text-sm text-red-600 mt-1 flex items-center gap-1"><FaExclamationTriangle /> {error}</p>}
    </div>
  );
};

export default TimeInput;
