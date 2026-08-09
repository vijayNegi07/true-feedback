"use client";
import { useEffect, useState } from "react";
import { signUp } from "../../actions/auth";
import { useForm, Controller } from "react-hook-form";
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
import { Spinner } from "@/components/ui/spinner";
import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";

// import { useUsernameAvailability } from "@/hooks/use-username-availability"

function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameIsValid, setUsernameValid] = useState(true);
  const [checkUsername, setCheckUsername] = useState("");
  const [isformSubmit, setIsFormSubmit] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState("");
  const[showPass, setShowPass] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    //make api request to chceck-unique-username
    async function checkUsernameUnique() {
      if (username.length < 3) {
        setCheckUsername("");
        setUsernameValid(false);
        return;
      }

      if (username) {
        setUsernameValid(true);
        setCheckUsername("checking");
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/checkUniqueUsername/?username=${username}`,
          );
          console.log(response);

          setUsernameMessage(response.data.message);
          if (response.data.message !== "Username is unique") {
            setCheckUsername("taken");
            return;
          }
          console.log("available");

          setCheckUsername("available");
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error while checing unique username",
          );
          setCheckUsername("error");
        }
      }
    }

    checkUsernameUnique();
  }, [username]);

  const pass = form.watch("password");

  const onSubmit = async (formData: z.infer<typeof signUpValidation>) => {
    setIsFormSubmit(true);

    try {
      const { email, username, password } = formData;
      const creatUserResponse = await axios.post("/api/create-user", {
        email,
        username,
        password,
      });

      if (!creatUserResponse || creatUserResponse.status !== 200) {
        toast.add({
          type: "error",
          description: "User Creation Failed!",
        });
        return;
      }

      toast.add({
        type: "success",
        description: "User Creation Success! Verification Code sent to email",
      });      

      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: formData.email, // required
        type: "email-verification", // required
      });


      if (!data?.success) {
        toast.add({
          type: "Success",
          description: "Email cant be sent! Try again later",
        });
        return;
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.log("User Creation failed -> ", error);
      toast.add({
        type: "error",
        description: "User Creation Failed!",
      });
    }finally{setIsFormSubmit(false)}
  };

  const strength =
    form.getValues("password").length == 0
      ? 0
      : form.getValues("password").length < 6
        ? 1
        : form.getValues("password").length < 10
          ? 2
          : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", "#ef4444", "#f59e0b", "#10b981"];

  

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
            padding: "40px 0",
          }}
        >
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,0.9)"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 16,
              lineHeight: 1.65,
              marginBottom: 28,
              fontStyle: "italic",
            }}
          >
            "The best product decisions we've made this year started with a
            piece of Pulse feedback."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&h=60&fit=crop&auto=format"
              alt="Camille Torres"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            /> */}
            <div>
              <p style={{ color: "#fff", fontSize: 13.5, fontWeight: 600 }}>
                Vijay 
              </p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
                Founder & CEO, Negi Solutions
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {["12,480 feedbacks", "340+ teams", "94% satisfaction"].map((s) => (
            <p
              key={s}
              style={{ fontSize: 11.5, color: "rgba(255,255,255,0.65)" }}
            >
              {s}
            </p>
          ))}
        </div>
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
                textDecoration: "none",
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
              Create your account
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              Already have one?{" "}
              <Link
                href="/signIn"
                style={{ color: "var(--accent)", fontWeight: 500 }}
              >
                Log in
              </Link>
            </p>
          </div>

          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="w-full">
              {/* ================= USERNAME ================= */}

              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel
                      htmlFor="username"
                      className="mb-1.5 block text-[13.5px] font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Username
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
                        id="username"
                        autoComplete="username"
                        placeholder="janedoe"
                        aria-invalid={fieldState.invalid}
                        aria-describedby="username-status"
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
                        onChange={(e) => {
                          field.onChange(e);

                          debounced(e.target.value);

                          setCheckUsername("checking");

                          form.trigger("username");
                        }}
                      />

                      {usernameIsValid && (
                        <InputGroupAddon
                          align="inline-end"
                          className={cn(
                            "border-0!",
                            "bg-transparent!",
                            "shadow-none!",
                            "outline-none!",
                            "pr-3!",
                          )}
                        >
                          <UsernameStatusIcon status={checkUsername} />
                        </InputGroupAddon>
                      )}
                    </InputGroup>
    
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="mt-1 text-[12px] text-[#ef4444]"
                      />
                    )}
                    <UsernameStatusMessage
                      username={username}
                      usernameIsValid={usernameIsValid}
                      status={checkUsername}
                    />
                  </Field>
                )}
              />

              {/* ================= EMAIL ================= */}

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel
                      htmlFor="email"
                      className="mb-1.5 block text-[13.5px] font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Email
                    </FieldLabel>

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

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="mt-1 text-[12px] text-[#ef4444]"
                      />
                    )}
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
                      style={{ color: "var(--text)"  }}

                    >
                      Password
                    </FieldLabel>
                    <InputGroup className={cn(
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
                      )}>
                      <InputGroupInput 
                        {...field}
                      id="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="password"
                      type={showPass? "text" : "password"}
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
                      
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0, display: 'flex' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>{showPass ? <><path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" /></> : <><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}</svg>
                  </button>
                    </InputGroup>

                  

                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="mt-1 text-[12px] text-[#ef4444]"
                      />
                    )}
                    {form.getValues("password")?.length > 0 && (
                      <div className="mt-2">
                        <div className="mb-1 flex gap-1">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-0.75 flex-1 rounded-[99px] transition-colors duration-300"
                              style={{
                                background:
                                  i <= strength
                                    ? strengthColor[strength]
                                    : "var(--border)",
                              }}
                            />
                          ))}
                        </div>

                        <p
                          className="text-[11.5px]"
                          style={{
                            color: strengthColor[strength],
                          }}
                        >
                          {strengthLabel[strength]}
                        </p>
                      </div>
                    )}
                    
                  </Field>
                  
                )}
              />
            </FieldGroup>
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
            <Button type="submit" form="form-rhf-demo" disabled={isformSubmit} style={{
              width: '100%', padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: isformSubmit ? 'not-allowed' : 'pointer',
              color: '#fff', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none',
              opacity: isformSubmit ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 4,
            }}>
              {isformSubmit && <svg className="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>}
              {isformSubmit ? 'Creating account…' : 'Create account'}
            </Button>
          </Field>

          <Divider />

          {/* <SocialButtons /> */}

          <p
            style={{
              fontSize: 12,
              color: "var(--text-tertiary)",
              textAlign: "center",
              marginTop: 20,
              lineHeight: 1.6,
            }}
          >
            By signing up you agree to our{" "}
            <a
              href="#"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{ color: "var(--accent)", textDecoration: "underline" }}
            >
              Privacy Policy
            </a>
            .
          </p>
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

export default SignUpPage;

function UsernameStatusIcon({ status }: { status: string }) {
  if (status === "checking")
    return (
      <Loader2Icon
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin")}
      />
    );
  if (status === "available")
    return <CheckIcon className="text-success text-green-500" />;
  if (status === "taken" || status === "error")
    return <XIcon className="text-destructive" />;
  return null;
}

function UsernameStatusMessage({
  error,
  username,
  usernameIsValid,
  status,
}: {
  error?: string;
  username: string;
  usernameIsValid: boolean;
  status: string;
}) {
  if (error) {
    return <FieldError id="username-status">{error}</FieldError>;
  }

  if (!usernameIsValid) {
    return (
      <FieldDescription id="username-status">
        3–20 characters. Letters, numbers and underscores only.
      </FieldDescription>
    );
  }

  if (status === "checking") {
    return (
      <FieldDescription id="username-status">
        Checking availability...
      </FieldDescription>
    );
  }

  if (status === "available") {
    return (
      <FieldDescription
        id="username-status"
        className="text-success text-green-500 "
      >
        {username} is available.
      </FieldDescription>
    );
  }

  if (status === "taken") {
    return (
      <FieldError id="username-status">{username} is already taken.</FieldError>
    );
  }

  if (status === "error") {
    return (
      <FieldError id="username-status">
        Could not check that username. Try again.
      </FieldError>
    );
  }

  return null;
}
function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>or continue with</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}


