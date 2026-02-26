import RocketLogo from "../../assets/images/rocketElevators/rocketLogo.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with logo and admin login */}
      <header className="p-6 shadow-md flex justify-between items-center">
        {/* Use imported logo */}
        <img
          src={RocketLogo}
          alt="Rocket Logo"
          className="h-25"
        />
        <a
          href="/admin/login"
          className="text-blue-600 font-semibold hover:underline"
        >
          Admin Login
        </a>
      </header>

      {/* Main commercial content */}
      <main className="p-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Rocket Elevators
        </h1>
        <p className="text-lg text-gray-600">
          Elevating your world with premium elevator solutions.
        </p>
      </main>
    </div>
  );
};

export default Home;