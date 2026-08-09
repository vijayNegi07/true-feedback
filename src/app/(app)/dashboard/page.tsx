"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Message } from "@/models/User.model";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { Switch } from "@/components/ui/switch";
import { string } from "zod";
import { stringify } from "querystring";
import { TrashIcon } from "lucide-react";
import { fa } from "zod/locales";

type Category = "All" | "Bug" | "Feature" | "UX" | "Performance" | "Other";

interface Feedback {
  id: number;
  author: string;
  avatar: string;
  category: Exclude<Category, "All">;
  title: string;
  body: string;
  votes: number;
  replies: number;
  time: string;
  voted: boolean;
}

export default function FeedbackFeed() {
  const [active, setActive] = useState<Category>("All");
  const [sort, setSort] = useState<"top" | "new">("top");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Message[] | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileURL, setProfileURL] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [pendingId, setPendingId] = useState("");

  async function handleConfirm() {
    setPosts((posts) =>
      posts?.filter((post) => post._id.toString() !== pendingId),
    );

    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-messsage/${pendingId}`,
      );
      if (!response.data.success) {
        console.log("Cannot delete feedback");
        return;
      }

      toast.add({
        type: "success",
        description: "message deleted",
      });
    } catch (error) {
      console.log("error while deleting feedback->", error);
    } finally {
      setPendingId("");
    }

    // your delete API call
  }

  const { data: session } = authClient.useSession();

  const { watch, setValue, register } = useForm();

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessageStatus = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-message");

      if (!response.data.success) {
        toast.add({
          type: "error",
          description: "Cant fetch accept message status",
        });
        return;
      }

      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      console.log(
        "There is some error while fetching accept message status->",
        error,
      );
      toast.add({
        type: "error",
        description: "Cant fetch accept message status",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const fetchFeedbacks = async (refresh: boolean = false) => {
    if (!session || !session.user) {
      return;
    }
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");

      if (!response.data.success) {
        toast.add({
          type: "error",
          description: "Feedbacks fetched failed",
        });
        return;
      }
      if (refresh) {
        toast.add({
          type: "success",
          description: "Showing latest feedbacks",
        });
      }

      setPosts(response.data?.messages || []);
    } catch (error) {
      console.log(
        "There is some error while fetching feedbacks from DB,",
        error,
      );
      toast.add({
        type: "error",
        description: "Feedbacks fetched failed",
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
      setPageLoading(false);
    }
  };

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessage: !acceptMessage,
      });
      console.log(response.data);

      if (!response.data.success) {
        toast.add({
          type: "error",
          description: "Error updating accepting message status",
        });
        return;
      }

      setValue("acceptMessage", !acceptMessage);
    } catch (error) {
      console.log(
        "There is some error while updating accept message status,",
        error,
      );
      toast.add({
        type: "error",
        description: "Error updating accepting message status",
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    setProfileURL(
      `${window.location.origin}/postFeedback/${session.user.name}`,
    );
    fetchAcceptMessageStatus();
    fetchFeedbacks();
    
    setCopied(false);
  }, [session, setValue]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileURL);
    toast.add({
      title: "URL Copied!",
      description: "Profile URL has been copied to clipboard.",
    });
    setCopied(true);
  };

  if (pageLoading) {
    return (
      <div style={{ position: "relative" }}>
        {pageLoading && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              zIndex: 9999,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "3px solid #e2e0fb",
                borderTopColor: "#6366f1",
                animation: "spin 0.7s linear infinite",
              }}
            />
            <span
              style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}
            >
              Loading feedback…
            </span>
          </div>
        )}

        <div
          style={{
            filter: pageLoading ? "blur(6px)" : "none",
            pointerEvents: pageLoading ? "none" : "auto",
            userSelect: pageLoading ? "none" : "auto",
            transition: "filter 0.3s ease-out",
          }}
        >
          {/* your actual "Share feedback" form goes here */}
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <div
        style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 32,
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "-0.5px",
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              Public Feedback
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>
              Vote on ideas and bug reports. The best feedback rises to the top.
            </p>
          </div>
          {/* <Link href="/post" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px',
            borderRadius: 9, fontSize: 13.5, fontWeight: 600, color: '#fff',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 2px 6px rgba(99,102,241,0.3)', whiteSpace: 'nowrap',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Share feedback
          </Link> */}
        </div>

        {/* Accept messages toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px",
            borderRadius: 10,
            marginBottom: 12,
            border: `1px solid ${acceptMessage ? "#c7d2fe" : "var(--border)"}`,
            background: acceptMessage ? "#eef2ff" : "var(--bg-subtle)",
            transition: "all 0.2s",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                flexShrink: 0,
                background: acceptMessage ? "#6366f1" : "var(--border-strong)",
                boxShadow: acceptMessage
                  ? "0 0 0 2px rgba(99,102,241,0.2)"
                  : "none",
                transition: "all 0.2s",
              }}
            />
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                whiteSpace: "nowrap",
              }}
            >
              Accept messages
            </p>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: "1px 6px",
                borderRadius: 99,
                background: acceptMessage ? "#6366f1" : "var(--border-strong)",
                color: acceptMessage ? "#fff" : "var(--text-secondary)",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              {acceptMessage ? "ON" : "OFF"}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Refresh button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                fetchFeedbacks(true);
              }}
              title="Refresh feed"
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                cursor: "pointer",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--bg-muted)";
                (e.currentTarget as HTMLElement).style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "var(--surface)";
                (e.currentTarget as HTMLElement).style.color =
                  "var(--text-secondary)";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                style={{
                  transition: "transform 0.6s ease",
                  transform: refreshing ? "rotate(360deg)" : "rotate(0deg)",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Toggle */}

            <div
              style={{
                position: "relative",
                width: 40,
                height: 22,
                borderRadius: 99,
                cursor: "pointer",
                background: acceptMessage ? "#6366f1" : "var(--border-strong)",
                border: "none",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessage ?? true}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              ></Switch>
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: acceptMessage ? 20 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  transition: "left 0.2s",
                }}
              />
            </div>
          </div>
        </div>

        {/* Public URL bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 16,
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
            background: "var(--surface)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flex: 1,
              padding: "0 14px",
              height: 40,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                fontFamily: "monospace",
                letterSpacing: "-0.2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {profileURL}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            style={{
              height: 40,
              padding: "0 16px",
              border: "none",
              borderLeft: "1px solid var(--border)",
              background: copied ? "#ecfdf5" : "var(--bg-subtle)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12.5,
              fontWeight: 600,
              color: copied ? "#10b981" : "var(--text-secondary)",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {copied ? (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                  />
                </svg>
                Copy link
              </>
            )}
          </button>
        </div>

        {/* Search + Sort */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 200,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 12px",
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              boxShadow: "var(--shadow-sm)",
              height: 38,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-tertiary)"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35"
              />
            </svg>
            <input
              type="text"
              placeholder="Search feedback..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 13.5,
                color: "var(--text)",
                flex: 1,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid var(--border)",
              borderRadius: 9,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {(["top", "new"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                style={{
                  padding: "0 16px",
                  height: 38,
                  fontSize: 13,
                  fontWeight: 500,
                  color: sort === s ? "var(--accent)" : "var(--text-secondary)",
                  background:
                    sort === s ? "var(--accent-subtle)" : "var(--surface)",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {s === "top" ? "↑ Top" : "✦ New"}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        {/* <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setActive(c)} style={{
              padding: '5px 12px', borderRadius: 99, fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              border: `1px solid ${active === c ? 'var(--accent)' : 'var(--border)'}`,
              background: active === c ? 'var(--accent-subtle)' : 'var(--surface)',
              color: active === c ? 'var(--accent-text)' : 'var(--text-secondary)',
              transition: 'all 0.15s',
            }}>
              {c}
            </button>
          ))}
        </div> */}

        {/* Items */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            opacity: refreshing ? 0.4 : 1,
            transition: "opacity 0.3s",
          }}
        >
          {!acceptMessage && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #fde68a",
                background: "#fffbeb",
                fontSize: 13,
                color: "#92400e",
                display: "flex",
                alignItems: "center",
                gap: 8,
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              This board is currently not accepting new submissions.
            </div>
          )}
          {posts?.length === 0 && (
            <div
              style={{
                padding: "64px 0",
                textAlign: "center",
                color: "var(--text-tertiary)",
                fontSize: 14,
              }}
            >
              No feedback found.{" "}
              <Link
                href="/post"
                style={{ color: "var(--accent)", fontWeight: 500 }}
              >
                Be the first to share.
              </Link>
            </div>
          )}
          {posts?.map((item) => {
            // const cfg = CATEGORY_CONFIG[item.category]
            const id = item._id.toString();
            const formatted = new Date(item.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            );
            return (
              <div
                key={id}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "18px 20px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                  transition: "box-shadow 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "var(--shadow-md)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border-strong)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "var(--shadow-sm)";
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border)";
                }}
              >
                {/* Vote
                <button onClick={() => toggle(item.id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: '6px 10px', borderRadius: 9, cursor: 'pointer',
                  border: item.voted ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: item.voted ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
                  color: item.voted ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'all 0.15s', minWidth: 52,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={item.voted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                  <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{item.votes}</span>
                </button> */}

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* <span style={{
                      padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                      color: cfg.color, background: cfg.bg,
                    }}>
                      {item.category}
                    </span> */}
                    <span
                      style={{ fontSize: 12, color: "var(--text-tertiary)" }}
                    >
                      {formatted}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 14.5,
                      fontWeight: 600,
                      color: "var(--text)",
                      marginBottom: 5,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      lineHeight: 1.55,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginTop: 10,
                    }}
                  >
                    {/* <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <img src={item.avatar} alt={item.author} style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover', background: 'var(--bg-muted)' }} />
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.author}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-tertiary)', fontSize: 12 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      {item.replies}
                    </div> */}
                  </div>
                </div>
                <button
                  aria-label="Delete feedback"
                  onClick={() => setPendingId(id)}
                  style={{
                    flexShrink: 0,
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    border: "1px solid #f1d9d9",
                    background: "#fdf3f3",
                    color: "#d9534f",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrashIcon style={{ width: 15, height: 15 }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <ConfirmDeleteDialog
        open={pendingId !== ""}
        onCancel={() => setPendingId("")}
        onConfirm={handleConfirm}
      />
    </div>
  );
}

function ConfirmDeleteDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(20,20,25,0.45)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 24,
          width: 320,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#fdeaea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px",
          }}
        >
          <TrashIcon style={{ width: 20, height: 20, color: "#e0504f" }} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>
          Delete this feedback?
        </div>
        <div
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginTop: 6,
            lineHeight: 1.5,
          }}
        >
          This can't be undone. The feedback will be permanently removed.
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "1px solid #e5e5e5",
              background: "#fff",
              fontSize: 13,
              fontWeight: 600,
              color: "#444",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: "#e0504f",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
