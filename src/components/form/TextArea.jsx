import { FaComment } from "react-icons/fa";

const TextArea = ({ label, ...props }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <FaComment className="text-blue-600" />
        {label}
      </label>

      <div className="relative">
        <textarea
          {...props}
          rows={3}
          className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none hover:border-gray-400`}
        />
        <FaComment className="absolute left-3 top-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

export default TextArea;
