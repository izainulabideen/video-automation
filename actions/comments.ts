'use server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/types/app'
import { logActivity } from './activity'
import { getSession } from '@/lib/session'
import { sendCommentNotification, sendAssignmentNotification } from '@/lib/email'

export type Comment = {
  id: string
  scenario_id: string
  parent_id: string | null
  user_name: string
  user_email: string | null
  body: string
  is_resolved: boolean
  created_at: string
  updated_at: string
  reactions: { emoji: string; user_name: string }[]
  replies?: Comment[]
}

export async function getComments(scenarioId: string): Promise<Comment[]> {
  const db = createAdminClient()
  const { data: comments } = await db
    .from('scenario_comments')
    .select('*, reactions:comment_reactions(emoji, user_name)')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: true })

  if (!comments) return []

  // Build thread tree — top-level first, then attach replies
  const map = new Map<string, Comment>()
  const roots: Comment[] = []

  for (const c of comments as Comment[]) {
    map.set(c.id, { ...c, replies: [] })
  }
  for (const c of map.values()) {
    if (c.parent_id) {
      map.get(c.parent_id)?.replies?.push(c)
    } else {
      roots.push(c)
    }
  }
  return roots
}

export async function addComment(
  scenarioId: string,
  body: string,
  parentId?: string
): Promise<ActionResult<{ id: string }>> {
  const db = createAdminClient()
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { data, error } = await db
    .from('scenario_comments')
    .insert({
      scenario_id: scenarioId,
      parent_id: parentId ?? null,
      user_name: session.name,
      user_email: session.email ?? null,
      body,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session.name, parentId ? 'Replied to comment' : 'Added comment')

  // Notify assignee if they exist and aren't the commenter
  const { data: scenario } = await db
    .from('scenarios')
    .select('title, assigned_to')
    .eq('id', scenarioId)
    .single()
  if (scenario?.assigned_to && scenario.assigned_to !== session.name) {
    const { data: assignee } = await db
      .from('users')
      .select('email')
      .eq('name', scenario.assigned_to)
      .single()
    if (assignee?.email) {
      await sendCommentNotification(assignee.email, session.name, scenario.title, scenarioId, body)
    }
  }

  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: { id: data.id } }
}

export async function deleteComment(id: string, scenarioId: string): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { error } = await db.from('scenario_comments').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session?.name ?? 'Unknown', 'Deleted comment')
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function resolveComment(id: string, scenarioId: string, resolved: boolean): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { error } = await db
    .from('scenario_comments')
    .update({ is_resolved: resolved })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  await logActivity(scenarioId, session?.name ?? 'Unknown', resolved ? 'Resolved comment' : 'Reopened comment')
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function toggleReaction(
  commentId: string,
  scenarioId: string,
  emoji: string
): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  if (!session) return { success: false, error: 'Not authenticated' }

  const { data: existing } = await db
    .from('comment_reactions')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_name', session.name)
    .eq('emoji', emoji)
    .single()

  if (existing) {
    await db.from('comment_reactions').delete().eq('id', existing.id)
  } else {
    await db.from('comment_reactions').insert({ comment_id: commentId, user_name: session.name, emoji })
  }

  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}

export async function assignScenario(
  scenarioId: string,
  assignedTo: string | null,
  dueDate?: string | null
): Promise<ActionResult> {
  const db = createAdminClient()
  const session = await getSession()
  const { error } = await db
    .from('scenarios')
    .update({ assigned_to: assignedTo, due_date: dueDate ?? null })
    .eq('id', scenarioId)
  if (error) return { success: false, error: error.message }
  if (assignedTo) {
    await logActivity(scenarioId, session?.name ?? 'Unknown', `Assigned to ${assignedTo}`)
    // Notify the assigned user
    const { data: scenario } = await db.from('scenarios').select('title').eq('id', scenarioId).single()
    const { data: assignee } = await db.from('users').select('email').eq('name', assignedTo).single()
    if (assignee?.email && scenario?.title) {
      await sendAssignmentNotification(assignee.email, session?.name ?? 'Someone', scenario.title, scenarioId)
    }
  }
  revalidatePath(`/scenarios/${scenarioId}`)
  return { success: true, data: undefined }
}
