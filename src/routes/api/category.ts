import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";

import Category,{ TCategory, ICategory  } from "../../models/Category";


const router: Router = Router();

router.get("/", (_req, res) => {
    res.send(" Category API works");
});

router.post("/create", async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { categoryname } = req.body;
    
    try {
        let cat: ICategory = await Category.findOne({categoryname});
        if(cat){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors:[{
                    msg: 'Category already exists',
                }]
            })
        }

        const categoryFields: TCategory = {
            categoryname,
        };
            
        cat = new Category(categoryFields);
        await cat.save();

        res.json(cat);
        
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
    }
)

router.post("/update", [ check("categoryname", "Category Name is required").not().isEmpty() ], async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    
    const { categoryname} = req.body;
    try {
        
        let prod: ICategory = await Category.findOne({ categoryname });
        if(prod){
            return res.send(categoryname);
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
    //const catFields: TCategory = {}

    //res.send(" Category Update API works");
});

export default router;