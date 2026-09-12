import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import api from "../../services/api";

const QUESTION_TYPES = [
  "text",
  "textarea",
  "number",
  "dropdown",
  "checkbox",
  "boolean",
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const isEditMode = Boolean(jobId);

  const [submitting, setSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      description: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const questions = watch("questions");

  // Load job for edit
  useEffect(() => {
    if (!isEditMode) return;

    const fetchJob = async () => {
      try {
        setLoadingJob(true);

        const response = await api.get(`/jobs/${jobId}`);

        const job = response.data.data;

        reset({
          title: job.title || "",
          company: job.company || "",
          location: job.location || "",
          description: job.description || "",
          questions: (job.questions || []).map((question) => ({
            questionId: question.questionId,
            label: question.label || "",
            type: question.type || "text",
            required: Boolean(question.required),
            options: (question.options || []).join(", "),
          })),
        });
      } catch (error) {
        const message = error.response?.data?.message || "Failed to load job";

        toast.error(message);
        navigate("/recruiter/dashboard");
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJob();
  }, [jobId, isEditMode, reset, navigate]);

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),

        questions: (formData.questions || []).map((question) => ({
          ...(question.questionId ? { questionId: question.questionId } : {}),

          label: question.label.trim(),
          type: question.type,
          required: Boolean(question.required),

          options:
            question.type === "dropdown" || question.type === "checkbox"
              ? (question.options || "")
                  .split(",")
                  .map((option) => option.trim())
                  .filter(Boolean)
              : [],
        })),
      };

      if (isEditMode) {
        await api.patch(`/jobs/${jobId}`, payload);

        toast.success("Job updated successfully");
      } else {
        await api.post("/jobs", payload);

        toast.success("Job created successfully");
      }

      navigate("/recruiter/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        (isEditMode ? "Failed to update job" : "Failed to create job");

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    append({
      label: "",
      type: "text",
      required: false,
      options: "",
    });
  };

  if (loadingJob) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading job...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Edit Job" : "Create Job"}
        </h1>

        <p className="mt-2 text-gray-500">
          {isEditMode
            ? "Update job details and application questions."
            : "Create a job and define its application questions."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Job Information */}
        <section className="rounded-xl border p-6">
          <h2 className="mb-6 text-xl font-semibold">Job Information</h2>

          <div className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="mb-2 block font-medium">Job Title *</label>

              <input
                type="text"
                {...register("title", {
                  required: "Job title is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Job title is required",
                })}
                placeholder="e.g. Node.js Developer"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block font-medium">Company *</label>

              <input
                type="text"
                {...register("company", {
                  required: "Company is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Company is required",
                })}
                placeholder="e.g. ABC Technologies"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />

              {errors.company && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="mb-2 block font-medium">Location *</label>

              <input
                type="text"
                {...register("location", {
                  required: "Location is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Location is required",
                })}
                placeholder="e.g. Mohali / Remote"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />

              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-medium">Description *</label>

              <textarea
                rows={6}
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Description is required",
                })}
                placeholder="Describe the role..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Application Questions */}
        <section className="mt-8 rounded-xl border p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Application Questions</h2>

              <p className="mt-1 text-sm text-gray-500">
                Add the questions applicants need to answer.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="rounded-lg border px-4 py-2 hover:bg-gray-50"
            >
              + Add Question
            </button>
          </div>

          {/* Empty State */}
          {fields.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-gray-500">No application questions added.</p>

              <button
                type="button"
                onClick={addQuestion}
                className="mt-3 text-sm font-medium underline"
              >
                Add your first question
              </button>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6">
            {fields.map((field, index) => {
              const questionType = questions?.[index]?.type;

              const requiresOptions =
                questionType === "dropdown" || questionType === "checkbox";

              return (
                <div key={field.id} className="rounded-xl border p-5">
                  {/* Question Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="font-semibold">Question {index + 1}</h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Question Label */}
                    <div>
                      <label className="mb-2 block font-medium">
                        Question *
                      </label>

                      <input
                        type="text"
                        {...register(`questions.${index}.label`, {
                          required: "Question label is required",

                          validate: (value) =>
                            value.trim().length > 0 ||
                            "Question label is required",
                        })}
                        placeholder="e.g. Years of experience"
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                      />

                      {errors.questions?.[index]?.label && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.questions[index].label.message}
                        </p>
                      )}
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="mb-2 block font-medium">
                        Question Type *
                      </label>

                      <select
                        {...register(`questions.${index}.type`)}
                        className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                      >
                        {QUESTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Required */}
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        {...register(`questions.${index}.required`)}
                        className="h-4 w-4"
                      />

                      <span>Required question</span>
                    </label>

                    {/* Options */}
                    {requiresOptions && (
                      <div>
                        <label className="mb-2 block font-medium">
                          Options *
                        </label>

                        <input
                          type="text"
                          {...register(`questions.${index}.options`, {
                            validate: (value) => {
                              if (!requiresOptions) {
                                return true;
                              }

                              const options = (value || "")
                                .split(",")
                                .map((option) => option.trim())
                                .filter(Boolean);

                              return (
                                options.length > 0 ||
                                "At least one option is required"
                              );
                            },
                          })}
                          placeholder="Remote, Hybrid, On-site"
                          className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                        />

                        <p className="mt-1 text-xs text-gray-500">
                          Enter options separated by commas.
                        </p>

                        {errors.questions?.[index]?.options && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.questions[index].options.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/recruiter/dashboard")}
            disabled={submitting}
            className="rounded-lg border px-5 py-3 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Job"
                : "Create Job"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateJob;
