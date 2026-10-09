import { useNavigate } from "react-router-dom";

const Grab = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleGrabOrder = () => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      navigate("/login");
      return;
    }

    // Simply navigate to task page - package selection will be handled there
    navigate("/task");
  };

  return (
    <div className="bg-[url('/src/assets/home-page/jewel-1.jpg')] h-[430px] bg-cover bg-center flex items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-3 bg-black/60 p-2 rounded-md">
        <h1 className="text-2xl text-white font-bold">
          Do more with{" "}
          <span className="text-golden uppercase font-extrabold">Juwelo</span>
        </h1>
        <p className="text-md text-white">
          Browse and purchase products in various styles and materials.
        </p>

        <button
          onClick={handleGrabOrder}
          className="bg-black cursor-pointer text-white rounded-md p-2 py-2 w-32 text-center hover:opacity-90"
        >
          Mining Order
        </button>
      </div>
    </div>
  );
};

export default Grab;