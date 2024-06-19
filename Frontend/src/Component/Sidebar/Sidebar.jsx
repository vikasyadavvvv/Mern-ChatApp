import Conversations from "./Conversations";
import LogoutButton from "./Logout";
import SearchInput from "./SearchInput";

const Sidebar = () => {
	return (
		<div className='border-r border-slate-500 p-4 flex flex-col h-full sm:h-auto'>
			<SearchInput />
			<div className='divider px-3'></div>
			<div className='flex-grow overflow-y-auto'>
				<Conversations />
			</div>
			<LogoutButton />
		</div>
	);
};
export default Sidebar;
