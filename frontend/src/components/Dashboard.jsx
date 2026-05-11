import React, {useEffect,useState} from "react";
import axios from "axios";
import { Document, Page,pdfjs} from "react-pdf";
import { useNavigate } from "react-router";
import {
  pageWrapper,
  sectionWrapper,
  container,
  dashboardGrid,
  featureCard,
  resumeCard,
  heroTitle,
  sectionTitle,
  cardTitle,
  bodyText,
  mutedText,
  scoreText,
  scoreText1,
  scoreSuccess,
  scoreWarning,
  keywordMatched,
  keywordMissing,
  suggestionBox,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";
import "../App.css"
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;
import { renderAsync } from "docx-preview";
import { useRef } from "react";
function Dashboard() {
  const navigate = useNavigate();
  const [resumes,setResumes]=useState([]);
  const [analysis,setAnalysis]=useState(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [numPages,setNumPages]=useState(0);
  const [generatingPlan,setGeneratingPlan]=useState(false);
  //fetch resumes
  const fetchResumes=async()=>{
    try{
      setLoading(true);
      const resumeId=localStorage.getItem("resumeId");
      const res=await axios.get(`http://localhost:5000/resume-api/resume/${resumeId}`,{withCredentials:true});
      setResumes([res.data.payload]);
    } 
    catch(err){
      console.log(err);
      setError("Failed to fetch resumes");
    } 
    finally{
      setLoading(false);
    }
  };
  //analyze resume
  const handleAnalyze=async(resumeId)=>{
    try{
      const res=await axios.post(`http://localhost:5000/analysis-api/run/${resumeId}`,{withCredentials: true});
      setAnalysis(res.data.analysis);
    } 
    catch(err){
      console.log(err);
      setError("Analysis failed");
    }
  };
  //delete
  const handleDelete=async(resumeId)=>{
   try{
    if(analysis?._id){
      await axios.delete(`http://localhost:5000/analysis-api/${analysis._id}`,{withCredentials:true});
    }
    await axios.delete(`http://localhost:5000/resume-api/${resumeId}`,{withCredentials:true});
    setResumes([]);
    setAnalysis(null);
    localStorage.removeItem("resumeId");
    localStorage.removeItem("analysis");
   }
   catch(err){
    console.log(err);
    setError("Delete failed");
   }
 };

  //generate study plan and redirect
  const handleGenerateStudyPlan=async()=>{
    try{
      setGeneratingPlan(true);
      if(!analysis?._id){
        setError("No analysis found. Please analyze your resume first.");
        return;
      }
      const res=await axios.post(
        `http://localhost:5000/studyplan-api/generate/${analysis._id}`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem("analysisId",analysis._id);
      navigate("/study-plan");
    }catch(err){
      console.log(err);
      setError(err.response?.data?.message || "Failed to generate study plan");
    }finally{
      setGeneratingPlan(false);
    }
  };
  useEffect(()=>{fetchResumes();},[]);
  useEffect(()=>{
  const storedAnalysis=localStorage.getItem("analysis");
  if(storedAnalysis){
    setAnalysis(JSON.parse(storedAnalysis));
  }
},[]);

const docxRef = useRef(null);
useEffect(()=>{
  const renderDocx=async()=>{
    try{
      if(resumes[0]?.fileType==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
        const response=await fetch(resumes[0].fileUrl);
        const blob=await response.blob();
        if(docxRef.current){
          docxRef.current.innerHTML = "";
          await renderAsync(blob,docxRef.current);
        }
      }
    }
    catch(err){
      console.log(err);
    }
  };
  renderDocx();
},[resumes]);
 return (
  <div className={pageWrapper}>
    <section className={sectionWrapper}>
      <div className={container}>
        {/* HEADER */}
        <div className="mb-14">
          <h1 className={heroTitle}>Resume Dashboard</h1>
          <p className={`${bodyText} mt-4 max-w-2xl`}>
            Manage resumes, analyze ATS score,
            discover missing keywords and improve
            your job matching performance.
          </p>
        </div>
        {/* LOADING */}
        {
          loading && (
            <p className={bodyText}>Loading...</p>
          )
        }
        {/* ERROR */}
        {
          error && (
            <p className="text-red-500 mb-6">{error}</p>
          )
        }
        {/* MAIN DASHBOARD */}
       <div className={dashboardGrid}>
          {/* LEFT SIDE - RESUME */}
          {
            resumes.map((resume)=>(
              <div key={resume._id} className={featureCard}>
                <h2 className={sectionTitle}>Uploaded Resume</h2>
                <p className={`${mutedText} mt-2`}>{resume.fileName}</p>
                {/* RESUME PREVIEW */}
               <div className="w-full h-[900px] rounded-xl overflow-hidden border border-[#e5e5e5] bg-[#fafafa]">
                {resume.fileType==="application/pdf"?(
                <div className="w-full h-[900px] overflow-y-auto rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] p-6 flex justify-center">
                <Document
                file={resume.fileUrl} onLoadSuccess={({numPages})=>setNumPages(numPages)}>
                {
                 Array.from(new Array(numPages),(el,index)=>(
                 <div key={`page_${index + 1}`} className="mb-8 flex justify-center">
                  <Page pageNumber={index + 1}
                  width={450}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}/>
              </div>
               )
              )
          }
          </Document>
          </div>
                  )
                  :resume.fileType==="application/vnd.openxmlformats-officedocument.wordprocessingml.document"?(
                    <div className="w-full h-[900px] overflow-auto rounded-xl border border-[#e5e5e5] bg-[#f5f5f5] p-2 sm:p-4">
                       <div ref={docxRef} className="docx-wrapper min-w-max" />
                         </div>
                      )
                      : (
                        <div className="h-full flex items-center justify-center">
                          <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="h-11 px-6 rounded-md bg-black text-white text-sm font-medium flex items-center">
                   Open Resume
                   </a>
                        </div> )
                  }
              </div>
                {/* DELETE */}
              <button onClick={() => handleDelete(resume._id)}  className="mt-6 h-11 px-6 rounded-md bg-black hover:bg-[#1a1a1a] text-white text-sm font-medium transition">
                Delete Resume
              </button>
              </div>
            ))
          }
          {/* RIGHT SIDE - ANALYSIS */}
          {
            analysis && (
              <div className="space-y-8">
                {/* ATS SCORE */}
                <div className={featureCard}>
                  <h2 className={sectionTitle}>ATS Analysis</h2>
                  <div className="mt-6">
                    <p className={scoreText}>{analysis.atsScore}%</p>
                    <p className={analysis.atsScore>=70?scoreSuccess:scoreWarning}>
                      {analysis.atsScore >= 70? "Strong Resume": "Needs Improvement"}
                    </p>
                  </div>
                </div>
                {/* FORMAT SCORE */}
              <div className={featureCard}>
                <h2 className={sectionTitle}>Resume Formatting</h2>
                  <div className="mt-6">
                  <p className={scoreText1}>{analysis.formatScore}%</p>
                  <p className={mutedText}>Formatting Quality Score</p>
                </div>
              </div>
               {/* READABILITY SCORE */}
              <div className={featureCard}>
                 <h2 className={sectionTitle}>Readability Score</h2>
                  <div className="mt-6">
                     <p className={scoreText1}>{analysis.readabilityScore}%</p>
                      <p className={mutedText}> Resume Readability Analysis</p>
                  </div>
              </div>
                {/* MATCHED KEYWORDS */}
                <div className={featureCard}>
                  <h2 className={sectionTitle}>Matched Keywords</h2>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {analysis.keywordsMatched?.map((keyword,index)=>(
                          <span key={index} className={keywordMatched}>
                            {keyword}
                          </span>
                        ))}
                  </div>
                </div>
                {/* MISSING KEYWORDS */}
                <div className={featureCard}>
                  <h2 className={sectionTitle}>Missing Keywords</h2>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {analysis.keywordsMissing?.map((keyword,index)=>(
                          <span key={index} className={keywordMissing}>
                            {keyword}
                          </span>
                        ))}
                  </div>
                </div>
                {/* SUGGESTIONS */}
                <div className={suggestionBox}>
                  <h2 className={sectionTitle}>AI Suggestions</h2>
                  <ul className="mt-6 space-y-4">
                    {analysis.suggestions?.map((item,index)=>(
                          <li key={index} className={bodyText}>
                            • {item}
                          </li>
                        ))}
                  </ul>
                </div>

                {/* GENERATE STUDY PLAN BUTTON */}
                <button
                  onClick={handleGenerateStudyPlan}
                  disabled={generatingPlan}
                  className={`${primaryBtn} w-full ${generatingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {generatingPlan ? 'Generating Study Plan...' : 'Generate Study Plan'}
                </button>
            
              </div>
            )
          }
        </div>
      </div>
    </section>
  </div>
);
}
export default Dashboard;