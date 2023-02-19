import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";

import Product, { TProducts, IProduct } from "../../models/Product";
import Customer, { ICustomer } from "../../models/Customers";
import Cart, {ICart, TCart} from "../../models/Cart";

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {

    res.send('Cart API ');
})

router.get('/user-cart/:id', async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    let customerId = req.params.id;

    const cartItem = await Cart.find({customer:customerId})

    if(cartItem.length == 0){
        return res.status(HttpStatusCodes.NOT_FOUND).json({
            errors:[{
                type: 'Error',
                message: 'noCartForUser',
            }]
        })
    }

    return res.status(HttpStatusCodes.OK).json({
        errors:[{
            type: 'Success',
            message: 'successfulCartFound',
            cartItem
        }]
    }) 

})

router.get('/add-to-cart', async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { productId, customerId} = req.body
    
    let cart;
    //let cartItem;
    try {
        if(customerId) {
            let cartItem:ICart = await Cart.findOne({customer: customerId, productId : productId})
            if(cartItem) {
                if(cartItem.productId.toString() === productId && cartItem.customer.toString() === customerId){
                    let qty:any = cartItem.qty
                    qty++
                    const prod : TProducts = await Product.findById({ _id: productId});
                    let totalCost = prod.price * qty ;
                    const updateCart = {
                        qty: qty,
                        totalQty:qty,
                        totalCost: totalCost,

                    } 
                    cart = await Cart.findOneAndUpdate(
                        { customer: customerId, productId : productId },
                        { $set: updateCart },
                        { new: true }
                    )
                    res.json('IF')
                }
            } else {
                
                const prod : TProducts = await Product.findById({ _id: productId});
                const cartFields = {
                    productId:productId,
                    qty:1,
                    price:prod.price,
                    title:prod.productname,
                    totalQty: 1,
                    totalCost:prod.price,
                    customer: customerId,
                }
        
                cart = new Cart(cartFields);
                await cart.save();
                res.json('ELSE')
            }
        }
        return false;

    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }

})

router.get('/descrease-cart/:id', async (req: Request, res: Response) => {
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
        }
        let customerId = req.params.id;
        const { productId } = req.body;
        
        const cart = await Cart.find({ customer: customerId, productId: productId })
        if(cart.length == 0){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors: [{
                    type: 'Error',
                    msg: 'Invalid Request'
                }]
            })
        }
        for(const index of cart){
            if(index.productId.toString() === productId && index.customer.toString() === customerId){
                if(index.qty > 1){
                    let _descQty = index.qty.valueOf();
                    _descQty--;
                    const descFields = {
                        qty: _descQty,
                        totalQty:_descQty,
                        totalCost: (index.totalCost.valueOf() - index.price.valueOf() ),
                    }

                    let updatecart = await Cart.findOneAndUpdate(
                        { customer: customerId, productId : productId },
                        { $set: descFields },
                        { new: true }
                    )

                    return res.status(HttpStatusCodes.OK).json({
                        type: 'Success',
                        message: 'ReduceByOne',
                    })
                } else {
                    await Cart.findOneAndDelete({customer: customerId, productId: productId})
                    
                    return res.status(HttpStatusCodes.OK).json({
                        type: 'Success',
                        message: 'cartEmpty',
                    })
                }
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }

})

router.get('/increase-cart/:id', async (req: Request, res: Response) => {
    try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }

    let customerId = req.params.id;
    const { productId } = req.body;
    
        const cart = await Cart.find({ customer: customerId, productId: productId })
        if(cart.length == 0){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors: [{
                    type: 'Error',
                    msg: 'Invalid Request'
                }]
            })
        }
        for(const index of cart){
            if(index.productId.toString() === productId && index.customer.toString() === customerId){
                if(index.qty){
                    let _descQty = index.qty.valueOf();
                    _descQty++;
                    const descFields = {
                        qty: _descQty,
                        totalQty:_descQty,
                        totalCost: (index.totalCost.valueOf() +  index.price.valueOf() ),
                    }

                    let updatecart = await Cart.findOneAndUpdate(
                        { customer: customerId, productId : productId },
                        { $set: descFields },
                        { new: true }
                    )

                    return res.status(HttpStatusCodes.OK).json({
                        type: 'Success',
                        message: 'IncreaseByOne',
                    })
                } else {
                    res.json('else')
                }
            }
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }

})

export default router;