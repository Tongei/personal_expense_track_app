import query from "../config/db.js";
import { format } from "date-fns"; 
import { resObj } from "../utils/functions.js";
import { ca } from "date-fns/locale";
class ExpenseModel {
    async postExpense (expense) {
        try{
            const {user_id, amount, category,notes, date} = expense;
            const formatedDate = format(new Date(date), "yyyy-MMMM-dd");
            const sql = "INSERT INTO expense(user_id, amount, category, notes, date) VALUES (?,?,?,?,?)";
            const result = await query(sql, [user_id, amount, category,notes, date]);
            return {id: result.lastID, user_id, amount, category,notes, date, date_formated : formatedDate}
        }catch(err){
            console.log("Error during models post expense: ", err); 
        }
    }

    async deleteExpense (id, user_id) {
        try{
            
            const sql = "DELETE FROM expense WHERE id=? AND user_id=? ";
            const result = await query(sql, [id, user_id]);
            return result.changes;

        }catch(err){
            console.log("Error models expense delete: " , err);
        }
    }

    async getAllExpense(user_id){
        try{
            const sql = `
                    SELECT 
                        expense.id as expense_id,
                        expense.amount as amount,
                        expense.category as category,
                        expense.notes as notes,
                        expense.date as date,
                        expense.user_id as user_id,
                        users.username as username,
                        users.email as email
                    FROM expense INNER JOIN users 
                    ON expense.user_id = users.id
                    WHERE user_id = ?
        `;

            const result = await query(sql, [user_id]);
            return result;
        }catch(err){
            console.log("Error at models get all expense: ", err)
        }
    }

    async getExpenseById (user_id, id) {
        try{
            const sql = `
                SELECT 
                        expense.id as expense_id,
                        expense.amount as amount,
                        expense.category as category,
                        expense.notes as notes,
                        expense.date as date,
                        expense.user_id as user_id,
                        users.username as username,
                        users.email as email
                    FROM expense INNER JOIN users 
                    ON expense.user_id = users.id
                    WHERE user_id = ? AND expense.id = ?
            `;

            const result = await query(sql, [user_id, id]);
            return result;
        }catch(err){
            console.log("Error during models get expense by id: ",err)
        }
    }

    async putExpenseById (user_id, id, expense){
        try{
            const {amount, category, notes, date} = expense;
            const sql = `
                UPDATE expense
                SET amount = ?, category = ?, notes = ?, date = ?
                WHERE id = ? AND user_id = ?
            `;

            const result = await query(sql, [amount, category, notes, date, id, user_id]);
            const formattedDate = format(new Date(date), "yyyy-MMMM-dd")
            if (result.changes === 0) {
                return result.changes;
            }
            return {updatedExpense: { id, user_id, amount, category, notes, date, formattedDate }}
        }catch(err){
            console.log("Error at update expense model: ", err);
        }
    }
}


export default ExpenseModel;