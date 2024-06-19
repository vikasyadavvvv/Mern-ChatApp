import Sidebar from "../../Component/Sidebar/Sidebar";
import MessageContainer from "../../Component/message/MessageContainer";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row h-full sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default Home;
