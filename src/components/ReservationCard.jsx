import { 
  FaBuilding, 
  FaClock, 
  FaUser, 
  FaComment, 
  FaCoffee, 
  FaEdit, 
  FaTrash,
  FaCalendarDay
} from 'react-icons/fa';
import { 
  WiDaySunny, 
  WiRain, 
  WiDayCloudy 
} from 'react-icons/wi';

const ReservationCard = ({ reserva, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusInfo = (reserva) => {
    const now = new Date();
    const start = new Date(reserva.data_inicio);
    const end = new Date(reserva.data_fim);
    const timeUntilStart = start - now;
    
    if (now > end) {
      return { 
        status: 'Concluída', 
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        icon: WiDaySunny,
        iconColor: 'text-gray-500'
      };
    }
    if (now >= start && now <= end) {
      return { 
        status: 'Em Andamento', 
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: WiDaySunny,
        iconColor: 'text-green-500'
      };
    }
    if (timeUntilStart < 3600000) { 
      return { 
        status: 'Em Breve', 
        color: 'bg-orange-100 text-orange-700 border-orange-300',
        icon: WiDayCloudy,
        iconColor: 'text-orange-500'
      };
    }
    return { 
      status: 'Agendada', 
      color: 'bg-blue-100 text-blue-700 border-blue-300',
      icon: WiRain,
      iconColor: 'text-blue-500'
    };
  };

  const statusInfo = getStatusInfo(reserva);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden group">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FaBuilding className="text-blue-200" />
              <span className="font-semibold text-blue-100">{reserva.local}</span>
            </div>
            <h3 className="text-lg font-bold">{reserva.sala}</h3>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
            <StatusIcon className={`text-lg ${statusInfo.iconColor}`} />
            <span>{statusInfo.status}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center">
            <FaCalendarDay className="text-blue-600 text-lg" />
            <span className="text-xs font-bold text-gray-700 mt-1">
              {new Date(reserva.data_inicio).getDate()}
            </span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {formatDate(reserva.data_inicio)}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-gray-400" />
              <span>{formatTime(reserva.data_inicio)} - {formatTime(reserva.data_fim)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <FaUser className=" text-sm" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Responsável</div>
            <div className="font-medium text-gray-900">{reserva.responsavel}</div>
          </div>
        </div>

        {reserva.descricao && (
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <FaComment className=" text-sm" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Descrição</div>
              <div className="text-sm text-gray-700 line-clamp-2">{reserva.descricao}</div>
            </div>
          </div>
        )}

=        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8  rounded-full flex items-center justify-center flex-shrink-0">
            <FaCoffee className=" text-sm" />
          </div>
          <div>
            <div className="text-sm text-gray-600">Serviço de Café</div>
            <div className={`font-medium ${reserva.cafe ? 'text-green-600' : 'text-gray-500'}`}>
              {reserva.cafe ? `Para ${reserva.quantidade_cafe} pessoas` : 'Não solicitado'}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FaEdit />
            Editar
          </button>
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
          >
            <FaTrash />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;