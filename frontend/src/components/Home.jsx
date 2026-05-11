import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore.js";
import {
  pageWrapper,
  sectionWrapper,
  container,
  centeredFlex,
  heroSection,
  heroGradient,
  heroContent,
  heroTitle,
  bodyText,
  dashboardGrid,
  featureCard,
  cardTitle,
  mutedText,
  sectionTitle,
  textInput,
} from "../styles/common";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  //select file
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  //upload resume
  const handleUpload = async () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    if (!selectedFile) {
      setError("Please select a resume");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const formData = new FormData();
      formData.append("resume", selectedFile);
      
      // Save JD to localStorage for the improvement feature
      if (jobDescription.trim()) {
        localStorage.setItem("jobDescription", jobDescription);
      } else {
        localStorage.removeItem("jobDescription");
      }

      const res=await axios.post( "http://localhost:5000/resume-api/upload",formData,
        {
          withCredentials: true,
        }
      );
      const resumeId = res.data.resume._id;
      localStorage.setItem("resumeId", resumeId);

      let analysisRes;
      if (jobDescription.trim()) {
        // If JD is provided, run Job Match Analysis
        analysisRes = await axios.post(
          `http://localhost:5000/job-match-api/run/${resumeId}`,
          { jobDescription },
          { withCredentials: true }
        );
      } else {
        // Fallback to standard ATS Analysis
        analysisRes = await axios.post(
          `http://localhost:5000/analysis-api/run/${resumeId}`,
          {},
          { withCredentials: true }
        );
      }

      localStorage.setItem(
        "analysis",
        JSON.stringify(analysisRes.data.analysis ? { ...analysisRes.data.analysis, resumeText: analysisRes.data.resumeText } : analysisRes.data)
      );
      
      const savedAnalysis = analysisRes.data.analysis || analysisRes.data;
      if (savedAnalysis && savedAnalysis._id) {
        localStorage.setItem("analysisId", savedAnalysis._id);
      }
      
      navigate("/dashboard");
    } 
    catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        "Resume upload failed"
      );
    } finally {
      setLoading(false);
    }
  };
  return (

    <div className={pageWrapper}>

      {/* HERO SECTION */}
      <section className={heroSection}>

        <div className={heroGradient}></div>

        <div className={heroContent}>

          <h1 className={heroTitle}>
            Build ATS Friendly Resumes With AI
          </h1>

          <p className={`${bodyText} max-w-2xl mx-auto mt-6`}>
            Upload your resume, analyze ATS score, identify missing
            keywords, and improve your chances of getting shortlisted.
          </p>

          {/* JOB DESCRIPTION INPUT */}
          <div className="w-full max-w-2xl mx-auto">
            <textarea
              placeholder="Paste Job Description here (Optional)..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className={`${textInput} h-32 py-4 resize-none shadow-sm`}
            />
          </div>

          {/* FILE INPUT */}
          <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-md mx-auto">

            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="block w-full max-w-md text-sm text-[#60646c]
              file:mr-4 file:py-4 file:px-6
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-black file:text-white
              hover:file:bg-[#1a1a1a]"
            />

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* UPLOAD BUTTON */}
            <button
              onClick={handleUpload}
              className="h-14 px-10 rounded-lg bg-black hover:bg-[#1a1a1a]
              text-white text-base font-medium transition duration-200"
            >

              {
                loading
                  ? "Uploading..."
                  : "Upload Resume"
              }

            </button>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className={sectionWrapper}>

        <div className={container}>

          <div className="text-center mb-16">

            <h2 className={sectionTitle}>
              Powerful Resume Analysis
            </h2>

            <p className={`${bodyText} mt-4 max-w-2xl mx-auto`}>
              Everything you need to optimize your resume
              and improve job match scores.
            </p>

          </div>

          <div className={dashboardGrid}>

            {/* CARD 1 */}
            <div className={featureCard}>

              <h3 className={cardTitle}>
                ATS Score Analysis
              </h3>

              <p className={`${mutedText} mt-3`}>
                Get instant ATS score evaluation based on
                keywords, formatting, and resume readability.
              </p>

            </div>

            {/* CARD 2 */}
            <div className={featureCard}>

              <h3 className={cardTitle}>
                Keyword Matching
              </h3>

              <p className={`${mutedText} mt-3`}>
                Discover missing keywords and improve
                resume visibility for recruiters.
              </p>

            </div>

            {/* CARD 3 */}
            <div className={featureCard}>

              <h3 className={cardTitle}>
                AI Suggestions
              </h3>

              <p className={`${mutedText} mt-3`}>
                Receive personalized recommendations to
                strengthen projects, skills, and experience.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;