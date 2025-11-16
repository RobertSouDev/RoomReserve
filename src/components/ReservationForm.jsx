import { useState, useEffect } from "react";
import {
  FaTimes,
  FaBuilding,
  FaDoorOpen,
  FaUser,
  FaCoffee,
  FaUsers,
} from "react-icons/fa";
import DateInput from "./Form/DateInput";
import SelectInput from "./Form/SelectInput";
import TimeInput from "./Form/TimeInput";
import TextInput from "./Form/TextInput";
import TextArea from "./Form/TextArea";
import CheckboxInput from "./form/CheckboxInput";
import NumberInput from "./Form/NumberInput";

const ReservationForm = ({ onClose, onSubmit, reservation, title }) => {
  const [formData, setFormData] = useState({
    local: "",
    sala: "",
    data: "",
    hora_inicio: "",
    hora_fim: "",
    responsavel: "",
    descricao: "",
    cafe: false,
    quantidade_cafe: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reservation) {
      const data = new Date(reservation.data_inicio);
      setFormData({
        local: reservation.local,
        sala: reservation.sala,
        data: data.toISOString().split("T")[0],
        hora_inicio: data.toTimeString().slice(0, 5),
        hora_fim: new Date(reservation.data_fim).toTimeString().slice(0, 5),
        responsavel: reservation.responsavel,
        descricao: reservation.descricao || "",
        cafe: reservation.cafe,
        quantidade_cafe: reservation.quantidade_cafe || "",
      });
    }
  }, [reservation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.local) newErrors.local = "Obrigatório";
    if (!formData.sala) newErrors.sala = "Obrigatório";
    if (!formData.data) newErrors.data = "Obrigatório";
    if (!formData.hora_inicio) newErrors.hora_inicio = "Obrigatório";
    if (!formData.hora_fim) newErrors.hora_fim = "Obrigatório";
    if (!formData.responsavel.trim()) newErrors.responsavel = "Obrigatório";

    if (formData.cafe && (!formData.quantidade_cafe || formData.quantidade_cafe < 1)) {
      newErrors.quantidade_cafe = "Mínimo 1";
    }

    if (formData.hora_inicio >= formData.hora_fim) {
      newErrors.hora_fim = "Fim deve ser depois do início";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const locais = ["Matriz", "Filial"];
  const salasPorLocal = {
    Matriz: ["Sala 101", "Sala 102", "Sala 103", "Sala Reuniões", "Auditório"],
    Filial: ["Sala 201", "Sala 202", "Sala 203", "Sala VIP", "Espaço Criatividade"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit({
      local: formData.local,
      sala: formData.sala,
      data_inicio: `${formData.data}T${formData.hora_inicio}:00`,
      data_fim: `${formData.data}T${formData.hora_fim}:00`,
      responsavel: formData.responsavel,
      descricao: formData.descricao,
      cafe: formData.cafe,
      quantidade_cafe: formData.cafe ? Number(formData.quantidade_cafe) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-6 bg-blue-600 text-white rounded-t-xl">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectInput
              label="Local *"
              icon={FaBuilding}
              name="local"
              value={formData.local}
              onChange={handleChange}
              error={errors.local}
            >
              <option value="">Selecione o local</option>
              {locais.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </SelectInput>

            <SelectInput
              label="Sala *"
              icon={FaDoorOpen}
              name="sala"
              value={formData.sala}
              onChange={handleChange}
              error={errors.sala}
              disabled={!formData.local}
            >
              <option value="">Selecione a sala</option>
              {formData.local &&
                salasPorLocal[formData.local]?.map((sala) => (
                  <option key={sala} value={sala}>{sala}</option>
                ))}
            </SelectInput>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DateInput
              label="Data *"
              name="data"
              value={formData.data}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              error={errors.data}
            />

            <TimeInput
              label="Início *"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              error={errors.hora_inicio}
            />

            <TimeInput
              label="Fim *"
              name="hora_fim"
              value={formData.hora_fim}
              onChange={handleChange}
              error={errors.hora_fim}
            />
          </div>

          <TextInput
            label="Responsável *"
            icon={FaUser}
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
            error={errors.responsavel}
          />

          <TextArea
            label="Descrição"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />

          <CheckboxInput
            label="Oferecer café"
            icon={FaCoffee}
            name="cafe"
            checked={formData.cafe}
            onChange={handleChange}
          />

          {formData.cafe && (
            <NumberInput
              label="Quantidade de pessoas"
              icon={FaUsers}
              name="quantidade_cafe"
              value={formData.quantidade_cafe}
              onChange={handleChange}
              min={1}
              max={50}
              error={errors.quantidade_cafe}
            />
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-6 py-3 border rounded-lg">
              Cancelar
            </button>

            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
              {reservation ? "Salvar Alterações" : "Criar Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
