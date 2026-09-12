import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
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

  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);

      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),

        questions: (formData.questions || []).map((question) => ({
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

      await api.post("/jobs", payload);

      toast.success("Job created successfully");

      navigate("/recruiter/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create job";

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

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Job</h1>

        <p className="text-gray-500 mt-2">
          Create a job and define its application questions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Job Information */}
        <section className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Job Information</h2>

          <div className="space-y-5">
            {/* Job Title */}
            <div>
              <label className="block font-medium mb-2">Job Title *</label>

              <input
                type="text"
                {...register("title", {
                  required: "Job title is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Job title is required",
                })}
                placeholder="e.g. Node.js Developer"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
              />

              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Company */}
            <div>
              <label className="block font-medium mb-2">Company *</label>

              <input
                type="text"
                {...register("company", {
                  required: "Company is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Company is required",
                })}
                placeholder="e.g. ABC Technologies"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
              />

              {errors.company && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block font-medium mb-2">Location *</label>

              <input
                type="text"
                {...register("location", {
                  required: "Location is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Location is required",
                })}
                placeholder="e.g. Mohali / Remote"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
              />

              {errors.location && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-medium mb-2">Description *</label>

              <textarea
                rows={6}
                {...register("description", {
                  required: "Description is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Description is required",
                })}
                placeholder="Describe the role..."
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
              />

              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Application Questions */}
        <section className="border rounded-xl p-6 mt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Application Questions</h2>

              <p className="text-sm text-gray-500 mt-1">
                Add the questions applicants need to answer.
              </p>
            </div>

            <button
              type="button"
              onClick={addQuestion}
              className="border px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              + Add Question
            </button>
          </div>

          {/* Empty State */}
          {fields.length === 0 && (
            <div className="border border-dashed rounded-xl p-8 text-center">
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

          <div className="space-y-6">
            {fields.map((field, index) => {
              const questionType = questions?.[index]?.type;

              const requiresOptions =
                questionType === "dropdown" || questionType === "checkbox";

              return (
                <div key={field.id} className="border rounded-xl p-5">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-semibold">Question {index + 1}</h3>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Question Label */}
                    <div>
                      <label className="block font-medium mb-2">
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
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                      />

                      {errors.questions?.[index]?.label && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.questions[index].label.message}
                        </p>
                      )}
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block font-medium mb-2">
                        Question Type *
                      </label>

                      <select
                        {...register(`questions.${index}.type`)}
                        className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                      >
                        {QUESTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Required */}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register(`questions.${index}.required`)}
                        className="w-4 h-4"
                      />

                      <span>Required question</span>
                    </label>

                    {/* Options */}
                    {requiresOptions && (
                      <div>
                        <label className="block font-medium mb-2">
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
                          className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
                        />

                        <p className="text-xs text-gray-500 mt-1">
                          Enter options separated by commas.
                        </p>

                        {errors.questions?.[index]?.options && (
                          <p className="text-sm text-red-500 mt-1">
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
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={() => navigate("/recruiter/dashboard")}
            disabled={submitting}
            className="border px-5 py-3 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="bg-black text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Job"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateJob;
