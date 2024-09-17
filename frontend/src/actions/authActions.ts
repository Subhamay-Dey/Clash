"use server"
import { REGISTER_URL } from "@/lib/apiEndPoints"
import axios from "axios"

export async function registerAction(prevState:any, formdata: FormData) {
    try {
        await axios.post(REGISTER_URL, {
            name: formdata.get("name"),
            email: formdata.get("email"),
            password: formdata.get("password"),
            confirm_password: formdata.get("confirm_password"),
        })
    } catch (error) {
        
    }
}