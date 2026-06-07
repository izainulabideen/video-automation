export interface AppTables {
  users: {
    Row: {
      id: string
      name: string
      email: string
      password_hash: string
      role: string
      is_active: boolean
      invited_by: string | null
      created_at: string
    }
    Insert: {
      id?: string
      name: string
      email: string
      password_hash: string
      role?: string
      is_active?: boolean
      invited_by?: string | null
      created_at?: string
    }
    Update: {
      id?: string
      name?: string
      email?: string
      password_hash?: string
      role?: string
      is_active?: boolean
      invited_by?: string | null
    }
    Relationships: []
  }
  password_reset_tokens: {
    Row: {
      id: string
      user_id: string
      token_hash: string
      expires_at: string
      used_at: string | null
      created_at: string
    }
    Insert: {
      id?: string
      user_id: string
      token_hash: string
      expires_at: string
      used_at?: string | null
      created_at?: string
    }
    Update: {
      used_at?: string | null
    }
    Relationships: []
  }
  invite_tokens: {
    Row: {
      id: string
      email: string
      role: string
      token_hash: string
      invited_by: string | null
      expires_at: string
      accepted_at: string | null
      created_at: string
    }
    Insert: {
      id?: string
      email: string
      role?: string
      token_hash: string
      invited_by?: string | null
      expires_at: string
      accepted_at?: string | null
      created_at?: string
    }
    Update: {
      accepted_at?: string | null
    }
    Relationships: []
  }
}
