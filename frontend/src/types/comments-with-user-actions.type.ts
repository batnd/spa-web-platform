export type CommentsWithUserActionsType = {
  allCount: number,
  comments: {
    id: string,
    text: string,
    date: string,
    likesCount: number,
    dislikesCount: number,
    user: {
      id: string,
      name: string
    },
    userLiked: boolean,
    userDisliked: boolean
  }[]
}
