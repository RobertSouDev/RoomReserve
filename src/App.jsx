import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaPlus } from 'react-icons/fa';
import Header from './components/Header';
import ReservationCard from './components/ReservationCard';
import ReservationForm from './components/ReservationForm';
import DeleteModal from './components/DeleteModal';
import ReservationButton from './components/ReservationButton';
import { apiService } from './services/api';

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [locais, setLocais] = useState([]);
  const [salas, setSalas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [deletingReservation, setDeletingReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocal, setSelectedLocal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorForm, setErrorForm] = useState(null);
  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [locaisData, salasData, reservasData] = await Promise.all([
          apiService.getLocais(),
          apiService.getSalas(),
          apiService.getReservations()
        ]);
        
        setLocais(locaisData);
        setSalas(salasData);
        setReservations(reservasData);
        
      } catch (err) {
        setError('Erro ao carregar dados. Verifique se a API está rodando.');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Criar reserva
  const handleCreateReservation = async (reservaData) => {
    try {
      setError(null);
      setSuccess(null);
      
      const newReservation = await apiService.createReservation(reservaData);
      console.log(errorForm)
      // Atualizar a lista de reservas
      setReservations(prev => [...prev, newReservation]);
      setShowForm(false);
      setSuccess('Reserva criada com sucesso!');
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(`Erro ao criar reserva: ${err.message}`);
      setErrorForm(err)
      
      console.error('Erro ao criar reserva:', err);
      throw err
    }
  };

  // Editar reserva
  const handleEditReservation = async (reservaData) => {
    try {
      setError(null);
      setSuccess(null);
      
      const updatedReservation = await apiService.updateReservation(
        editingReservation.id, 
        reservaData
      );
      
      // Atualizar a lista de reservas
      setReservations(prev => 
        prev.map(r => r.id === editingReservation.id ? updatedReservation : r)
      );
      
      setEditingReservation(null);
      setSuccess('Reserva atualizada com sucesso!');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(`Erro ao atualizar reserva: ${err.message}`);
      console.error('Erro ao atualizar reserva:', err);
    }
  };

  // Deletar reserva
  const handleDeleteReservation = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      await apiService.deleteReservation(deletingReservation.id);
      
      // Remover da lista de reservas
      setReservations(prev => prev.filter(r => r.id !== deletingReservation.id));
      setShowDeleteModal(false);
      setDeletingReservation(null);
      setSuccess('Reserva deletada com sucesso!');
      
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(`Erro ao deletar reserva: ${err.message}`);
      console.error('Erro ao deletar reserva:', err);
    }
  };

  // Filtrar reservas baseado nos locais
  const filteredReservations = reservations.filter(reserva => {
    const matchesSearch = reserva.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reserva.responsible_person?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const localEncontrado = locais.find(local => local.name === reserva.location);
    const matchesLocal = !selectedLocal || localEncontrado?.id.toString() === selectedLocal;
    
    return matchesSearch && matchesLocal;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Header onNewReservation={() => setShowForm(true)} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Mensagem de erro */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <div className="flex justify-between items-center">
              <span>{success}</span>
              <button 
                onClick={() => setSuccess(null)}
                className="text-green-700 hover:text-green-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

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
                {locais.map(local => (
                  <option key={local.id} value={local.id}>
                    {local.name}
                  </option>
                ))}
              </select>

              <ReservationButton onNewReservation={() => setShowForm(true)}/>
            </div>
          </div>
        </div>

        {/* Grid de reservas */}
        {filteredReservations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredReservations.map(reserva => (
              <ReservationCard
                key={reserva.id}
                reserva={{
                  id: reserva.id,
                  local: reserva.location,
                  sala: reserva.room,
                  data_inicio: reserva.start_datetime,
                  data_fim: reserva.end_datetime,
                  responsavel: reserva.responsible_person,
                  descricao: reserva.description,
                  cafe: reserva.coffee,
                  quantidade_cafe: reserva.coffee_quantity,
                  status: 'active'
                }}
                onEdit={() => setEditingReservation({
                  id: reserva.id,
                  local: reserva.location,
                  sala: reserva.room,
                  data_inicio: reserva.start_datetime,
                  data_fim: reserva.end_datetime,
                  responsavel: reserva.responsible_person,
                  descricao: reserva.description,
                  cafe: reserva.coffee,
                  quantidade_cafe: reserva.coffee_quantity,
                  status: 'active'
                })}
                onDelete={() => {
                  setDeletingReservation({
                    id: reserva.id,
                    local: reserva.location,
                    sala: reserva.room,
                    data_inicio: reserva.start_datetime,
                    data_fim: reserva.end_datetime,
                    responsavel: reserva.responsible_person,
                    descricao: reserva.description,
                    cafe: reserva.coffee,
                    quantidade_cafe: reserva.coffee_quantity,
                    status: 'active'
                  });
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

      {/* Modais */}
      {showForm && (
        <ReservationForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateReservation}
          title="Nova Reserva"
          locais={locais}
          salas={salas}
          errorForm={errorForm}
        />
      )}

      {editingReservation && (
        <ReservationForm
          onClose={() => setEditingReservation(null)}
          onSubmit={handleEditReservation}
          reservation={editingReservation}
          title="Editar Reserva"
          locais={locais}
          salas={salas}
          errorForm={errorForm}
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