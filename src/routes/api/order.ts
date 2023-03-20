import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Cart, { TCart } from "../../models/Cart";
const router: Router = Router();

router.get("/", (req:Request, res: Response) => {
    res.send('Order API Hint');
})

router.get("/createOrder/:id" , async (req: Request, res: Response) => {
    
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }    
        const customerId = req.params.id;
        
        let cart : TCart = await Cart.findOne({ customer: customerId });
        if(!cart){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors: [{
                    type: HttpStatusCodes.BAD_REQUEST,
                    message: 'noUserInCart',
                }]
            })
        } else {
            res.json(cart);
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

export default router;