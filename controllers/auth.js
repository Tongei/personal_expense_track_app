import AuthModel from '../models/auth.js'; // Add .js extension
import { resObj } from '../utils/functions.js'; // Add .js extension
import { vRegister as validateRegister, vLogin} from '../validations/auth.js'; // Add .js extension and rename to avoid conflict
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import query from '../config/db.js'; // Add .js extension

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: 3 * 24 * 60 * 60 });
};

// Export the postRegister function as a named export
export const postRegister = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    // Validate the request body
    const validationErrors = validateRegister(req.body);
    if (validationErrors) {
      return res.status(200).json(resObj(validationErrors, 'Bad request! Invalid field.', false));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(200).json(resObj([], 'Password does not match!', false));
    }

    // Check if email or username already exists
    const queryEmail = 'SELECT * FROM users WHERE email = ?';
    const queryUsername = 'SELECT * FROM users WHERE username = ?';

    const getEmail = await query(queryEmail, [email]);
    if (getEmail.length > 0) {
      return res.status(200).json(resObj([], 'Email already used!', false));
    }

    const getUsername = await query(queryUsername, [username]);
    if (getUsername.length > 0) {
      return res.status(200).json(resObj([], 'Username already used!', false));
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Register the new user
    const newUser = await new AuthModel().register({ username, email, password: hashedPassword });
    res.status(201).json(resObj([newUser], 'Successfully registered!', true));
  } catch (err) {
    console.error('Error during Register:', err); // Log the error
    return res.status(500).json(resObj([], 'Something went wrong!', false));
  }
};


export const postLogin = async(req, res) => {
  try{
    const validationErrors = vLogin(req.body);
    if (validationErrors) {
      return res.status(200).json(resObj(validationErrors, 'Bad request! Invalid field.', false));
    }
    const {email, password} = req.body; 
    const result = await new AuthModel().login(email);

    if(!result){
      return res.status(200).json(resObj([], "Incorrect email or password!", false))
    }

    const decryptPassword = await bcrypt.compare(password, result.password);
    if(!decryptPassword){
      return res.status(200).json(resObj([], "Incorrect email or password!", false))
    }else{
      const token = await generateToken(result.id);
      return res.status(200).json(resObj([{user : {username : result.username, email: result.email },Token : token}], "Login Successfully!", true))
    }
  }catch(err){
    console.error('Error during login:', err); // Log the error
    return res.status(500).json(resObj([], 'Something went wrong!', false));
  }
}

export const deleteLogout = async(req, res) => {
  try{
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(400).json(resObj([], 'No token provided!', false));
      }
      jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
        if (err) {
          console.error('Error verifying token:', err);
          return res.status(401).json(resObj([], 'Invalid token!', false));
        }
        // Not yet done
      });

      let queryToken = "INSERT INTO blacklisted_tokens(token) VALUES (?)";

      const result = await query(queryToken, [token]);
      if(!result){
        return res.status(500).json(resObj([], 'Something went wrong!', false));
      }
      return res.status(200).json(resObj([], 'Logout successful!', true));
  }catch(err){
    console.error('Error during logout:', err); // Log the error
    return res.status(500).json(resObj([], 'Something went wrong!', false));
  }
}


export const getMe = async(req, res)=>{
  try{
    const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(!token) {
      return res.status(400).json(resObj([], 'No token provided!', false))
  }
  jwt.verify(token, process.env.SECRET_KEY, async(err, decodedToken) => {
      if(err){
          return res.status(400).json(resObj([], "Invalid token provided!", false));
      }
      if(decodedToken){
          const sql = "SELECT * FROM users WHERE id = ?";
          const result = await query(sql, [decodedToken.id]);
          console.log(result[0].id)
          return res.status(200).json(resObj([{
              user: {id : result[0].id, username : result[0].username, email : result[0].email},
            }],
            "Get user successfully!",
            true
          ))
      }
  });
  } catch(err){
    console.error('Error during get user:', err); // Log the error
    return res.status(500).json(resObj([], 'Something went wrong!', false));
  }
}
