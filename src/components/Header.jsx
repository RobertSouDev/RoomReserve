import { FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import ReservationButton from './ReservationButton';

const Header = ({ onNewReservation }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-xl">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema de Reservas</h1>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <FaBuilding className="text-xs" />
                <span>Matricial Capital</span>
              </div>
            </div>
          </div>
          <div className='block md:hidden'>
              <ReservationButton  onNewReservation={() => onNewReservation(true)}/>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;