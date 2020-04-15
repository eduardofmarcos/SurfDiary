const express = require('express')
const authApp = require('./authApp')


const server = authApp.listen(4000,()=>{
    console.log('Listening on port 4000...')
})