import { FaExclamationTriangle, FaTimes, FaBuilding, FaClock, FaUser } from 'react-icons/fa';

const DeleteModal = ({ reservation, onClose, onConfirm }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-red-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-red-600 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Tem certeza que deseja excluir permanentemente esta reserva?
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <FaBuilding className="text-blue-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {reservation.local} - {reservation.sala}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <FaClock className="text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">
                  {formatDate(reservation.data_inicio)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatTime(reservation.data_inicio)} - {formatTime(reservation.data_fim)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaUser className="text-blue-600" />
              <div className="text-sm text-gray-600">
                {reservation.responsavel}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-semibold"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <FaTimes />
              Excluir Reserva
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;