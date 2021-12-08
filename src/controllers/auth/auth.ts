import { Request, Response, Router } from "express";

import axios from "axios";



const router = Router();


export const AuthController = router.get("/authorize", async (req: Request, res: Response) => {
    return res.redirect(`https://discord.com/api/oauth2/authorize?client_id=770661156335386626&redirect_uri=http%3A%2F%2Flocalhost%3A9000%2Fauth%2Fcallback&response_type=code&scope=identify%20guilds`)
})
.get("/callback", async (req: Request<any,any,any, {code: string},any>, res: Response) => {
    if(!req.query.code) return res.status(400).json({message: "Code is required"});
    try {
        const {CLIENT_ID, REDIRECT_URI , DISCORD_AUTH} = process.env;
        if(!CLIENT_ID || !REDIRECT_URI || !DISCORD_AUTH) return res.status(500).json("Environment variables not found");
        const code = req.query.code;
        
        const params = new URLSearchParams();
        params.append('client_id', CLIENT_ID);
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('scope', "identify");

        const response = await axios({
            url:'https://discordapp.com/api/oauth2/token',
            method:"POST",
            data: params,
            headers: {
                Authorization: DISCORD_AUTH, 
                "Content-Type":"application/x-www-form-urlencoded",
                'Accept': 'application/json' 
            }
        })
        return res.json({token: response.data['access_token']}) //@lakshya, change to redirect 


    }catch(err) {
        return res.status(400).json({error: err})
    }
})


