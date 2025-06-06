import { useState } from "react";
import API_URL from "../components/api.tsx";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const postLogin = async (un: string, pw: string) => {
    try {
      console.log("Logging in with:", un, "|", pw);
      const response = await API_URL.post("/login", {
        username: un,
        password: pw,
      });
      if (["user", "admin", "gov"].includes(response.data)) {
        console.log(`Login successful as ${response.data}`);
      } else {
        console.log("Login failed");
        return;
      }
      localStorage.setItem("acc", response.data);
      localStorage.setItem("username", un);
      localStorage.setItem("password", pw);
      window.location.href = "/#/map";
    } catch (error) {
      console.error("Error logging:", error);
      return "failed";
    }
  };
  return (
    <div className="h-screen flex items-center justify-center">
      <img
        className="absolute w-69/70 h-69/70 -z-10 object-cover object-[50%_80%] blur-xs"
        draggable={false}
        //src="src/assets/bg.jpg"
        alt="bg"
      ></img>
      <div className="bg-gray-50 px-10 py-8 rounded-2xl shadow-2xl w-1/4 border-2 border-gray-200 flex flex-col items-center">
        <img
          src={"src/assets/omura-trans.svg"}
          className="w-70"
          draggable={false}
        />
        <h1 className="text-3xl font-bold text-center">Login</h1>
        <h2 className="text-lg text-black/40 mb-8 text-center">
          Please enter your details
        </h2>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            className="bg-gray-200 p-2 rounded-2xl"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type="password"
            className="bg-gray-200 p-2 rounded-2xl"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <div className="grid grid-cols-2 gap-4 my-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4 cursor-pointer"></input>
              <p className="">Remember for 30 days</p>
            </div>
            <a className="underline text-orange-600 text-end">
              Forgot password
            </a>
          </div>

          <button
            className="bg-orange-600 p-2 rounded-3xl text-white hover:bg-orange-700 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (!username || !password) {
                alert("Please fill in all fields");
              } else {
                postLogin(username, password);
              }
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
