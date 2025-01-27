import query from '../config/db.js'; // Add .js extension

class AuthModel {
    register = async (user) => {
        try {
            const { username, email, password } = user;
            const sql = "INSERT INTO users(username, email, hashed_pass) VALUES (?,?,?)";
            const result = await query(sql, [username, email, password]);
            return { id: result.lastID, username, email };
        } catch (err) {
            console.log("Error message: " + err);
            console.log("Error during register!");
        }
    }

    login = async (email) => {
        try{
            const sql = "SELECT * FROM users WHERE email =? "
            const result = await query(sql, [email])
            return {id : result[0].id,password : result[0].hashed_pass, username : result[0].username, email : result[0].email};
        }catch(err){
            console.log("Error message: " + err);
            console.log("Error during login models!");
        }
    }
}



export default AuthModel; // Use export default