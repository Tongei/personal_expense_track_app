import query from "../config/db.js"
import { resObj } from "../utils/functions.js";
import { vPostExpense, vPutExpense } from "../validations/expense.js"
import jwt from 'jsonwebtoken'
import ExpenseModel from '../models/expense.js'
import { format, formatDate } from "date-fns";



export const postExpense = async(req, res)=>{
    try{
    const validationErrors = vPostExpense(req.body);
    if(validationErrors){
        return res.status(400).json(resObj(
            validationErrors,
            "Bad requested, invalide field!",
            false
        ))
    }
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
        return res.status(400).json(resObj(
            [],
            "No token Provided!",
            false
        ))
    }
    const {amount, category,notes, date} = req.body;

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if(err){
            console.log("Error during decoded data");
            return res.status(400).json(resObj([], "Invalid token provided!", false));
        }   
        if(decoded){
            const user_id = decoded.id;
            const expense = await new ExpenseModel().postExpense({ user_id, amount, category,notes, date});
            return res.status(201).json(resObj(
                [expense],
                "Create new expense successfully!",
                true
            ))
        }
    })

    }catch(err){
        console.log("Error controller post expense: " )
        return res.status(500).json(resObj(
            [],
            "Somthing went wrong!",
            false
        ))
    }
    
}


export const deleteExpense = async (req, res) =>{
    try{

        const token = req.headers.authorization?.split(' ')[1];

        const {id} = req.params;

        const queryGetExpenseById = "SELECT * FROM expense WHERE id=?";

        const getExpenseById =await query(queryGetExpenseById, [id]);



        if(getExpenseById.length == 0){
            return res.status(404).json(resObj(
                [],
                "Expense not found!",
                false
            ))
        }

        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
            if(err){
                console.log(err);
                return res.status(500).json(resObj(
                    [],
                    "Something went wrong!",
                    false
                ));
            }

            const result = await new ExpenseModel().deleteExpense(id, decoded.id);
            console.log("Controller " + result);
            if(result == 0) {
                return res.status(404).json(resObj(
                    [],
                    "Expense not found!",
                    false
                ))
            }

            return res.status(200).json(resObj(
                [],
                "Deleted expense successfully!",
                true
            ))
        })
    }catch(err){
        console.log("Error controller delete expense: " )
        return res.status(500).json(resObj(
            [],
            "Somthing went wrong!",
            false
        ))
    }
}

export const getExpenseAll = async (req , res) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
        if(err){
            console.log("Error get all expense controller: ", err);
            return res.status(500).json(resObj(
                [],
                "Something went wrong!",
                false
            ))
        }

        if(decoded){
            const result =await new ExpenseModel().getAllExpense(decoded.id); 
            let arrDate = [];
            result.forEach(r => {
                const formatedDate = format(new Date(r.date), "yyyy-MMMM-dd")
                arrDate.push(
                    {
                        id : r.expense_id,
                        expnse : {
                            amount : r.amount,
                            category : r.category,
                            notes : r.notes,
                            date : r.date,
                            formated_date : formatedDate
                        },
                       user : {
                        id : r.user_id,
                        username : r.username,
                        email : r.email
                       } 
                    }
                )
            });
            return res.status(200).json(resObj(
                arrDate,
                "Get all expenses successfully!",
                true
            ))
        }
    })
    }catch(err){
        console.log("Error at expense get all controller: " , err)
        return res.status(500).json(resObj(
            [],
            "Somthing went wrong!",
            false
        ))
    }
}



export const getExpenseById = async(req, res) => {
    try{
        const {id} = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
        if(err){
            console.log("Error get by id expense controller: ", err);
            return res.status(500).json(resObj(
                [],
                "Something went wrong!",
                false
            ))
        }

        if(decoded){
            const result =await new ExpenseModel().getExpenseById(decoded.id, id); 
            if(result.length == 0){
                return res.status(404).json(resObj(
                    [],
                    "Expense not found!",
                    true
                ))
            }
            let arrDate = [];
            result.forEach(r => {
                const formatedDate = format(new Date(r.date), "yyyy-MMMM-dd")
                arrDate.push(
                    {
                        id : r.expense_id,
                        expnse : {
                            amount : r.amount,
                            category : r.category,
                            notes : r.notes,
                            date : r.date,
                            formated_date : formatedDate
                        },
                       user : {
                        id : r.user_id,
                        username : r.username,
                        email : r.email
                       } 
                    }
                )
            });
            return res.status(200).json(resObj(
                arrDate,
                "Get expense successfully!",
                true
            ))
        }
    })
    }catch(err){
        console.log("Error at expense get by id controller: " , err)
        return res.status(500).json(resObj(
            [],
            "Somthing went wrong!",
            false
        ))
    }
}


export const putExpenseById = async (req , res) => {
    try{
        const validationErrors = vPutExpense(req.body);
        if(validationErrors){
            return res.status(400).json(resObj(
                validationErrors,
                "Bad requested, invalide field!",
                false
            ))
        }
        const {id} = req.params;
        const {amount, category, notes, date} = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, async(err, decoded) => {
        if(err){
            console.log("Error update by id expense controller: ", err);
            return res.status(500).json(resObj(
                [],
                "Something went wrong!",
                false
            ))
        }

        if(decoded){
            const result = await new ExpenseModel().putExpenseById(decoded.id, id, {amount, category, notes, date}); 
            if(result === 0) {
                return res.status(404).json(resObj(
                    [],
                    "Expense not found!",
                    false
                ))
            }
            const user = await query("SELECT username , email FROM users WHERE id = ?", [decoded.id]);
            console.log(result);
            console.log(user);

            const arrDate = [
                {
                    id : result.updatedExpense.id,
                    expense : {
                        amount : result.updatedExpense.amount,
                        category : result.updatedExpense.category,
                        notes : result.updatedExpense.notes,
                        date : result.updatedExpense.date,
                        formated_date : result.updatedExpense.formattedDate
                    },
                    user : {
                        id : result.updatedExpense.user_id,
                        username : user[0].username,
                        email : user[0].email
                    }
                }
            ]

            return res.status(200).json(resObj(
                arrDate,
                "Update expense successfully!",
                true
            ))
           
            
        }
    })

    }catch(err){
        console.log("Error at expense update by id controller: " , err)
        return res.status(500).json(resObj(
            [],
            "Somthing went wrong!",
            false
        ))
    }
}