import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange, removeNotification } from '../reducers/notificationReducer'

const AnecdotesList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === '') {
      return anecdotes
    }
    return anecdotes.filter(anecdote => anecdote.content.includes(filter))
  })

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(notificationChange(`you voted '${anecdote.content}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
    
  }
  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdotesList