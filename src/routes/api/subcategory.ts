import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";

import Category, { ICategory } from '../../models/Category';
import SubCategory, { ISubCategory, TSubCategory } from '../../models/SubCategory';

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const subcategory: ISubCategory[] = await SubCategory
        .find()
        .select("_id categoryname subcategory")
        .populate("category", [
            "categoryname"
        ]);
        res.json(subcategory)
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
    // res.send(" Sub-Category API works");
})

router.post("/create", async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    
    const {
        category,
        subcategory,
        categoryname
    } = req.body;
    
    const subCatFields: TSubCategory = {
        category:req.body.category,
        subcategory,
        categoryname,
    };

    try {
        
        let subcat: ISubCategory = await SubCategory.findOne({subcategory})
        if(subcat){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors:[{
                    msg: 'Sub Category already exists'
                }]
            })
        }

        subcat = new SubCategory(subCatFields);
        await subcat.save();

        res.json(subcat);
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

export default router;