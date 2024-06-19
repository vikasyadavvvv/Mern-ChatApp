import Sidebar from "../../Component/Sidebar/Sidebar";
import MessageContainer from "../../Component/message/MessageContainer";

const Home = () => {
    return (  
        <div className='flex flex-col sm:flex-row h-screen w-screen overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <div className='flex flex-col h-64 sm:h-64 sm:w-1/3 md:w-1/4 lg:w-1/5 overflow-auto'> {/* Sidebar container with responsive height */}
                <Sidebar />
            </div>
            <div className='flex-1 flex flex-col h-full overflow-auto'>
                <MessageContainer />
            </div>
        </div>
    );
}
 
export default Home;
