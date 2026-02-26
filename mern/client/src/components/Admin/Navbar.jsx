import { NavLink, useNavigate } from "react-router-dom";
import RocketLogo from "../../assets/images/rocketElevators/rocketLogo.png";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5050/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Logout failed with status ${res.status}`);
      }

      //redirect to /admin/login after logout
      navigate("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/admin">
          <img alt="Rocket logo" className="h-16 inline" src={RocketLogo} />
        </NavLink>

        <div className="flex gap-4 items-center">
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to="/admin/create"
          >
            Create Employee
          </NavLink>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center text-md font-medium bg-red-500 text-white hover:bg-red-600 h-9 rounded-md px-3"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}