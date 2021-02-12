import { Switch, Route, Redirect } from "react-router-dom";
//Components
import Sidebar from "../../components/Sidebar/Sidebar";
//Image
import bg from "../../assets/Wave-33.3s-1920px.svg"
//Pages
import Home from "../Home/Home"
import Cotton from "../Cotton/Cotton"

function Dashboard(props) {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  return (
    <>
      <div className="bg-gray-100 h-full w-full absolute"></div>
      <Sidebar setIsLoggedIn={props.setIsLoggedIn} />
      <div
        className="relative flex flex-col ml-0 sm:ml-14 lg:ml-64 h-screen"
        style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      >
        <div className="flex-grow bg-gray-100 pb-10">
          <div className="fixed h-screen w-screen" style={{ backgroundImage: `url(${bg})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", top: "-40vh" }}></div>
          <div className="relative">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/cotton" exact component={Cotton}/>
            <Redirect path="*" to="/" />
            </Switch>
            </div>
        </div>
        {/* Footer */}
        <div className="border-t-2 bg-gray-100">
          <h2 className="text-center p-3 text-gray-400">© 2021 AGRIFY</h2>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
