import { Controller } from "react-hook-form";
import { memo } from "react";

const DynamicQuestion = ({
  question,
  register,
  control,
  namePrefix = "answers",
}) => {
  const fieldName = `${namePrefix}.${question.questionId}`;

  const requiredMessage = question.required
    ? `${question.label} is required`
    : false;

  const renderQuestion = () => {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            {...register(fieldName, {
              required: requiredMessage,
            })}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case "textarea":
        return (
          <textarea
            {...register(fieldName, {
              required: requiredMessage,
            })}
            rows={4}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            {...register(fieldName, {
              required: requiredMessage,
              setValueAs: (value) => (value === "" ? undefined : Number(value)),
            })}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case "dropdown":
        return (
          <select
            {...register(fieldName, {
              required: requiredMessage,
            })}
            className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2"
          >
            <option value="">Select an option</option>

            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <div
            className="space-y-2"
            {...register(fieldName, {
              validate: (value) => {
                if (!question.required) return true;

                return (
                  (Array.isArray(value) && value.length > 0) ||
                  `${question.label} is required`
                );
              },
            })}
          >
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={option}
                  {...register(fieldName)}
                  className="w-4 h-4"
                />

                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "boolean":
        return (
          <Controller
            name={fieldName}
            control={control}
            rules={{
              validate: (value) => {
                if (!question.required) return true;

                return value !== undefined || `${question.label} is required`;
              },
            }}
            render={({ field }) => (
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="w-4 h-4"
                  />

                  <span>Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => field.onChange(false)}
                    className="w-4 h-4"
                  />

                  <span>No</span>
                </label>
              </div>
            )}
          />
        );

      default:
        return <p className="text-red-500">Unsupported question type</p>;
    }
  };

  return (
    <div className="space-y-2">
      <label className="block font-medium">
        {question.label}

        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderQuestion()}
    </div>
  );
};

export default memo(DynamicQuestion);
