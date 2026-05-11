import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  pageWrapper,
  sectionWrapper,
  container,
  sectionTitle,
  cardTitle,
  bodyText,
  mutedText,
  featureCard,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

function StudyPlan() {
  const [studyPlan,setStudyPlan]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [generating,setGenerating]=useState(false);

  const generateStudyPlan=async()=>{
    try{
      setGenerating(true);
      setError(null);
      let analysisId=localStorage.getItem("analysisId");
      
      // If analysisId not found, try to get it from the stored analysis object
      if(!analysisId){
        const storedAnalysis=localStorage.getItem("analysis");
        if(storedAnalysis){
          try{
            const analysisObj=JSON.parse(storedAnalysis);
            analysisId=analysisObj._id;
          }catch(e){
            console.log("Failed to parse stored analysis");
          }
        }
      }
      
      if(!analysisId){
        setError("No analysis found. Please run an analysis first.");
        return;
      }
      const res=await axios.post(
        `http://localhost:5000/studyplan-api/generate/${analysisId}`,
        {},
        { withCredentials: true }
      );
      setStudyPlan(res.data.payload);
    }catch(err){
      console.log(err);
      setError(err.response?.data?.message || "Failed to generate study plan");
    }finally{
      setGenerating(false);
    }
  };

  useEffect(()=>{
    const fetchStudyPlan=async()=>{
      try {
        setLoading(true);
        let analysisId=localStorage.getItem("analysisId");
        
        // If analysisId not found, try to get it from the stored analysis object
        if(!analysisId){
          const storedAnalysis=localStorage.getItem("analysis");
          if(storedAnalysis){
            try{
              const analysisObj=JSON.parse(storedAnalysis);
              analysisId=analysisObj._id;
            }catch(e){
              console.log("Failed to parse stored analysis");
            }
          }
        }
        
        if(!analysisId){
          setError("No analysis found. Please run an analysis first.");
          return;
        }
        const res=await axios.get(
          `http://localhost:5000/studyplan-api/${analysisId}`,
          { withCredentials: true }
        );
        setStudyPlan(res.data.payload);
      }catch(err){
        console.log(err);
        setError(err.response?.data?.message || "Failed to fetch study plan");
      }finally{
        setLoading(false);
      }
    };

    fetchStudyPlan();
  },[]);

  if(loading){
    return (
      <div className={pageWrapper}>
        <div className={sectionWrapper}>
          <div className={container}>
            <div className="flex items-center justify-center py-20">
              <p className={mutedText}>Loading your study plan...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(error){
    return(
      <div className={pageWrapper}>
        <div className={sectionWrapper}>
          <div className={container}>
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-[#eb8e90] mb-6">{error}</p>
              <button 
                onClick={generateStudyPlan}
                disabled={generating}
                className={`${primaryBtn} ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generating ? 'Generating...' : 'Generate Study Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(!studyPlan){
    return(
      <div className={pageWrapper}>
        <div className={sectionWrapper}>
          <div className={container}>
            <div className="flex flex-col items-center justify-center py-20">
              <p className={mutedText}>No study plan found.</p>
              <button 
                onClick={generateStudyPlan}
                disabled={generating}
                className={`${primaryBtn} mt-6 ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {generating ? 'Generating...' : 'Generate Study Plan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className={pageWrapper}>
      <div className={sectionWrapper}>
        <div className={container}>
          {/* Header */}
          <div className="mb-12">
            <h1 className={sectionTitle}>Your Personalized Study Roadmap</h1>
            <p className={`${bodyText} mt-4`}>
              Follow this 4-week plan to strengthen your weak areas and improve your resume.
            </p>
          </div>

          {/* Weak Topics */}
          {studyPlan.weakTopics && studyPlan.weakTopics.length>0&&(
            <div className={`${featureCard} mb-8`}>
              <h3 className={cardTitle}>Areas to Improve</h3>
              <div className="flex flex-wrap gap-3 mt-4">
                {studyPlan.weakTopics.map((topic,idx)=>(
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-full bg-black text-white text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Weeks */}
          <div className="space-y-6">
            {studyPlan.roadmap &&
              studyPlan.roadmap.map((week,idx)=>(
                <div key={idx} className={featureCard}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-xs font-semibold">
                        Week {week.week}
                      </span>
                      <h3 className={`${cardTitle} mt-3`}>{week.title}</h3>
                    </div>
                  </div>

                  {/* Tasks */}
                  {week.tasks&&week.tasks.length>0&&(
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-[#171717] mb-3">
                        Tasks
                      </h4>
                      <ul className="space-y-2">
                        {week.tasks.map((task,taskIdx)=>(
                          <li
                            key={taskIdx}
                            className="flex items-start gap-3 text-[#60646c] text-sm"
                          >
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs font-bold flex-shrink-0 mt-0.5">
                              {taskIdx + 1}
                            </span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-12">
            <button 
              onClick={generateStudyPlan}
              disabled={generating}
              className={`${primaryBtn} ${generating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generating ? 'Generating...' : 'Generate New Plan'}
            </button>
            <button className={secondaryBtn}>Download Roadmap</button>
            <button className={secondaryBtn}>Share with Mentor</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyPlan;