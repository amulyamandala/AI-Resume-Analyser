import { useForm } from "react-hook-form";
import { NavLink ,useNavigate} from "react-router";
import { useState } from "react";
import axios from "axios";
import { GoogleLogin }from "@react-oauth/google";
import {
  pageWrapper,
  centeredFlex,
  featureCard,
  heroTitle,
  bodyText,
  mutedText,
  textInput,
  primaryBtn,
  tertiaryBtn,
  smallText,
  googleButtonContainer,
 
} from "../styles/common.js";
function Register() {
  const {register,handleSubmit,formState: { errors }}=useForm();
  const [loading,setLoading]=useState(false);
  const [apiError,setApiError]=useState(null);
  const navigate=useNavigate();
  //When user registration submitted
 const onUserRegister=async(userObj)=>{
    console.log(userObj);
    try{
      setLoading(true);
      let res=await axios.post("http://localhost:5000/user-api/register",userObj);
      if (res.status===201) {
        navigate("/login");
      }
    } catch(err){
      setApiError(err.response?.data?.message||err.message||"Registration Failed"); 
       } 
       finally{
      setLoading(false);
    }
  };

  return (
    <div className={`${pageWrapper} ${centeredFlex} px-4 py-20`}>

      {/* Card */}
      <div className={`${featureCard} w-full max-w-xl shadow-lg p-8`}>

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className={heroTitle}>
            ReZure
          </h1>

          <p className={`${bodyText} mt-3`}>
            Start building ATS friendly resumes
          </p>
        </div>

        {/* API ERROR */}
        {apiError && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {apiError}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onUserRegister)} className="space-y-5">

          {/* Names */}
            <div>

              <label className={`${smallText} block mb-2`}>
                Name
              </label>

              <input
                type="text"
                placeholder=" Enter name"
                className={textInput}
                {...register("name", {
                  required: "First name required",
                })}
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>


          {/* Email */}
          <div>

            <label className={`${smallText} block mb-2`}>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={textInput}
              {...register("email", {
                required: "Email is required",
              })}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>

            <label className={`${smallText} block mb-2`}>
              Password
            </label>

            <input
              type="password"
              placeholder="Min 8 characters"
              className={textInput}
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

         
          {/* Submit */}
          <button
            type="submit"
            className={`${primaryBtn} w-full`}
          >
            {
              loading
                ? "Creating..."
                : "Create Account"
            }
          </button>
          
          {/*Google sign in*/}
        <div className={googleButtonContainer}>
          <GoogleLogin onSuccess={async(credentialResponse)=>{
            try{

          const res =await axios.post("http://localhost:5000/user-api/google-login",{token:credentialResponse.credential},{withCredentials:true});
          console.log(res.data);
          window.location.href ="/";
        }
        catch(err){
          console.log(err);
        }
      }}
      onError={()=>{
        console.log("Google Login Failed");
      }}
    />
  </div>
        </form>

        {/* Footer */}
        <p className={`${mutedText} text-center mt-6`}>

          Already have an account?{" "}

          <NavLink
            to="/login"
            className={tertiaryBtn}
          >
            Sign In
          </NavLink>
        </p>
      </div>
    </div>
  );
}

export default Register;