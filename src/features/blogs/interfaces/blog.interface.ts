export interface IBlogDb {
  blog_id: number
  blog_user: number
  title: string
  banner: string
  content: any[]
  tags: string[]
  total_likes: number
  total_comments: number
  total_reads: number
  total_parent_comments: number
  // comments: IComment
  created_at: Date
}
