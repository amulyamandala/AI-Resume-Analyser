import React, {useEffect, useState} from "react";
import axios from "axios";
import {FileText,Trash2} from "lucide-react";
import {useNavigate} from "react-router";
import {
  pageWrapper,
  sectionWrapper,
  container,
  sectionTitle,
  mutedText,
  profileWrapper,
  profileGrid,
  profileLabel,
  profileValue,
  historyCard,
  historyTitle,
  historyText,
  profileSectionTitle,
  divider,
  emptyState,
} from "../styles/common";
function UserProfile() {
const [password,setPassword]=useState("");
const [newpassword,setNewpassword]=useState("");
const [msg,setMsg]=useState("");
const [user,setUser]=useState(null);
const [history,setHistory]=useState([]);
const [resumes,setResumes]=useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);
const navigate=useNavigate();
  // FETCH USER
  const fetchUser=async()=>{
  try{
    const res=await axios.get("http://localhost:5000/user-api/profile",{withCredentials:true});
    setUser(res.data.payload);
   }
    catch(err){
      console.log(err);
      setError("Failed to fetch user");
    }
  };
  // FETCH HISTORY
  const fetchHistory=async()=>{
    try{
      const resumeId=localStorage.getItem("resumeId");
      if(!resumeId) 
        return;
      const res=await axios.get(`http://localhost:5000/analysis-api/history/${resumeId}`,{withCredentials:true});
      setHistory(res.data.history);
    }
    catch(err){
      console.log(err);
      setError("Failed to fetch history");
    }
  };
//update password
 const handlePasswordUpdate=async()=>{
  try{
    const res=await axios.put("http://localhost:5000/user-api/password",{email:user.email,password,newpassword});
    setMsg(res.data.message);
    setPassword("");
    setNewpassword("");
  }
  catch(err){
    console.log(err);
    setMsg(err.response?.data?.message ||"Password update failed");
  }
};
 const fetchUserResumes=async()=>{
  try{
    const res=await axios.get("http://localhost:5000/resume-api/my-resumes",{withCredentials:true});
    setResumes(res.data.payload);
  }
  catch(err){
    console.log(err);
  }
};
useEffect(()=>{
  setLoading(true);
  Promise.all([fetchUser(),fetchHistory(),fetchUserResumes()])
  .finally(()=>{setLoading(false);});
},[]);
const handleDeleteResume=async (resumeId)=>{
  try{
    await axios.delete(`http://localhost:5000/resume-api/${resumeId}`,{withCredentials:true});
    setResumes(resumes.filter((resume)=>resume._id!==resumeId));
   }
  catch(err){
    console.log(err);
    setError("Failed to delete resume");
  }
};
 //GET ANALYSIS OF CLICKED RESUME 
const handleOpenResume=async(resumeId)=>{
  try{
    const res=await axios.get(`http://localhost:5000/analysis-api/${resumeId}`,{withCredentials:true});
    localStorage.setItem("resumeId",resumeId);
    localStorage.setItem("analysis",JSON.stringify(res.data.analysis));
    navigate("/dashboard");
  }
  catch(err){
    console.log(err);
  }
};
  return (
    <div className={pageWrapper}>
      <section className={sectionWrapper}>
        <div className={container}>
          {/* TITLE */}
          <h1 className={profileSectionTitle}>User Profile</h1>
          {/* ERROR */}
          {error && (
              <p className="text-red-500 mb-6">{error}</p>
            )
          }
          {/* LOADING */}
          {
            loading && (
              <p className={mutedText}>Loading...</p>
            )
          }
          {/* USER DETAILS */}
          {
            user && (
              <div className={profileWrapper}>
                <div className={profileGrid}>
                  <div>
                    <p className={profileLabel}>Name</p>
                    <p className={profileValue}>{user.name}</p>
                  </div>
                  <div>
                    <p className={profileLabel}>Email Address</p>
                    <p className={profileValue}>{user.email}</p>
                  </div>
                </div>
              </div>
            )
          }
         <div className={divider}></div>
           <div className={profileWrapper}>
             <h2 className={sectionTitle}> Update Password</h2>
               <div className="mt-6 space-y-5">
                 <input type="password" placeholder="Current Password" value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full h-12 border border-[#d4d4d4] rounded-lg px-4 outline-none"
                   />
                <input type="password" placeholder="New Password" value={newpassword} onChange={(e)=>setNewpassword(e.target.value)}
                className="w-full h-12 border border-[#d4d4d4] rounded-lg px-4 outline-none" />
               <button onClick={handlePasswordUpdate} className="h-11 px-6 rounded-md bg-black text-white text-sm font-medium">
                Update Password
                </button>
                { msg && (<p className={mutedText}>{msg}</p>)}
            </div>
             <div className={divider}></div>
           <div>
           <h2 className={sectionTitle}>Uploaded Resumes</h2>
             <div className="mt-6 space-y-4">{resumes.length>0?resumes.map((resume)=>(
              <div key={resume._id} className="flex items-center justify-between bg-white border border-[#e5e5e5] rounded-xl p-5 hover:shadow-sm transition">
             {/* LEFT */}
             <div onClick={()=>handleOpenResume(resume._id)}
              className="flex items-center gap-4 flex-1 cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center">
            <FileText size={22} />
           </div>
              <div>
                <p className="text-base font-semibold text-[#171717]">{resume.fileName}</p>
                <p className={mutedText}>
                  { new Date(resume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
               {/* DELETE BUTTON */}
               <button onClick={()=>handleDeleteResume(resume._id)}
               className="ml-4 text-[#737373] hover:text-red-500 transition">
                <Trash2 size={20} />
                </button>
               </div>
               )):(
              <p className={emptyState}>No resumes uploaded yet.</p>
              )
             }
            </div>
          </div>
        </div>
          {/* DIVIDER */}
          <div className={divider}></div>
          {/* HISTORY */}
          <div>
            <h2 className={sectionTitle}>Resume Analysis History</h2>
            <div className="mt-6 space-y-5">
              {history.length>0? history.map((item)=>(
                    <div key={item._id} className={historyCard}>          
                      <div className="flex items-center justify-between">
                        <h3 className={historyTitle}>
                          ATS Score:{" "}{item.atsScore}%
                        </h3>
                        <p className={mutedText}>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={historyText}>
                        Matched Keywords:{" "}
                        {item.keywordsMatched?.join(", ")}
                      </p>
                      <p className={historyText}>
                        Missing Keywords:{" "}
                        {item.keywordsMissing?.join(", ")}
                      </p>
                    </div>
                  ))
                :(
                    <p className={emptyState}> No analysis history found.</p>
                  )
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default UserProfile;