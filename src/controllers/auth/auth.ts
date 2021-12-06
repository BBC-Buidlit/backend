import { Request, Response, Router } from "express";

import btoa from 'btoa';



const router = Router();


export const AuthController = router.get("/authorize", async (req: Request, res: Response) => {
    const {CLIENT_ID, DISCORD_REDIRECT} = process.env;
    return res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${DISCORD_REDIRECT}`)
})
.post("/callback", async (req: Request<any,any,any, {code: string},any>, res: Response) => {
    if(!req.query.code) return res.status(400).json({message: "Code is required"});
    try {
        const {CLIENT_ID, CLIENT_SECRET, DISCORD_REDIRECT, FRONTEND_URL} = process.env;
        const {code} = req.query;
        const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${DISCORD_REDIRECT}`,
        {
        method: 'POST',
        headers: {
            Authorization: `Basic ${creds}`,
        },
        });
        const json = await response.json();
        res.redirect(`${FRONTEND_URL}/auth/?token=${json.access_token}`);
    }catch(err) {
        return res.status(400).json({error: err})
    }
})


