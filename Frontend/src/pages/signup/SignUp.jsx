import { Link } from "react-router-dom";
import GenderCheck from "./GenderCheckBox";
import { useState } from "react";
import useSignup from "../../hooks/usesignup.js";

const SignUp = () => {
	const [Inputs, setInputs]=useState({
		fullName:'',
		username:'',
		password:'',
		confirmPassword:'',
		gender:''
	})

	const {loading,signup}=useSignup()
	const handleCheckboxChange=(gender)=>{
            setInputs({...Inputs,gender})
	}

	const handleSubmit= async(e)=>{
		e.preventDefault()
		await signup(Inputs);
	}
    return ( 
        <>
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
        <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'> ChatApp</span>
				</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                    <label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input
							type='text'
							placeholder='Enter Fullname'
							className='w-full input input-bordered  h-10'
							value={Inputs.fullName}
							onChange={(e)=> setInputs({...Inputs,fullName:e.target.value})}
						/>
                    </div>
                    <div>
                    <label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input
							type='text'
							placeholder='Enter Username'
							className='w-full input input-bordered h-10'
							value={Inputs.username}
							onChange={(e)=> setInputs({...Inputs,username:e.target.value})}

						
						/>

                    </div>
                    <div>
                    <label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={Inputs.password}
							onChange={(e)=> setInputs({...Inputs,password:e.target.value})}

						
						/>

                    </div>
                    <div>
                    <label className='label'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={Inputs.confirmPassword}
							onChange={(e)=> setInputs({...Inputs,confirmPassword:e.target.value})}

							
						/>

                    </div>

                <GenderCheck  onCheckboxChange={handleCheckboxChange} selectedGender={Inputs.gender} />

                    
                    <Link to={"/login"} className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block'>
					
						Already have an account?
					</Link>
                    <div>
                    <button className='btn btn-block btn-sm mt-2 border border-slate-700 'disabled={loading}>
					{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
						
						</button>

                    </div>

                </form>

            </div>
            </div>

        </>
     );
}
 
export default SignUp;