import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import Request from "../../types/Request";

import Category,{ TCategory, ICategory  } from "../../models/Category";


const router: Router = Router();

router.get("/", async (_req, res) => {
    const cat: ICategory = await Category.find({},{categoryname:1,_id:0});
    res.status(HttpStatusCodes.OK).json(cat);
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
});

router.post('/find', async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    try {
        const search:string|number = req.body.categoryname;
        
        const cat: ICategory = await Category.find({ 'categoryname': new RegExp(search, 'i') },{categoryname:1,_id:1});
        if(cat){
            
            return res.send(cat);
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

router.post('/delete', async (req: Request, res: Response) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    const { categoryname } = req.body;
    try {
        const cat: ICategory = await Category.findOne({ categoryname });
        if(cat){
            await Category.deleteOne({categoryname});
            return res.send(cat);
        }
    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
});

export default router;