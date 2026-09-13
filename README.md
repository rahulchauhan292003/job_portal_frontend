# Job Portal

A full-stack job portal built with React.js, Node.js, Express.js, and MongoDB.

The application allows applicants to browse jobs, dynamically answer job-specific questionnaires, apply to individual jobs, and use the "Apply to All" flow. Recruiters can create and manage jobs and view applications.

## Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Tailwind CSS
- React Hook Form
- Axios
- Redux Toolkit

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Features

### Applicant
- Signup/Login
- Browse and search jobs
- View job details
- Dynamic application forms
- Apply to individual jobs
- Select multiple jobs and use Apply to All
- View applied jobs
- Prevent duplicate applications

### Recruiter
- Create jobs
- Edit jobs
- Close/Reopen jobs
- Delete jobs
- View applications
- View applicant answers

### Admin
- View/manage jobs
- View recruiter information
- Close/Reopen jobs
- Delete/Restore jobs


## Design Decisions

### 1. Data Model

I modeled users/applicants, jobs, and applications as separate MongoDB collections.

A Job contains its questionnaire as an embedded `questions` array. Each question has:
- `questionId`
- `label`
- `type`
- `required`
- `options`

Applications store the applicant, job reference, submitted answers, and application status.

Questions are embedded inside jobs because they belong directly to a specific job and are needed together when rendering the application form. Applications are kept separately because multiple applicants can apply to the same job and application data can grow independently.

---

### 2. Dynamic Form

The frontend does not hardcode questions for individual jobs.

The job API returns a `questions` array, and a reusable `DynamicQuestion` component renders the appropriate input based on the question `type`.

Currently supported types are:
- `text`
- `textarea`
- `number`
- `dropdown`
- `checkbox`
- `boolean`

To add a new question type, I would add its rendering logic to the reusable `DynamicQuestion` component and add the corresponding backend validation. Existing job-specific forms would not need to be changed.

---

### 3. Apply to All

For "Apply to All", I collect answers separately for each selected job because different jobs can have different questions.

Each job is processed independently:
- Valid answers → application is submitted.
- Missing required answers → that job fails.
- Invalid answers → that job fails.
- Already applied jobs → duplicate application is rejected.

The main trade-off is that the operation is processed job-by-job rather than as one database transaction. This allows partial success: one job can be successfully applied to even if another job fails validation.

Jobs with unanswered required questions are reported as failed, while valid jobs can still be submitted.

---

### 4. Validation

Validation is performed on both the frontend and backend.

The frontend provides immediate feedback for required fields and expected input types.

The backend is the final source of truth. Before creating an application, it validates the submitted answers against the job's current questionnaire, including:
- Required questions
- Question IDs
- Answer types
- Dropdown allowed options
- Checkbox allowed options
- Duplicate applications

This keeps the validation rules aligned and prevents invalid requests from bypassing frontend validation.

---

### 5. At Scale

With 10,000 jobs and 1M applications, the main areas that would need attention are database queries, indexing, pagination, caching, and application processing.

I would:
- Add indexes for frequently queried fields such as job status, location, and creation date.
- Add indexes for application lookups by applicant and job.
- Keep pagination for job and application listings.
- Optimize recruiter/admin statistics using aggregation queries.
- Introduce Redis for frequently accessed job/search data if required.
- Use background jobs/queues for non-critical processing.
- Consider database replication and horizontal scaling as traffic increases.

The current implementation intentionally keeps the architecture simple for the assignment while leaving these scaling paths open.
