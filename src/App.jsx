import  { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaPlus } from 'react-icons/fa';
import Header from './components/Header';
import ReservationCard from './components/ReservationCard';
import ReservationForm from './components/ReservationForm';
import DeleteModal from './components/DeleteModal';
import ReservationButton from './components/ReservationButton';

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [deletingReservation, setDeletingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockReservas = [
        {
          id: 1,
          local: 'Matriz',
          sala: 'Sala 101',
          data_inicio: '2024-11-18T14:00:00',
          data_fim: '2024-11-18T16:00:00',
          responsavel: 'João Silva',
          descricao: 'Reunião de planejamento estratégico trimestral',
          cafe: true,
          quantidade_cafe: 8,
          status: 'active'
        },
        {
          id: 2,
          local: 'Filial',
          sala: 'Sala 203',
          data_inicio: '2024-11-19T09:00:00',
          data_fim: '2024-11-19T10:30:00',
          responsavel: 'Maria Santos',
          descricao: 'Apresentação para novos clientes internacionais',
          cafe: false,
          quantidade_cafe: null,
          status: 'active'
        },
        {
          id: 3,
          local: 'Matriz',
          sala: 'Auditório',
          data_inicio: '2024-11-20T15:00:00',
          data_fim: '2024-11-20T17:00:00',
          responsavel: 'Carlos Oliveira',
          descricao: 'Treinamento de novas ferramentas de desenvolvimento',
          cafe: true,
          quantidade_cafe: 15,
          status: 'active'
        }
      ];
      setReservations(mockReservas);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReservations = reservations.filter(reserva => {
    const matchesSearch = reserva.sala.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocal = !selectedLocal || reserva.local === selectedLocal;
    return matchesSearch && matchesLocal;
  });

  const handleCreateReservation = (reservaData) => {
    const newReservation = {
      id: Date.now(),
      ...reservaData,
      status: 'active'
    };
    setReservations(prev => [...prev, newReservation]);
    setShowForm(false);
  };

  const handleEditReservation = (reservaData) => {
    setReservations(prev => 
      prev.map(r => r.id === editingReservation.id ? { ...r, ...reservaData } : r)
    );
    setEditingReservation(null);
  };

  const handleDeleteReservation = () => {
    setReservations(prev => prev.filter(r => r.id !== deletingReservation.id));
    setShowDeleteModal(false);
    setDeletingReservation(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Header onNewReservation={() => setShowForm(true)}  />
      
      <main className="container mx-auto px-4 py-8 ">



        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reservas de Salas</h2>
              <p className="text-gray-600">Gerencie todas as reservas de salas de reunião</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar por sala ou responsável..."
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select 
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedLocal}
                onChange={(e) => setSelectedLocal(e.target.value)}
              >
                <option value="">Todos os locais</option>
                <option value="Matriz">Matriz</option>
                <option value="Filial">Filial</option>
              </select>

              <ReservationButton onNewReservation={() => setShowForm(true)}/>
            </div>
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReservations.map(reserva => (
              <ReservationCard
                key={reserva.id}
                reserva={reserva}
                onEdit={() => setEditingReservation(reserva)}
                onDelete={() => {
                  setDeletingReservation(reserva);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || selectedLocal ? 'Nenhuma reserva encontrada' : 'Nenhuma reserva agendada'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedLocal 
                  ? 'Tente ajustar os filtros de busca para ver mais resultados.' 
                  : 'Comece criando sua primeira reserva de sala de reunião.'
                }
              </p>
              {!searchTerm && !selectedLocal && (
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 mx-auto shadow-sm hover:shadow-md"
                  onClick={() => setShowForm(true)}
                >
                  <FaPlus />
                  Criar Primeira Reserva
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <ReservationForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateReservation}
          title="Nova Reserva"
        />
      )}

      {editingReservation && (
        <ReservationForm
          onClose={() => setEditingReservation(null)}
          onSubmit={handleEditReservation}
          reservation={editingReservation}
          title="Editar Reserva"
        />
      )}

      {showDeleteModal && deletingReservation && (
        <DeleteModal
          reservation={deletingReservation}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteReservation}
        />
      )}
    </div>
  );
};

export default App;