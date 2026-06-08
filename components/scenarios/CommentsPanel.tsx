'use client'
import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addComment, deleteComment, resolveComment, toggleReaction } from '@/actions/comments'
import type { Comment } from '@/actions/comments'
import { MessageSquare, Check, Trash2, Reply, Loader2, CornerDownRight, CheckCheck } from 'lucide-react'

const REACTIONS = ['👍', '🔥', '✅', '❌', '🤔', '💡']

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (m < 1)   return 'just now'
  if (m < 60)  return `${m}m ago`
  if (h < 24)  return `${h}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(d).toLocaleDateString()
}

function ReactionBar({ comment, scenarioId, currentUser }: { comment: Comment; scenarioId: string; currentUser: string }) {
  const router = useRouter()
  // Group reactions by emoji
  const groups: Record<string, string[]> = {}
  for (const r of comment.reactions) {
    groups[r.emoji] = groups[r.emoji] ?? []
    groups[r.emoji]!.push(r.user_name)
  }

  async function react(emoji: string) {
    await toggleReaction(comment.id, scenarioId, emoji)
    router.refresh()
  }

  return (
    <div className="flex items-center flex-wrap gap-1 mt-2">
      {Object.entries(groups).map(([emoji, users]) => (
        <button key={emoji} onClick={() => react(emoji)}
          className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] border transition-all ${
            users.includes(currentUser)
              ? 'bg-accent/15 border-accent/30 text-accent'
              : 'bg-white/[0.03] border-white/[0.07] text-brand-400 hover:border-white/[0.15]'
          }`}>
          <span>{emoji}</span>
          <span>{users.length}</span>
        </button>
      ))}
      <div className="relative group/react">
        <button className="px-2 py-0.5 rounded-full text-[11px] border border-white/[0.06] text-brand-600 hover:border-white/[0.15] hover:text-brand-400 transition-all">+</button>
        <div className="absolute bottom-full left-0 mb-1 hidden group-hover/react:flex gap-1 bg-[#0D1117] border border-white/[0.1] rounded-xl px-2 py-1.5 shadow-xl z-10">
          {REACTIONS.map(e => (
            <button key={e} onClick={() => react(e)} className="text-base hover:scale-125 transition-transform">{e}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  scenarioId,
  currentUser,
  depth = 0,
}: {
  comment: Comment
  scenarioId: string
  currentUser: string
  depth?: number
}) {
  const router = useRouter()
  const [replying, setReplying]     = useState(false)
  const [replyText, setReplyText]   = useState('')
  const [, startTransition]         = useTransition()
  const [deleting, setDeleting]     = useState(false)
  const [resolving, setResolving]   = useState(false)
  const replyRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { if (replying) replyRef.current?.focus() }, [replying])

  function submitReply() {
    if (!replyText.trim()) return
    const text = replyText.trim()
    setReplyText(''); setReplying(false)
    startTransition(async () => {
      await addComment(scenarioId, text, comment.id)
      router.refresh()
    })
  }

  async function handleDelete() {
    setDeleting(true)
    await deleteComment(comment.id, scenarioId)
    router.refresh()
  }

  async function handleResolve() {
    setResolving(true)
    await resolveComment(comment.id, scenarioId, !comment.is_resolved)
    setResolving(false)
    router.refresh()
  }

  const isOwn = comment.user_name === currentUser

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l border-white/[0.05] pl-4' : ''}`}>
      <div className={`rounded-xl p-3.5 border transition-all ${
        comment.is_resolved
          ? 'bg-white/[0.01] border-white/[0.04] opacity-60'
          : 'bg-white/[0.02] border-white/[0.07]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent/60 to-accent-2/60 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
              {comment.user_name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-brand-200">{comment.user_name}</span>
            <span className="text-[10px] text-brand-600">{timeAgo(comment.created_at)}</span>
            {comment.is_resolved && (
              <span className="text-[10px] text-success bg-success/10 border border-success/20 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCheck size={9} /> resolved
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover/comment:opacity-100 transition-opacity">
            {depth === 0 && (
              <button onClick={handleResolve} disabled={resolving} title={comment.is_resolved ? 'Reopen' : 'Resolve'}
                className="p-1 rounded-md text-brand-600 hover:text-success hover:bg-success/10 transition-all disabled:opacity-40">
                {resolving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
              </button>
            )}
            <button onClick={() => setReplying(r => !r)} title="Reply"
              className="p-1 rounded-md text-brand-600 hover:text-brand-300 hover:bg-white/[0.05] transition-all">
              <Reply size={11} />
            </button>
            {isOwn && (
              <button onClick={handleDelete} disabled={deleting} title="Delete"
                className="p-1 rounded-md text-brand-600 hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-40">
                {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-brand-200 leading-relaxed whitespace-pre-wrap">{comment.body}</p>

        {/* Reactions */}
        <ReactionBar comment={comment} scenarioId={scenarioId} currentUser={currentUser} />

        {/* Reply input */}
        {replying && (
          <div className="mt-3 flex items-start gap-2">
            <CornerDownRight size={12} className="text-brand-600 mt-2.5 shrink-0" />
            <div className="flex-1 flex gap-2">
              <textarea
                ref={replyRef}
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitReply() }}
                placeholder="Write a reply… (⌘Enter to send)"
                rows={2}
                className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-lg px-3 py-2 text-xs text-white placeholder-brand-500 focus:border-accent/50 outline-none resize-none transition-all"
              />
              <div className="flex flex-col gap-1.5">
                <button onClick={submitReply}
                  className="bg-accent/15 border border-accent/25 text-accent rounded-lg px-3 py-1.5 text-[11px] font-medium hover:bg-accent/25 transition-all whitespace-nowrap">
                  Reply
                </button>
                <button onClick={() => { setReplying(false); setReplyText('') }}
                  className="text-[11px] text-brand-600 hover:text-brand-400 transition-colors text-center">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} scenarioId={scenarioId} currentUser={currentUser} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface Props {
  scenarioId: string
  comments: Comment[]
  currentUser: string
}

export function CommentsPanel({ scenarioId, comments, currentUser }: Props) {
  const router = useRouter()
  const [body, setBody]             = useState('')
  const [showResolved, setShowResolved] = useState(false)
  const [, startTransition]         = useTransition()

  const active   = comments.filter(c => !c.is_resolved)
  const resolved = comments.filter(c => c.is_resolved)
  const shown    = showResolved ? comments : active

  function submit() {
    if (!body.trim()) return
    const text = body.trim()
    setBody('')
    startTransition(async () => {
      await addComment(scenarioId, text)
      router.refresh()
    })
  }

  return (
    <div>
      {/* New comment */}
      <div className="mb-4">
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
          placeholder="Leave a comment… (⌘Enter to post)"
          rows={3}
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-brand-500 focus:border-accent/40 outline-none resize-none transition-all"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-brand-600">Posting as <span className="text-brand-400">{currentUser}</span></span>
          <button onClick={submit} disabled={!body.trim()}
            className="flex items-center gap-1.5 bg-accent/15 border border-accent/25 text-accent rounded-lg px-3.5 py-1.5 text-xs font-medium hover:bg-accent/25 transition-all disabled:opacity-30">
            <MessageSquare size={11} />
            Post
          </button>
        </div>
      </div>

      {/* Thread */}
      {shown.length === 0 && active.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2">
          <MessageSquare size={18} className="text-brand-700" />
          <p className="text-[11px] text-brand-600">No comments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map(c => (
            <div key={c.id} className="group/comment">
              <CommentItem comment={c} scenarioId={scenarioId} currentUser={currentUser} />
            </div>
          ))}
        </div>
      )}

      {/* Toggle resolved */}
      {resolved.length > 0 && (
        <button onClick={() => setShowResolved(v => !v)}
          className="mt-3 text-[11px] text-brand-600 hover:text-brand-400 transition-colors flex items-center gap-1">
          <CheckCheck size={11} />
          {showResolved ? 'Hide' : 'Show'} {resolved.length} resolved
        </button>
      )}
    </div>
  )
}
