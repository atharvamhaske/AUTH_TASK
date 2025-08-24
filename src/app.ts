import { Hono } from 'hono'

const app = new Hono()

//middlw

app.use('*', async (c, next) => {
    
})