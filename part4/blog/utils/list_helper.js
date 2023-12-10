const _ = require('lodash')

const dummy = (blogs) => {
  return blogs === blogs ? 1 : 0
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((most, item) => item.likes > most ? item.likes : most, 0)
  return blogs.find((item) => item.likes === mostLikes)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = _.countBy(blogs, 'author')
  const mostBlogs = _.maxBy(_.toPairs(counts), _.last)

  return ({
    author: mostBlogs[0],
    blogs: mostBlogs[1]
  })
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = _(blogs).groupBy('author')
    .reduce((most, item) => {
      return (
        _.sumBy(item, 'likes') < most.likes ? most : {
          author: item[0].author,
          likes: _.sumBy(item, 'likes')
        }
      )
    },
    {
      author: 'test',
      likes: -1
    })

  return counts
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}