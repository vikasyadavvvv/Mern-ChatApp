import Conversations from "./Conversations";
import LogoutButton from "./Logout";
import SearchInput from "./SearchInput";

const Sidebar = () => {
    return ( 	
        <div className='border-r border-slate-500 p-4 flex flex-col space-y-4 sm:space-y-6 md:space-y-8'>
            <div className="mt-2 sm:mt-0"> {/* Apply top margin only on small screens */}
                <SearchInput />
            </div>
            <div className='divider px-3'></div>
            <Conversations />
            <LogoutButton />
        </div>
    );
}
 
export default Sidebar;
