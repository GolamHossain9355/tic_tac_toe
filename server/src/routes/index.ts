import express, { Request, Response } from "express"
const router = express.Router()

/* GET home page. */
router.get("/", (_req: Request, res: Response) => {
   res.status(200).json({ data: "Server running" })
})

module.exports = router
