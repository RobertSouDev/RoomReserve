import { FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import ReservationButton from './ReservationButton';

const Header = ({ onNewReservation }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-700 to-sky-600 text-white shadow-lg border-b border-indigo-500/30">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl shadow-inner">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sistema de Reservas</h1>
              <div className="flex items-center gap-2 text-sm text-white/80">
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