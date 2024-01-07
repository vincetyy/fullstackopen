import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notificationChange(state, action) {
      return action.payload
    },
    removeNotification() {
      return null
    }
  }
})

export const { notificationChange, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer