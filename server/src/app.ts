import "reflect-metadata"
import createError from "http-errors"
import express, { Request, Response, NextFunction } from "express"
import path from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from "cors"

const indexRouter = require("./routes/index")

const app = express()

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())

app.use("/", indexRouter)

// Move the CORS headers middleware here
app.use((_req: Request, res: Response, next: NextFunction) => {
   res.setHeader("Access-Control-Allow-Origin", "*")
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
   res.setHeader("Access-Control-Allow-Credentials", "true")
   next()
})

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
   next(createError(404))
})

// error handler
app.use(
   (
      err: createError.HttpError,
      _req: Request,
      res: Response,
      _next: NextFunction
   ) => {
      res.status(err.status || 500).json({
         error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
         },
      })
   }
)

export default app
