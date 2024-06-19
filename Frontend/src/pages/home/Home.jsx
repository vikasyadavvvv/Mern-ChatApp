import Sidebar from "../../Component/Sidebar/Sidebar";
import MessageContainer from "../../Component/message/MessageContainer";

const Home = () => {
    return (  
        <div className='flex flex-col sm:flex-row h-screen w-screen rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
            <Sidebar className='w-full sm:w-1/3 md:w-1/4 lg:w-1/5' /> {/* Adjust width based on screen size */}
            <MessageContainer className='flex-1' /> {/* Fill remaining space */}
        </div>
    );
}
 
export default Home;
