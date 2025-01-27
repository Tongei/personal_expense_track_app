import query from '../config/db.js' 
import {resObj} from '../utils/functions.js'

export const authenticateToken = async(req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
    	const token = authHeader && authHeader.split(' ')[1];
        if(!token) {
            return res.status(400).json(resObj([], 'No token provided!', false))
        }
        const queryGetToken = "SELECT * FROM blacklisted_tokens WHERE token = ? "
        const result = await query(queryGetToken, [token]);
        if(result.length > 0){
            return res.status(403).json(resObj([], "You need to login!", false));
        }
        next();
    }catch(err){
        console.log("Error middleware: " + err);
        return res.status(500).json(resObj([], "Something went wrong!", false))
    }
}

