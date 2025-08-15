import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useForm } from "../useForm";
import { validators } from "@utils/validators";

describe("useForm", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useForm({ name: "", email: "" }));

    expect(result.current.values).toEqual({ name: "", email: "" });
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it("should update values on change", () => {
    const { result } = renderHook(() => useForm({ name: "" }));

    act(() => {
      const event = {
        target: { value: "John Doe" },
      } as React.ChangeEvent<HTMLInputElement>;

      result.current.handleChange("name")(event);
    });

    expect(result.current.values.name).toBe("John Doe");
  });

  it("should validate on blur", () => {
    const { result } = renderHook(() =>
      useForm(
        { email: "" },
        {
          email: validators.required("Email is required"),
        }
      )
    );

    act(() => {
      result.current.handleBlur("email")();
    });

    expect(result.current.touched.email).toBe(true);
    expect(result.current.errors.email).toBe("Email is required");
  });

  it("should not submit with invalid data", async () => {
    let submittedValues: any = null;

    const { result } = renderHook(() =>
      useForm({ name: "" }, { name: validators.required() })
    );

    const onSubmit = (values: any) => {
      submittedValues = values;
    };

    await act(async () => {
      const event = { preventDefault: () => {} } as React.FormEvent;
      await result.current.handleSubmit(onSubmit)(event);
    });

    expect(submittedValues).toBeNull();
    expect(result.current.errors.name).toBe("Field is required");
  });

  it("should reset form", () => {
    const { result } = renderHook(() => useForm({ name: "" }));

    act(() => {
      result.current.setFieldValue("name", "John");
      result.current.setFieldError("name", "Error");
    });

    expect(result.current.values.name).toBe("John");
    expect(result.current.errors.name).toBe("Error");

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values.name).toBe("");
    expect(result.current.errors.name).toBeUndefined();
  });
});
