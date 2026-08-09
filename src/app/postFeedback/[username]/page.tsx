"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { string } from "zod";
import { Button } from "@/components/ui/button";
import { POST } from "@/app/api/accept-message/route";


type Category = "Bug" | "Feature" | "UX" | "Performance" | "Other";



export default function PostFeedback() {
  //   const navigate = useNavigate()
  const [category, setCategory] = useState<Category | "">("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [anon, setAnon] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const[loadingSuggestions, setLoadingSuggestions] = useState(false);
  const[suggestions, setSuggestions] = useState<string[]>([]);
  const username = useParams();

  console.log(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }

    try {
      const res = await axios.post<ApiResponse>("/api/send-messages", {
        title,
        body,
        username,
      });

      console.log(res);

      if (!res.data.success) {
        toast.add({
          type: "error",
          description: "Feedback could not posted! Please try again",
        });
        return;
      }

      toast.add({
        type: "success",
        description: "Thanks for posting feedbacks",
      });

      setError("");
      setSubmitted(true);
    } catch (error) {
      console.log("there is some error while posting feedback", error);
      toast.add({
        type: "error",
      });
    }
  };

  const generateSuggestions = async() =>{
    console.log("in gen func");
    
    setLoadingSuggestions(true);
    try {
      const response = await fetch('/api/suggest-messages',{method:"POST"});
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();

       let buffer = "";

      while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split("||");

    buffer = parts.pop() ?? "";

    if (parts.length > 0) {
      setSuggestions((prev) => [...prev, ...parts]);
    }
  }

  // Last question
  if (buffer.trim()) {
    setSuggestions((prev) => [...prev, buffer.trim()]);
  }
    } catch (error) {
      console.log("Error while fetching suggestion ", error);
      
    }finally{
      setLoadingSuggestions(false);
    }
  }

  const applySuggestion = async(s:string) =>{
    setTitle(s);
  }

  if (submitted) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <div
          style={{
            maxWidth: 480,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              margin: "0 auto 24px",
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.4px",
              color: "var(--text)",
              marginBottom: 8,
            }}
          >
            Feedback submitted!
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 32,
              lineHeight: 1.6,
            }}
          >
            Thanks for sharing. Your feedback is now live on the community
            board.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link
              href="/dashboard"
              style={{
                padding: "9px 20px",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              View all feedback
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setCategory("");
                setTitle("");
                setBody("");
                setAnon(false);
              }}
              style={{
                padding: "9px 20px",
                borderRadius: 9,
                fontSize: 13.5,
                fontWeight: 500,
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                cursor: "pointer",
              }}
            >
              Share more
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-subtle)", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 80px" }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 13,
            color: "var(--text-tertiary)",
            marginBottom: 28,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to feed
        </Link>

        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.5px",
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Share feedback
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
            Clear, specific feedback drives real product decisions.
          </p>
        </div>

        <div
          style={{
            background: "var(--surface)",
            borderRadius: 16,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
            overflow: "hidden",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 28,
              display: "flex",
              flexDirection: "column",
              gap: 24,
            }}
          >
            {/* Category */}
            {/* <div>
              <label style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
                Category <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
                {CATEGORIES.map(c => (
                  <button key={c.value} type="button" onClick={() => setCategory(c.value)} style={{
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                    border: `1.5px solid ${category === c.value ? 'var(--accent)' : 'var(--border)'}`,
                    background: category === c.value ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                    transition: 'all 0.15s',
                  }}>
                    <span style={{ display: 'block', fontSize: 18, marginBottom: 4 }}>{c.icon}</span>
                    <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: category === c.value ? 'var(--accent-text)' : 'var(--text)' }}>{c.label}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 1 }}>{c.desc}</span>
                  </button>
                ))}
              </div>
            </div> */}

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                style={{
                  display: "block",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                Title <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <input
                id="title"
                type="text"
                placeholder="Summarize in one clear line"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 9,
                  fontSize: 14,
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-subtle)",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  ((e.target as HTMLElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLElement).style.borderColor =
                    "var(--border)")
                }
              />
              <p
                style={{
                  fontSize: 11.5,
                  color: "var(--text-tertiary)",
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {title.length}/100
              </p>
            </div>

            {/* Body */}
            <div>
              <label
                htmlFor="body"
                style={{
                  display: "block",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                Details <span style={{ color: "var(--accent)" }}>*</span>
              </label>
              <textarea
                id="body"
                placeholder="What's the context? What would the ideal outcome look like?"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 9,
                  fontSize: 14,
                  resize: "vertical",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-subtle)",
                  outline: "none",
                  lineHeight: 1.6,
                  transition: "border-color 0.15s",
                  fontFamily: "inherit",
                }}
                onFocus={(e) =>
                  ((e.target as HTMLElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLElement).style.borderColor =
                    "var(--border)")
                }
              />
            </div>

            {/* Anonymous */}
            {/* <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderRadius: 10,
                background: "var(--bg-subtle)",
                border: "1px solid var(--border)",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "var(--text)",
                    marginBottom: 2,
                  }}
                >
                  Post anonymously
                </p>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
                  Your name won't appear on this feedback
                </p>
              </div>
              <button type="button" onClick={() => setAnon(!anon)} style={{
                position: 'relative', width: 44, height: 24, borderRadius: 99, cursor: 'pointer',
                background: anon ? 'var(--accent)' : 'var(--border-strong)', border: 'none', transition: 'background 0.2s',
              }}>
                <span style={{
                  position: 'absolute', top: 2, left: anon ? 22 : 2, width: 20, height: 20,
                  borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  transition: 'left 0.2s',
                }} />
              </button>
            </div> */}

            {error && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 9,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#ef4444",
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
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
                boxShadow: "0 2px 6px rgba(99,102,241,0.3)",
              }}
            >
              Submit feedback
            </button>
          </form>
        </div>
        <div
          style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 20,
            marginTop: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}
              >
                Need inspiration?
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                Get a few starting points based on what people are discussing.
              </div>
            </div>
            <Button
              type="button"
              onClick={generateSuggestions}
              disabled={loadingSuggestions}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                whiteSpace: "nowrap",
                opacity: loadingSuggestions ? 0.7 : 1,
              }}
            >
              {loadingSuggestions ? "Generating…" : "Generate suggestions"}
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applySuggestion(s)}
                  style={{
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1px solid var(--border)",
                    background: "var(--bg-subtle)",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {s}
                  </div>
                  {/* <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      marginTop: 3,
                    }}
                  >
                    {s.description}
                  </div> */}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
