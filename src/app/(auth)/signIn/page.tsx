"use client";
import { useEffect, useState } from "react";
import { signUp } from "../../actions/auth";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { redirect, useRouter } from "next/navigation";
import {
  sigInValidation,
  signUpValidation,
} from "@/schemas/inputValidation.schema";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { router } from "better-auth/api";

function SignIn() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [apiError, setApiError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof sigInValidation>>({
    resolver: zodResolver(sigInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof sigInValidation>) => {
    setFormSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email, // required
        password: formData.password, // required
        rememberMe: true,
        callbackURL: "/",
      });

      if (error) {
        console.log("APi error -> ", error);
        setApiError(error?.message);
        toast.add({
          type: "error",
          description: "Username or passoword wrong",
        });
        return;
      }
      toast.add({ type: "success", description: "Successfully signIn" });
    } catch (error) {
      console.log("Some errr while user logging in ", error);
      toast.add({
        type: "error",
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  console.log(form.formState.errors);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}
    >
      {/* Left panel */}
      <div
        style={{
          width: 420,
          flexShrink: 0,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(160deg, #6366f1 0%, #7c3aed 60%, #4f46e5 100%)",
        }}
        className="auth-panel"
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
            Pulse
          </span>
        </Link>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 12,
            padding: "40px 0",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 8,
            }}
          >
            Recent activity
          </p>
          {[
            {
              title: "Dark mode toggle request",
              votes: 142,
              cat: "Feature",
              time: "2h ago",
            },
            {
              title: "Firefox upload bug",
              votes: 89,
              cat: "Bug",
              time: "5h ago",
            },
            {
              title: "Keyboard nav broken",
              votes: 67,
              cat: "UX",
              time: "1d ago",
            },
            {
              title: "Slow load with 200+ items",
              votes: 54,
              cat: "Perf",
              time: "2d ago",
            },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: 36,
                }}
              >
                ↑{item.votes}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: "#fff",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    marginTop: 1,
                  }}
                >
                  {item.cat} · {item.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
          © 2026 Pulse
        </p>
      </div>

      {/* Right form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 28 }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 32,
              }}
              className="mobile-only"
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 7,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Pulse</span>
            </Link>
            <h1
              style={{
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.4px",
                color: "var(--text)",
                marginBottom: 6,
              }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              New to Pulse?{" "}
              <Link
                href="/signUp"
                style={{ color: "var(--accent)", fontWeight: 500 }}
              >
                Create an account
              </Link>
            </p>
          </div>

          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="example@gmail.com"
                      autoComplete="off"
                      className={cn(
                        // Reset Shadcn defaults
                        "h-auto! w-full! rounded-[9px]!",
                        "border! shadow-none! outline-none! ring-0!",

                        // Padding
                        "px-3! py-2.5!",

                        // Typography
                        "text-[14px]!",
                        "font-[inherit]!",
                        "text-(--text)!",

                        // Background + border
                        fieldState.invalid
                          ? "border-[#fca5a5]! bg-[#fef2f2]!"
                          : [
                              "border-(--border)! bg-(--bg-subtle)!",
                              "focus:border-(--accent)!",
                              "focus:bg-(--bg)!",
                            ],

                        // Remove Shadcn focus styles
                        "focus:outline-none!",
                        "focus:ring-0!",
                        "focus:shadow-none!",

                        "focus-visible:outline-none!",
                        "focus-visible:ring-0!",
                        "focus-visible:shadow-none!",
                      )}
                    />
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel
                      htmlFor="password"
                      className="mb-1.5 block text-[13.5px] font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Password
                    </FieldLabel>
                    <InputGroup
                      className={cn(
                        // Completely reset Shadcn visual styles
                        "h-auto! w-full! rounded-[9px]! border! outline-none! shadow-none! ring-0!",

                        // Remove Shadcn focus styles from the GROUP
                        "focus:outline-none!",
                        "focus:ring-0!",
                        "focus:shadow-none!",
                        "focus-visible:outline-none!",
                        "focus-visible:ring-0!",
                        "focus-visible:shadow-none!",

                        // Invalid
                        fieldState.invalid
                          ? "border-[#fca5a5]! bg-[#fef2f2]!"
                          : [
                              "border-(--border)! bg-(--bg-subtle)!",
                              "focus-within:border-(--accent)!",
                              "focus-within:bg-(--bg)!",
                            ],
                      )}
                    >
                      <InputGroupInput
                        {...field}
                        id="password"
                        aria-invalid={fieldState.invalid}
                        placeholder="password"
                        type={showPass ? "text" : "password"}
                        autoComplete="off"

                        className={cn(
                          // Completely reset the INPUT
                          "h-auto! border-0! outline-none! ring-0! shadow-none!",

                          // Remove background
                          "bg-transparent!",

                          // Remove any focus styling
                          "focus:border-0!",
                          "focus:outline-none!",
                          "focus:ring-0!",
                          "focus:shadow-none!",

                          "focus-visible:border-0!",
                          "focus-visible:outline-none!",
                          "focus-visible:ring-0!",
                          "focus-visible:shadow-none!",

                          // Your styling
                          "px-3! py-2.5!",
                          "text-[14px]!",
                          "font-[inherit]!",
                          "text-(--text)!",
                        )}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-tertiary)",
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          {showPass ? (
                            <>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                              />
                              <line
                                x1="1"
                                y1="1"
                                x2="23"
                                y2="23"
                                strokeLinecap="round"
                              />
                            </>
                          ) : (
                            <>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                              />
                              <circle cx="12" cy="12" r="3" />
                            </>
                          )}
                        </svg>
                      </button>
                    </InputGroup>

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="mt-1 text-[12px] text-[#ef4444]"
                      />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            {form.formState.errors ? (
              <FormErrors
                fieldErrors={form.formState}
                apiError={apiError}
              ></FormErrors>
            ) : (
              <></>
            )}
          </form>

          <Field
            orientation="horizontal"
            style={{
              width: "100%",
              padding: "11px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              opacity: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 4,
            }}
          >
            <Button
              type="submit"
              form="form-rhf-demo"
              disabled={formSubmitting}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: formSubmitting ? "not-allowed" : "pointer",
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                opacity: formSubmitting ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 4,
              }}
            >
              {formSubmitting && (
                <svg
                  className="spin"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              )}
              {formSubmitting ? "Logging you in…" : "Log In"}
            </Button>
          </Field>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              or continue with
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                name: "Google",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                ),
              },
              {
                name: "GitHub",
                icon: (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                ),
              },
            ].map((p) => (
              <button
                key={p.name}
                type="button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "10px",
                  borderRadius: 9,
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {p.icon} {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .spin { animation: spin 0.8s linear infinite }
        @media (max-width: 768px) { .auth-panel { display: none !important } }
        @media (min-width: 768px) { .mobile-only { display: none !important } }
      `}</style>
    </div>
  );
}

type FormErrorProps = {
  errors: FieldErrors<z.infer<typeof sigInValidation>>;
};

function FormErrors({
  fieldErrors,
  apiError,
}: {
  fieldErrors: FormErrorProps;
  apiError: string | undefined;
}) {
  if (apiError) {
    return <FieldError id="api-error">{apiError}</FieldError>;
  }
  if (fieldErrors.errors.password) {
    return (
      <FieldError id="api-error">
        {fieldErrors.errors.password.message}
      </FieldError>
    );
  }
  if (fieldErrors.errors.email) {
    return (
      <FieldError id="api-error">
        {fieldErrors.errors.email?.message}
      </FieldError>
    );
  }
}

export default SignIn;
