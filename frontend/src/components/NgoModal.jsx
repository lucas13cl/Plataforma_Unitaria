import React, { useState } from 'react';

export default function NgoModal({ isOpen, onClose, onNgoAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    city: 'Recife',
    address: '',
    contact: '',
    needs: ''
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ngos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('ONG ou Ponto de Coleta cadastrado com sucesso!');
        setFormData({ name: '', city: 'Recife', address: '', contact: '', needs: '' });
        onNgoAdded(); 
        onClose(); 
      } else {
        alert('Erro ao cadastrar local.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      alert('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cadastrar Nova ONG / Ponto de Coleta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da ONG / Local</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name} 
              onChange={handleChange}
              placeholder="Ex: Abrigo Comunitário Boa Viagem"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Município (RMR)</label>
            <select 
              name="city" 
              value={formData.city} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Recife">Recife</option>
              <option value="Jaboatão dos Guararapes">Jaboatão dos Guararapes</option>
              <option value="Olinda">Olinda</option>
              <option value="Camaragibe">Camaragibe</option>
              <option value="São Lourenço da Mata">São Lourenço da Mata</option>
              <option value="Paulista">Paulista</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
            <input 
              type="text" 
              name="address" 
              required
              value={formData.address} 
              onChange={handleChange}
              placeholder="Rua, Número, Bairro - PE"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contato / Telefone</label>
            <input 
              type="text" 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange}
              placeholder="(81) 99999-9999"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Principais Necessidades</label>
            <input 
              type="text" 
              name="needs" 
              value={formData.needs} 
              onChange={handleChange}
              placeholder="Ex: Água, Alimentos, Colchões"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading ? 'Salvando...' : 'Salvar Local'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}