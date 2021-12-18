const express = require('express'); 
const cors = require('cors');

const port = process.env.Port
require('./db/mongoose');
const studentsRouter = require('./routers/studentsRouter');
const lecturersRouter = require('./routers/lecturersRaouter');
const coursesRouter = require('./routers/coursesRouter');

const app = express();

app.use(express.json());
app.use(cors());
app.use(studentsRouter);
app.use(lecturersRouter);
app.use(coursesRouter);

app.listen(port,()=>{
    console.log('Server conecctes port: ',port);
});