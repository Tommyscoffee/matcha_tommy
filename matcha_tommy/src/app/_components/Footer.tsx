import { TbSwipe } from "react-icons/tb";
import { FaSearch, FaHeart, FaUser } from "react-icons/fa";
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-between items-center px-6 py-3 z-10">
    	{/* Bottom Navigation with Notification */}
       <nav className="w-full flex justify-around text-gray-400 text-2xl relative">
					{/* <span>{TbSwipe}</span> Trash */}
                    <button aria-label="Swipe" className="focus:outline-none">
                        <TbSwipe />
                    </button>
                    <button aria-label="Search" className="focus:outline-none">
                        <FaSearch />
                    </button>
                    <button aria-label="Heart" className="focus:outline-none">
                        <FaHeart />
                    </button>
                    <button aria-label="User" className="focus:outline-none">
                        <FaUser />
                    </button>
				</nav>
  </footer>
);
}