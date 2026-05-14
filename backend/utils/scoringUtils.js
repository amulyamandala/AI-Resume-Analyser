import natural from "natural";
import { removeStopwords } from "stopword";

export const techKeywords=[
  "javascript", "typescript", "react", "next.js", "node.js", "express", 
  "mongodb", "mysql", "postgresql", "redis", "docker", "kubernetes", 
  "aws", "firebase", "git", "github", "rest api", "graphql", "jwt", 
  "tailwind css", "machine learning", "data structures", "algorithms", 
  "python", "java", "c++", "c", "html", "css", "problem solving", "communication"
];

export const calculateAtsScore=(text,jdText)=>{
  const tokenizer=new natural.WordTokenizer();
  const jdTextLower=jdText.toLowerCase();
  const textLower=text.toLowerCase();
  
  // 1. Clean JD using the "75% logic"
  const jdTokens=tokenizer.tokenize(jdTextLower);
  const cleanJDTokens=removeStopwords(jdTokens);
  const cleanJD=cleanJDTokens.join(" ");

  // 2. Identify keywords in JD
  const jdKeywords=techKeywords.filter(skill=> cleanJD.includes(skill.toLowerCase()) || jdTextLower.includes(skill.toLowerCase()));

  if(jdKeywords.length===0){
  const matched=techKeywords.filter(skill=>cleanResume.includes(skill.toLowerCase()));
  const missing=techKeywords.filter(skill=>!matched.includes(skill));
  const score=Math.round((matched.length /techKeywords.length) * 100);
  return {score,matched,missing,jdKeywords:techKeywords};
}

  // 3. Clean Resume text
  const resumeTokens=tokenizer.tokenize(textLower);
  const cleanResumeTokens=removeStopwords(resumeTokens);
  const cleanResume=cleanResumeTokens.join(" ");

  // 4. Identify matched keywords
  const matched=jdKeywords.filter(skill => 
    cleanResume.includes(skill.toLowerCase())||textLower.includes(skill.toLowerCase())
  );

  const missing=jdKeywords.filter(skill=>!matched.includes(skill));
  const score=Math.round((matched.length/jdKeywords.length)*100);

  return {score,matched,missing,jdKeywords};
};
