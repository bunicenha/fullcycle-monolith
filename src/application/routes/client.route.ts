import { Router, Request, Response } from "express";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../modules/@shared/domain/value-object/address";

const clientRouter = Router();

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - document
 *               - address
 *             properties:
 *               id:
 *                 type: string
 *                 description: Optional client ID
 *               name:
 *                 type: string
 *                 description: Client name
 *               email:
 *                 type: string
 *                 description: Client email
 *               document:
 *                 type: string
 *                 description: Client document (CPF/CNPJ)
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - number
 *                   - complement
 *                   - city
 *                   - state
 *                   - zipCode
 *                 properties:
 *                   street:
 *                     type: string
 *                   number:
 *                     type: string
 *                   complement:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
clientRouter.post("/", async (req: Request, res: Response) => {
  try {
    const facade = ClientAdmFacadeFactory.create();
    const { id, name, email, document, address } = req.body;

    const addressObj = new Address(
      address.street,
      address.number,
      address.complement,
      address.city,
      address.state,
      address.zipCode
    );

    await facade.add({
      id,
      name,
      email,
      document,
      address: addressObj,
    });

    res.status(201).json({
      message: "Client created successfully",
      client: { id, name, email, document, address },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default clientRouter;
