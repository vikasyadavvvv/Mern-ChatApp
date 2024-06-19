import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogOut";

const LogoutButton = () => {
    const { loading, logout } = useLogout();
    return (
        <div className='mt-auto flex justify-center items-center p-4'>
            {!loading ? (
                <BiLogOut 
                    className='w-8 h-8 text-white cursor-pointer hover:text-red-500 transition duration-200' 
                    onClick={logout} 
                />
            ) : (
                <span className='loading loading-spinner'></span>
            )}
        </div>
    );
}

export default LogoutButton;
