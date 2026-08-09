"use client";
import React, { useState } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "@/components/ui/toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyCodeValidation } from "@/schemas/inputValidation.schema";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const page = () => {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [value, setValue] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  const verifySchema = z.object({
    code: verifyCodeValidation,
  });

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof verifySchema>) => {
    console.log("submitting");
    console.log(form.getValues("code"));
    try {
      const response = await authClient.emailOtp.verifyEmail({
        email: email, // required
        otp: formData.code, // required
      });

      console.log(response);
      if (!response.data) {
        toast.add({
          type: "Error",
          description: "Email verification failed! Try again later",
        });
        return;
        
      }
      toast.add({
        type: "Success",
        description: "Email is Verified",
      });

    } catch (error) {
      console.log("There is some error while verifying user email", error);
      toast.add({
        type: "Error",
        description: "Email verification failed! Try again later",
      });
    }
  };


  
  const code = form.watch("code");
  const filled = code.length;

  const resend = () => {
    if (countdown > 0) return;
    setResent(true);
    setCountdown(60);
    setTimeout(() => setResent(false), 3000);
  };

  console.log(form.formState.errors);
  

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg-subtle)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 20,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
          }}
        >
          {/* Progress bar */}
          <div style={{ height: 3, background: "var(--bg-muted)" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                width: `${(filled / 6) * 100}%`,
                transition: "width 0.2s ease",
                borderRadius: "0 99px 99px 0",
              }}
            />
          </div>

          <div style={{ padding: "36px 36px 40px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 28,
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
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
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text)",
                  }}
                >
                  Pulse
                </span>
              </Link>

              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--accent-subtle)",
                  margin: "0 auto 16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.4px",
                  color: "var(--text)",
                  marginBottom: 8,
                }}
              >
                Check your email
              </h1>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                We sent a 6-digit code to{" "}
                <span style={{ fontWeight: 600, color: "var(--text)" }}>
                  {email}
                </span>
              </p>
            </div>

            <form  onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="code"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    // console.log(field.value),
                    
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="code">Code</FieldLabel>
                      <InputOTP
                        {...field}
                        id="code"
                        maxLength={6}
                        inputMode="numeric"
                        aria-invalid={fieldState.invalid}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup
                          style={{
                            display: "flex",
                            gap: 10,
                            justifyContent: "center",
                            marginBottom: 16,
                          }}
                        >
                          {digits.map((d, i) => (
                            <InputOTPSlot
                              key={i}
                              index={i}
                              style={{
                                width: 48,
                                height: 56,
                                textAlign: "center",
                                fontSize: 22,
                                fontWeight: 700,
                                borderRadius: 10,
                                outline: "none",
                                fontFamily: "inherit",
                                border: `2px solid ${error ? "#fca5a5" : d ? "var(--accent)" : "var(--border)"}`,
                                background: d
                                  ? "var(--accent-subtle)"
                                  : "var(--bg-subtle)",
                                color: d ? "var(--accent-text)" : "var(--text)",
                                transition: "all 0.15s",
                              }}
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>

                      {form.formState.errors.code ? (
                        <FieldError id="code-status">
                          {form.formState.errors.code.message}
                        </FieldError>
                      ) : (
                        <></>
                      )}

                      <Button

                        type="submit"
                        style={{
                          width: "100%",
                          padding: "25px",
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 600,
                          // cursor: (loading || digits.some(d => !d)) ? 'not-allowed' : 'pointer',
                          color: "#fff",
                          background:
                            "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          border: "none",
                          //  opacity: digits.some(d => !d) ? 0.5 : 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                        }}
                      >
                        {loading && (
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
                        {loading ? "Verifying…" : "Verify email"}
                      </Button>
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
  

            <p
              style={{
                textAlign: "center",
                fontSize: 13,
                color: "var(--text-tertiary)",
                marginTop: 20,
              }}
            >
              Didn't receive it?{" "}
              <button
                onClick={resend}
                disabled={countdown > 0}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: countdown > 0 ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  color:
                    countdown > 0 ? "var(--text-tertiary)" : "var(--accent)",
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </p>
          </div>
        </div>

        <div
          style={{
            margin: "16px 0",
            padding: "14px 16px",
            borderRadius: 12,
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: 12.5,
              color: "var(--text-secondary)",
              lineHeight: 1.6,
            }}
          >
            <span style={{ fontWeight: 600 }}>Tip:</span> Code expires in 10
            minutes. Check your spam folder if you don't see it.
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 13 }}>
          <Link href="/signup" style={{ color: "var(--text-tertiary)" }}>
            ← Use a different email
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        .spin { animation: spin 0.8s linear infinite }
      `}</style>
    </div>
  );
};

export default page;
