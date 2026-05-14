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
  const [improving, setImproving] = useState(false);
  const [improvedData, setImprovedData] = useState(null);
  //fetch resumes
  const fetchResumes=async()=>{
    try{
      setLoading(true);
      const resumeId=localStorage.getItem("resumeId");
      const res=await axios.get(`/resume-api/resume/${resumeId}`,{withCredentials:true});
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
      const res=await axios.post(`/analysis-api/run/${resumeId}`,{withCredentials: true});
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
      await axios.delete(`/analysis-api/${analysis._id}`,{withCredentials:true});
    }
    await axios.delete(`/resume-api/${resumeId}`,{withCredentials:true});
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
      const storedId=localStorage.getItem("analysisId");
      // Look for ID in all possible shapes of the analysis object
      const targetId= 
        analysis?.analysisId|| 
        analysis?._id|| 
        analysis?.analysis?._id||(storedId!=="undefined"?storedId:null);
      console.log("Full Analysis State:", analysis);
      console.log("Determined Target ID:", targetId);
      if(!targetId||targetId==="undefined"){
        setError("No analysis found. Please re-analyze your resume.");
        setGeneratingPlan(false);
        return;
      }
      const res=await axios.post(`/studyplan-api/generate/${targetId}`,{},{withCredentials:true});
      localStorage.setItem("analysisId", targetId);
      navigate("/study-plan");
    }
    catch(err){
      console.log(err);
      setError(err.response?.data?.message||"Failed to generate study plan");
    }
    finally{
      setGeneratingPlan(false);
    }
  };

  // improve resume
  const handleImproveResume=async()=>{
    try {
      setImproving(true);
      setError(null);
      const payload={
        resumeText:analysis.resumeText,
        jobDescription:localStorage.getItem("jobDescription")||"Software Engineer Role",
        missingKeywords:analysis.keywordsMissing||analysis.missingKeywords||[],
      };
      console.log("Improvement Payload:", payload);
      const res = await axios.post("/improve-resume-api/generate",payload,{withCredentials:true});
      setImprovedData(res.data);
      // Scroll to the improved section
      setTimeout(()=>{
        document.getElementById("improved-section")?.scrollIntoView({ behavior: "smooth" });
      },500);
    } 
    catch(err){
      console.log(err);
      setError(err.response?.data?.message||"Failed to improve resume");
    } 
    finally{
      setImproving(false);
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

              <button 
                onClick={handleImproveResume} 
                disabled={improving}
                className="mt-6 ml-4 h-11 px-6 rounded-md border border-black hover:bg-[#fafafa] text-black text-sm font-medium transition disabled:opacity-50"
              >
                {improving ? "Optimizing..." : "Improve Resume"}
              </button>

              {/* MATCH METRICS (Moved here) */}
              {(analysis.matchScore || analysis.atsScore) !== undefined && (
                <div className={`${featureCard} mt-8`}>
                  <h2 className={sectionTitle}>Match Metrics</h2>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className={bodyText}>Keyword Match</p>
                      <p className="font-semibold">{analysis.matchScore || analysis.atsScore || 0}%</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={bodyText}>JD Alignment</p>
                      <p className="font-semibold">{(analysis.matchScore || analysis.atsScore) >= 80 ? "High" : "Medium"}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={bodyText}>Role Fit</p>
                      <span className={keywordMatched}>Strong Fit</span>
                    </div>
                  </div>
                </div>
              )}
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
                    <p className={scoreText}>{analysis.matchScore || analysis.atsScore || 0}%</p>
                    <p className={(analysis.matchScore || analysis.atsScore) >= 70 ? scoreSuccess : scoreWarning}>
                      {(analysis.matchScore || analysis.atsScore) >= 70 ? (analysis.matchScore ? "Strong Match" : "Strong Resume") : "Needs Improvement"}
                    </p>
                  </div>
                </div>
                {/* FORMAT SCORE */}
              {analysis.formatScore !== undefined && (
                <div className={featureCard}>
                  <h2 className={sectionTitle}>Resume Formatting</h2>
                    <div className="mt-6">
                    <p className={scoreText1}>{analysis.formatScore}%</p>
                    <p className={mutedText}>Formatting Quality Score</p>
                  </div>
                </div>
              )}
               {/* READABILITY SCORE */}
               {analysis.readabilityScore !== undefined && (
                <div className={featureCard}>
                   <h2 className={sectionTitle}>Readability Score</h2>
                    <div className="mt-6">
                       <p className={scoreText1}>{analysis.readabilityScore}%</p>
                        <p className={mutedText}> Resume Readability Analysis</p>
                    </div>
                </div>
               )}
                {/* MATCHED KEYWORDS */}
                <div className={featureCard}>
                  <h2 className={sectionTitle}>Matched Keywords</h2>
                  <div className="flex flex-wrap gap-3 mt-6">
                    {(analysis.keywordsMatched || analysis.matchedKeywords)?.map((keyword,index)=>(
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
                    {(analysis.keywordsMissing || analysis.missingKeywords)?.map((keyword,index)=>(
                          <span key={index} className={keywordMissing}>
                            {keyword}
                          </span>
                        ))}
                  </div>
                </div>
                {/* SUGGESTIONS ONLY (Metrics moved to left) */}
                <div className="w-full">
                  <div className={suggestionBox}>
                    <h2 className={sectionTitle}>AI Suggestions</h2>
                    <ul className="mt-6 space-y-4">
                      {analysis.suggestions?.map((item, index) => (
                        <li key={index} className={bodyText}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* GENERATE STUDY PLAN BUTTON */}
                <button
                  onClick={handleGenerateStudyPlan}
                  disabled={generatingPlan}
                  className={`${primaryBtn} w-full ${generatingPlan ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {generatingPlan ? 'Generating Study Plan...' : 'Generate Study Plan'}
                </button>
              </div>
            )
          }
        </div>

        {/* IMPROVED RESUME SECTION */}
        {improvedData && (
          <div id="improved-section" className="mt-16 pt-16 border-t border-[#e5e5e5]">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className={heroTitle}>Optimized Resume</h2>
                <p className={`${bodyText} mt-2`}>AI has rewritten your resume for maximum ATS compatibility.</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className={mutedText}>Old Score</p>
                    <p className="text-2xl font-bold text-gray-400">{improvedData.oldScore}%</p>
                  </div>
                  <div className="text-3xl font-light text-gray-300">→</div>
                  <div className="text-center">
                    <p className={mutedText}>New Score</p>
                    <p className="text-4xl font-bold text-green-600">{improvedData.newScore}%</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-green-600 mt-1">+{improvedData.scoreImprovement}% Improvement</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ORIGINAL TEXT */}
              <div className={featureCard}>
                <h3 className={cardTitle}>Original Text</h3>
                <div className="mt-6 p-6 bg-[#fafafa] rounded-xl font-mono text-sm whitespace-pre-wrap h-[600px] overflow-y-auto border border-[#f0f0f3]">
                  {analysis.resumeText}
                </div>
              </div>

              {/* IMPROVED TEXT */}
              <div className={featureCard}>
                <h3 className={cardTitle}>AI Optimized Text</h3>
                <div className="mt-6 p-6 bg-white rounded-xl font-mono text-sm whitespace-pre-wrap h-[600px] overflow-y-auto border border-green-100 shadow-sm">
                  {improvedData.improvedResume}
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center gap-4">
              <button 
                onClick={()=>{setImprovedData(null);
                  window.scrollTo({top:0,behavior:'smooth'});
                }}
                className={secondaryBtn}
              >
                Back to Analysis
              </button>
              <button 
                className={primaryBtn}
                onClick={async()=>{
                  try{
                    const res = await axios.post("/pdf-api/generate",{improvedResume: improvedData.improvedResume},{withCredentials:true});
                    window.open(`${res.data.downloadUrl}`,"_blank");
                  } 
                  catch(err){
                    setError("PDF generation failed");
                  }
                }}
              >
                Download Optimized PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  </div>
);
}
export default Dashboard;