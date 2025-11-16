import { FaCalendarAlt } from "react-icons/fa";

export default function ReservationButton({onNewReservation}) {
    return ( 
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            onClick={onNewReservation}
          >
            <FaCalendarAlt className="text-sm " />
            Nova Reserva
          </button>
     );
}

