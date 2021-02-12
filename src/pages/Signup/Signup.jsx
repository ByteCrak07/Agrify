import { useState } from "react";
import { useHistory } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
//Images
import logo from "../../assets/logo192.png";
import bg from "../../assets/farming.jpg"
//Components
import Loader from "../../components/Loaders/LoginLoader";
import NetworkErrModal from "../../components/Modals/NetworkErrModal";

function Signup(props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });
  const [valid, setValid] = useState({
    name: true,
    email: true,
    password: true,
    nContent: "",
    eContent: "",
    pContent: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const formHandler = (e) => {
    if (e.target.id !== "remember") {
      setState({ ...state, [e.target.id]: e.target.value });
    } else {
      setState({ ...state, remember: !state.remember });
    }
  };

  const signinHandler = () => {
    setIsLoading(true);
    firebase
      .auth().createUserWithEmailAndPassword(state.email, state.password)
      .then((userCredential) => {
        let user = userCredential.user;
        user.updateProfile({
          displayName: state.name
        }).then(() => {
          setIsLoading(false);
          let authData = JSON.stringify({
            name: state.name,
            email: state.email,
            password: state.password,
          });
          if (state.remember) {
            window.localStorage.setItem("auth_data", authData);
          } else {
            window.sessionStorage.setItem("auth_data", authData);
          }
          props.setIsLoggedIn("true");
        })

      })
      .catch((err) => {
        setIsLoading(false)
        if (err.code === "auth/email-already-in-use") {
          setValid({
            name: true,
            email: false,
            password: true,
            nContent: "",
            eContent: "A user with this email already exists!",
            pContent: "",
          });
        } else if (err.code === "auth/weak-password") {
          setValid({
            name: true,
            email: true,
            password: false,
            nContent: "",
            eContent: "",
            pContent: "Weak password",
          });
        }
        else {
          setShowModal(true)
        }
      })
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // form validation
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let Valid = true;
    let Validobj = { ...valid };
    if (state.name === "") {
      Validobj = { ...Validobj, name: false, nContent: "Name is required" };
      Valid = false;
    } else {
      Validobj = { ...Validobj, name: true, nContent: "" };
    }
    if (state.email === "") {
      Validobj = { ...Validobj, email: false, eContent: "Email is required" };
      Valid = false;
    } else if (!re.test(String(state.email).toLowerCase())) {
      Validobj = {
        ...Validobj,
        email: false,
        eContent: "Enter valid email id",
      };
      Valid = false;
    } else {
      Validobj = { ...Validobj, email: true, eContent: "" };
    }
    if (state.password === "") {
      Validobj = {
        ...Validobj,
        password: false,
        pContent: "Password is required",
      };
      Valid = false;
    } else {
      Validobj = { ...Validobj, password: true, pContent: "" };
    }
    setValid(Validobj);
    if (!Valid) return;

    //signin function
    signinHandler();
  };

  return (
    <>
      {showModal ? <NetworkErrModal setShowModal={setShowModal} /> : ""}
      <div className="w-full h-full">
        <div
          className="fixed w-screen h-screen bg-gray-700"
          style={{ height: "calc(var(--vh, 1vh) * 100)", backgroundImage: `url(${bg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundAttachment: "fixed" }}
        ></div>
        <div className="container mx-auto px-4" style={{ paddingTop: "5vh" }}>
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full sm:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-900 border-0 opacity-90">
                <img className="mx-auto h-36 w-36" src={logo} alt="logo" />
                <h1
                  className="w-full text-center -mt-6"
                  style={{
                    fontFamily: "Lobster, cursive",
                    color: "rgb(161,214,61)",
                    fontSize: 30,
                  }}
                >
                  Agrify
                </h1>
                <div className="flex-auto px-4 py-10 pt-0 relative">
                  {isLoading ? <Loader /> : ""}
                  <div className="text-gray-300 text-center mb-3 font-bold">
                    Sign up
                  </div>
                  <form autoComplete="off" spellCheck="false">
                    <div className="relative w-full mb-5">
                      <label
                        className="block uppercase text-gray-300 text-xs font-bold mb-2"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Name"
                        value={state.name}
                        onChange={formHandler}
                        autoFocus
                      />
                      {valid.name ? (
                        ""
                      ) : (
                          <div className="text-red-600 text-xs -mb-4">
                            <i className="fas fa-exclamation-triangle mx-1"></i>
                            {valid.nContent}
                          </div>
                        )}
                    </div>

                    <div className="relative w-full mb-5">
                      <label
                        className="block uppercase text-gray-300 text-xs font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Email"
                        value={state.email}
                        onChange={formHandler}
                      />
                      {valid.email ? (
                        ""
                      ) : (
                          <div className="text-red-600 text-xs -mb-4">
                            <i className="fas fa-exclamation-triangle mx-1"></i>
                            {valid.eContent}
                          </div>
                        )}
                    </div>

                    <div className="relative w-full mb-5">
                      <label
                        className="block uppercase text-gray-300 text-xs font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                        placeholder="Password"
                        value={state.password}
                        onChange={formHandler}
                      />
                      {valid.password ? (
                        ""
                      ) : (
                          <div className="text-red-600 text-xs -mb-4">
                            <i className="fas fa-exclamation-triangle mx-1"></i>
                            {valid.pContent}
                          </div>
                        )}
                    </div>
                    <div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          id="remember"
                          type="checkbox"
                          className="form-checkbox ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          value={state.remember}
                          onChange={formHandler}
                        />
                        <span className="ml-2 text-sm font-semibold text-gray-300">
                          Remember me
                        </span>
                      </label>
                    </div>

                    <div className="text-center mt-6">
                      <button
                        className="bg-gray-600 text-white hover:bg-gray-500 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                        onClick={(e) => submitHandler(e)}
                      >
                        Sign up
                      </button>
                    </div>
                  </form>
                  <h2 className="text-white ml-3">
                    Already a user?{" "}
                    <span
                      className="text-blue-600 cursor-pointer"
                      onClick={() => history.push("/login")}
                    >
                      Login
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
