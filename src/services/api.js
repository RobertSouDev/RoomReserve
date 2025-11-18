// services/api.js
const API_BASE_URL = 'http://localhost:8000/api';

export const apiService = {
  // GET - Locais
  async getLocais() {
    const response = await fetch(`${API_BASE_URL}/locations`);
    if (!response.ok) throw new Error('Erro ao buscar locais');
    return await response.json();
  },

  // GET - Salas
  async getSalas() {
    const response = await fetch(`${API_BASE_URL}/rooms`);
    if (!response.ok) throw new Error('Erro ao buscar salas');
    return await response.json();
  },

  // GET - Reservas
  async getReservations() {
    const response = await fetch(`${API_BASE_URL}/reservas`);
    if (!response.ok) throw new Error('Erro ao buscar reservas');
    return await response.json();
  },

  async createReservation(reservaData) {
    const response = await fetch(`${API_BASE_URL}/reservas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: reservaData.local,
        room: reservaData.sala,
        start_datetime: reservaData.data_inicio,
        end_datetime: reservaData.data_fim,
        responsible_person: reservaData.responsavel,
        description: reservaData.descricao,
        coffee: reservaData.cafe,
        coffee_quantity: reservaData.quantidade_cafe || 0
      }),
    });
    
    if (!response.ok) {
        console.log(response.status);
        console.log(response.statusText);
        const errorMessage = {code: response.status, message: response.statusText};
        throw errorMessage 
        
    }
    
    return await response.json();
  },
  
  async updateReservation(id, reservaData) {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location: reservaData.local,
        room: reservaData.sala,
        start_datetime: reservaData.data_inicio,
        end_datetime: reservaData.data_fim,
        responsible_person: reservaData.responsavel,
        description: reservaData.descricao,
        coffee: reservaData.cafe,
        coffee_quantity: reservaData.quantidade_cafe || 0
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.detail || 
                          errorData?.message || 
                          `Erro ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    return await response.json();
  },
  

  // DELETE - Deletar reserva
  async deleteReservation(id) {
    const response = await fetch(`${API_BASE_URL}/reservas/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || 'Erro ao deletar reserva');
    }
    
    return await response.json();
  },
};