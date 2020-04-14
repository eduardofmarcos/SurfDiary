const express = require('express')
const app = require('./app')


const server = app.listen(3000,()=>{
    console.log('Listening on port 3000...')
})