export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export type ScenarioStatus = 'draft' | 'in_production' | 'published'
export type VideoStatus = 'editing' | 'exported' | 'published'
export type AiTool = 'midjourney' | 'dalle3'
