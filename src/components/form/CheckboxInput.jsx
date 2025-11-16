const CheckboxInput = ({ label, icon: Icon, ...props }) => {
  return (
    <label className="flex items-center gap-3 p-4 border rounded-lg hover:border-gray-300 cursor-pointer">
      <input type="checkbox" {...props} className="w-5 h-5 text-blue-600 border-gray-300 rounded" />
      <div className="flex items-center gap-2">
        <Icon className="text-orange-500" />
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
    </label>
  );
};

export default CheckboxInput;
