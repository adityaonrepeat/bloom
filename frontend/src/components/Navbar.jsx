import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, toggleLoginScreen } from "../redux/slices/navSlice";
import { handleLogout } from "../services/authService";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useNavigate();
  const user = useSelector((state) => state.user);

  return (
    <nav className="py-2 px-2 flex gap-4 items-center justify-between shadow-xl bg-white h-24">
      {/* Left Logo */}
      <Link to="/" className="flex gap-4 items-center ml-5">
        <h1 className="text-xl font-bold text-green-600">Bloom 🌱</h1>
      </Link>

      {/* Right Buttons */}
      <div className="flex gap-4 mr-5">

        <button
          className="px-5 py-2 bg-gradient-to-b from-blue-300 to-blue-400 text-white
          rounded-md text-md border-blue-400 border text-center hidden md:block"
        >
          PLUS
        </button>

        {user ? (
          <button
            onClick={() => {
              handleLogout(user.uid).then(() => {
                dispatch(setUser(null));
                dispatch(toggleLoginScreen());
                router("/");
              });
            }}
            className="px-5 py-2 bg-gradient-to-b from-blue-300 to-blue-400 text-white
            rounded-md text-md border-blue-400 border text-center hidden md:block"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => dispatch(toggleLoginScreen())}
            className="px-5 py-2 bg-gradient-to-b from-blue-300 to-blue-400 text-white
            rounded-md text-md border-blue-400 border text-center hidden md:block"
          >
            Login
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;

