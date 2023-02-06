import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";

import Category, { ICategory } from '../../models/Category';
import SubCategory, { ISubCategory, TSubCategory } from '../../models/SubCategory';

import Product, { TProducts, IProduct } from "../../models/Product";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {

    try {
        const product:IProduct[] = await Product.aggregate([

            // Join with user_info table
            {
                $lookup:{
                    from: "subcategories",       // other table name
                    localField: "subcategory",   // name of users table field
                    foreignField: "_id", // name of userinfo table field
                    as: "subcat_info"         // alias for userinfo table
                }
            },
            //{   $unwind:"$subcat_info" },     // $unwind used for getting data in object or for one record only
        
            // Join with user_role table
            {
                $lookup:{
                    from: "categories", 
                    localField: "category", 
                    foreignField: "_id",
                    as: "cat_info"
                }
            },
            //{   $unwind:"$cat_info" },
        
            // define some conditions here 
            /*{
                $match:{
                    $and:[{"userName" : "admin"}]
                }
            }, */
        
            // define which fields are you want to fetch
            /* {   
                $project:{
                    _id : 1,
                    categoryname : 1,
                    subcategory : 1,
                    productname : 1,
                    description : 1,
                    price : 1,
                } 
            } */
        ]);
        res.json(product)
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

router.post("/create", async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { productname, price, description } = req.body;
    const productFields:TProducts = {
        category:req.body.category,
        subcategory:req.body.subcategory,
        productname,
        price,
        description
    }

    try {
        let prod: IProduct = await Product.findOne({productname});
        if(prod){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors:[{
                    msg: 'Product already exists',
                }]
            })
        }

        prod = new Product(productFields);
        await prod.save();

        res.json(prod);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

export default router;