import jwt from "jsonwebtoken"

const SECRET = "whatsupdaddy"

export const generateToken = (userId : string)=> {
    return jwt.sign({id: userId}, SECRET, {expiresIn : "1h"});
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, SECRET)
}