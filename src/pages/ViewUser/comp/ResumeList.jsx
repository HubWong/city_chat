import {ResumeCard} from './ResumeCard';
import './ResumeList.css';

export const ResumeList = ({ resumes }) => {
  return (
    <div className="resume-list">
      {resumes.map(resume => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
};

 