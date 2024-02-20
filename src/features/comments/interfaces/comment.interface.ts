export type ICommentDb = {
  comment_id: number
  comment_blog_id: number
  comment_user_id: number
  comment: string
  parent_comment_id: number
  created_at: Date
  comment_like?: number
  reply_count?: number
}
