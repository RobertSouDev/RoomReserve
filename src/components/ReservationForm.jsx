// components/ReservationForm.jsx
import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaUser, FaCoffee, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ReservationForm = ({ onClose, onSubmit, reservation, title, locais, salas ,errorForm}) => {
  const [formData, setFormData] = useState({
    local: '',
    sala: '',
    data_inicio: '',
    data_fim: '',
    responsavel: '',
    descricao: '',
    cafe: false,
    quantidade_cafe: 0
  });

  const [loading, setLoading] = useState(false);
  const [salasFiltradas, setSalasFiltradas] = useState([]);
  const [error, setError] = useState('');

  // Preencher form se estiver editando
  useEffect(() => {
    if (reservation) {
      setFormData({
        local: reservation.local || '',
        sala: reservation.sala || '',
        data_inicio: reservation.data_inicio ? reservation.data_inicio.slice(0, 16) : '',
        data_fim: reservation.data_fim ? reservation.data_fim.slice(0, 16) : '',
        responsavel: reservation.responsavel || '',
        descricao: reservation.descricao || '',
        cafe: reservation.cafe || false,
        quantidade_cafe: reservation.quantidade_cafe || 0
      });

      if (reservation.local) {
        const localSelecionado = locais.find(l => l.name === reservation.local);
        if (localSelecionado) {
          const salasDoLocal = salas.filter(sala => sala.location_id === localSelecionado.id);
          setSalasFiltradas(salasDoLocal);
        }
      }
    }
  }, [reservation, locais, salas]);

  // Filtrar salas quando o local mudar
  useEffect(() => {
    if (formData.local) {
      const localSelecionado = locais.find(l => l.name === formData.local);
      
      if (localSelecionado) {
        const salasDoLocal = salas.filter(sala => sala.location_id === localSelecionado.id);
        setSalasFiltradas(salasDoLocal);
      } else {
        setSalasFiltradas([]);
      }
      
      setFormData(prev => ({ ...prev, sala: '' }));
    } else {
      setSalasFiltradas([]);
    }
  }, [formData.local, locais, salas]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validação 
 
    if (!formData.local || !formData.sala || !formData.data_inicio || !formData.data_fim || !formData.responsavel) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (new Date(formData.data_fim) <= new Date(formData.data_inicio)) {
      setError('A data de fim deve ser posterior à data de início');
      return;
    }


    setLoading(true);

    try {
      // Converter para o formato esperado pela API
      const reservaData = {
        local: formData.local,
        sala: formData.sala,
        data_inicio: new Date(formData.data_inicio).toISOString(),
        data_fim: new Date(formData.data_fim).toISOString(),
        responsavel: formData.responsavel,
        descricao: formData.descricao,
        cafe: formData.cafe,
        quantidade_cafe: formData.cafe ? parseInt(formData.quantidade_cafe) : 0
      };

      await onSubmit(reservaData);
    } catch (error) {
      console.error('Erro no formulário:', error);
      
      // VERIFICA SE É ERRO 409 (CONFLITO DE HORÁRIO)
      console.log(error);
      if (error.code === 409) {
        
        // setTimeout(() => {
        //   onClose();
        // }, 2000); 
        setError('Já existe uma reserva neste horário. O modal será fechado automaticamente.');
      } else {
        // Outros erros continuam mostrando a mensagem normalmente
        setError(error.message || 'Erro ao salvar reserva. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Mensagem de erro DENTRO do modal */}
      

        {/* Resto do formulário permanece igual */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Local */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-gray-400" />
              Local *
            </label>
            <select
              name="local"
              value={formData.local}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            >
              <option value="">Selecione um local</option>
              {locais.map(local => (
                <option key={local.id} value={local.name}>
                  {local.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sala */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sala *
            </label>
            <select
              name="sala"
              value={formData.sala}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={!formData.local || loading}
            >
              <option value="">
                {!formData.local 
                  ? 'Selecione um local primeiro' 
                  : salasFiltradas.length === 0 
                    ? 'Nenhuma sala disponível neste local'
                    : 'Selecione uma sala'
                }
              </option>
              {salasFiltradas.map(sala => (
                <option key={sala.id} value={sala.name}>
                  {sala.name} {sala.capacity && `- Capacidade: ${sala.capacity}`}
                </option>
              ))}
            </select>
            {formData.local && salasFiltradas.length === 0 && (
              <p className="text-sm text-yellow-600 mt-1">
                Não há salas cadastradas para este local
              </p>
            )}
          </div>

          {/* Data e Hora de Início */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gray-400" />
              Data e Hora de Início *
            </label>
            <input
              type="datetime-local"
              name="data_inicio"
              value={formData.data_inicio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Data e Hora de Fim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaCalendarAlt className="inline mr-2 text-gray-400" />
              Data e Hora de Fim *
            </label>
            <input
              type="datetime-local"
              name="data_fim"
              value={formData.data_fim}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Responsável */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FaUser className="inline mr-2 text-gray-400" />
              Responsável *
            </label>
            <input
              type="text"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              placeholder="Nome do responsável pela reserva"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição da reunião ou evento"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Café */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="cafe"
              checked={formData.cafe}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FaCoffee className="inline mr-2 text-gray-400" />
              Serviço de café
            </label>
          </div>

          {/* Quantidade de Café */}
          {formData.cafe && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantidade de café (pessoas)
              </label>
              <input
                type="number"
                name="quantidade_cafe"
                value={formData.quantidade_cafe}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.local || !formData.sala || !formData.data_inicio || !formData.data_fim || !formData.responsavel}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading && <FaSpinner className="animate-spin" />}
              {loading ? 'Salvando...' : (reservation ? 'Atualizar' : 'Criar')}
            </button>
            
          </div>
            {error && (
          <div className={`mx-6 mt-4 border rounded-lg p-4 ${
            error.includes('409') 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className={`mt-0.5 flex-shrink-0 ${
                error.includes('409') ? 'text-orange-500' : 'text-red-500'
              }`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  error.includes('409') ? 'text-orange-800' : 'text-red-800'
                }`}>
                  {error.includes('409') ? 'Conflito de horário' : 'Não foi possível salvar a reserva'}
                </p>
                <p className={`text-sm mt-1 ${
                  error.includes('409') ? 'text-orange-700' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
              <button 
                onClick={() => setError('')}
                className={`flex-shrink-0 ${
                  error.includes('409') ? 'text-orange-500 hover:text-orange-700' : 'text-red-500 hover:text-red-700'
                }`}
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>
        )}
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;