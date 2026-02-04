import { Router, Request, Response } from "express";
import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";

const invoiceRouter = Router();

/**
 * @swagger
 * /invoice/{id}:
 *   get:
 *     summary: Find an invoice by ID
 *     tags: [Invoice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 document:
 *                   type: string
 *                 address:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     number:
 *                       type: string
 *                     complement:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */
invoiceRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const facade = InvoiceFacadeFactory.create();
    const { id } = req.params;

    const result = await facade.find({ id });

    if (!result) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default invoiceRouter;
