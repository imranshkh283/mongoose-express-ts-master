import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";

import auth from "../../middleware/auth";
import { cauth } from "../../middleware/cauth";

import Customer, {ICustomer, TCustomer} from '../../models/customers';
import CustomerProfile, { ICustomerProfile,TCustomerProfile } from '../../models/CustomersProfile';
const router: Router = Router(); 

router.get('/', cauth, async (req,res) => {
    res.send('Customer API');
})

router.post("/updateProfile", auth, async (req: Request, res: Response) => {
    
    const { 
        customerEmail,
        firstName, 
        lastName, 
        mobileNumber,
        address,
        city,
        country,
        pincode } = req.body;

    try {

        let cust: ICustomer = await Customer.findOne({ customerEmail: req.body.customerEmail });
        if(!cust){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
            errors: [
                {
                msg: "Customer not registered",
                },
            ],
            });
        }
        const cusProFields:TCustomerProfile = {
            customerID:cust._id,
            firstName,
            lastName,
            mobileNumber,
            address,
            city,
            country,
            pincode,
        }
        
        let cusPro: ICustomerProfile = await CustomerProfile.findOne({ customerID: cust._id })
        
        if(cusPro) {
            cusPro = await CustomerProfile.findOneAndUpdate(
                { customerID: cust._id },
                { $set: cusProFields },
                { new: true }
              );
            return res.json({
                msg:'Profile update success',
                res:cusPro
            });
        }

        cusPro = new CustomerProfile(cusProFields);
        await cusPro.save();
        res.json(cusPro);

    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }
})

router.post("/create", [ check("customerEmail", "Please include a valid email").isEmail(), check("cusPassword","Please enter a password with 6 or more characters").isLength({ min: 6 }) ], async (req: Request, res: Response) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { customerEmail,cusPassword } = req.body;
    try {
        
        let customer: ICustomer = await Customer.findOne({ customerEmail });

        if(customer){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors:[
                    {
                        msg: "Please login with Password",
                    },
                ],
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(cusPassword, salt);

        const cusFields: TCustomer = {
            customerEmail,
            cusPassword:hash,
        }
        
        customer = new Customer(cusFields);
        await customer.save();

        const payload = {
            customerId: customer.id,
        };
    
        jwt.sign(payload,config.get("jwtSecret"),{ expiresIn: config.get("jwtExpiration") },(err, token) => {
              if (err) throw err;
              res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send("Server Error");
    }

})

router.post("/login", [ check("customerEmail", "Email is required").isEmail(), check("cusPassword","Password is required").not().isEmpty() ] ,async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res
          .status(HttpStatusCodes.BAD_REQUEST)
          .json({ errors: errors.array() });
    }
    try {
        const { customerEmail, cusPassword } = req.body;
        // find the customer by email id
        let customer: ICustomer = await Customer.findOne({customerEmail})
        if(!customer){
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
                errors:[
                    {
                        msg: "Invalid Credentials",
                    },
                ],
            });
        }
        const isMatch = await bcrypt.compare(cusPassword, customer.cusPassword)

        if (!isMatch) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({ errors: [{ message: 'Invalid email or password' }] })
        }
        //Create the JWT

        const data = {
            custToken: {
                id: customer._id,
            },
        }

        jwt.sign(data,config.get("jwtSecret"),{ expiresIn: config.get("jwtExpiration") }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        })

    } catch (err) {
        console.error(err.message);
        res.status(HttpStatusCodes.BAD_REQUEST).send("Invalid email or password");
    }

})

export default router;