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

app.get("/", (_req: Request, res: Response) => {
   res.status(200).json({ data: "Server running" })
})

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
   next(createError(404))
})

// error handler
app.use(
   (
      err: createError.HttpError,
      req: Request,
      res: Response,
      _next: NextFunction
   ) => {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get("env") === "development" ? err : {}

      // render the error page
      res.status(err.status || 500)
      res.render("error")
   }
)

// Move the CORS headers middleware here
app.use((_req: Request, res: Response, next: NextFunction) => {
   res.setHeader("Access-Control-Allow-Origin", "*")
   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
   res.setHeader("Access-Control-Allow-Credentials", "true")
   next()
})

export default app
