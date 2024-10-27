import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema2 = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export const taskSchema = z.object({
  userAddress: z.string(),
  healthFactor: z.string(),
  totalCollateralBase: z.string(),
  totalDebtBase: z.string(),
  liquidationThreshold: z.number(),
  display: z.string()
})

export type Task = z.infer<typeof taskSchema>
