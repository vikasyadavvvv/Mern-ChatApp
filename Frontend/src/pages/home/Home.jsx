import Sidebar from "../../Component/Sidebar/Sidebar";
import MessageContainer from "../../Component/message/MessageContainer";

const Home = () => {
    return (  
        <div className='flex flex-col sm:flex-row h-screen w-screen overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <div className='flex flex-col h-full sm:h-auto sm:w-1/3 md:w-1/4 lg:w-2/5 overflow-auto'>
                <Sidebar />
                <MessageContainer />
            </div>
        </div>
    );
}
 
export default Home;
