"use client";
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from "@/components/ui/textarea"

import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import axios, { AxiosError } from 'axios';
import { KALESH_URL } from '@/lib/apiEndPoints';
import { CustomUser } from '@/app/api/auth/[...nextauth]/options';
import { toast } from 'sonner';
import { clearCache } from '@/actions/commonActions';

function AddKalesh({user}:{user:CustomUser}) {
    const [open, setOpen] = useState(false)
    const [kaleshdata, setKaleshData] = useState<KaleshFormType>({})
    const [date, setDate] = useState<Date | null>()
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<KaleshFormErrorType>({})

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if(file) {
        setImage(file)
      }
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
      event.preventDefault()

      try {
        setLoading(true)
        const formData = new FormData()
        formData.append("title", kaleshdata?.title ?? "")
        formData.append("description", kaleshdata?.description ?? "")
        formData.append("expires_at", date?.toISOString() ?? "")
        if(image) {
          formData.append("image", image)
        }

        const {data} = await axios.post(KALESH_URL, formData, {
          headers: {
            Authorization: user.token
          }
        })
        setLoading(false)
        if(data?.message) {
          clearCache("dashboard")
          setKaleshData({})
          setDate(null)
          setImage(null)
          setErrors({})
          toast.success("Kalesh added successfully!")
          setOpen(false)
        }
        
      } catch (error) {
        setLoading(false)
        if(error instanceof AxiosError) {
          if(error.response?.status == 422) {
            setErrors(error.response?.data?.errors)
          }
        } else {
          toast.error("Something went wrong. please try again!")
        }
      }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen} >
    <DialogTrigger asChild>
        <Button>Add Kalesh</Button>
    </DialogTrigger>
    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
        <DialogTitle>Create Kalesh</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
            <div className='mt-4'>
                <Label htmlFor='title'>Title</Label>
                <Input 
                  id='title' 
                  placeholder='Enter your title here...' 
                  value={kaleshdata?.title ?? ""} 
                  onChange={(e) => setKaleshData({...kaleshdata, title: e.target.value})}
                />
                <span className='text-red-500'>{errors?.title}</span>
            </div>
            <div className='mt-4'>
                <Label htmlFor='description'>Description</Label>
                <Textarea 
                  id='description' 
                  placeholder='Enter your description here...' 
                  value={kaleshdata?.description ?? ""} 
                  onChange={(e) => setKaleshData({...kaleshdata, description: e.target.value})}
                />
                <span className='text-red-500'>{errors?.description}</span>
            </div>
            <div className='mt-4'>
                <Label htmlFor='image'>Image</Label>
                <Input 
                  id='image' 
                  type='file' 
                  placeholder='Select your image here...' 
                  onChange={handleImageChange}
                />
                <span className='text-red-500'>{errors?.image}</span>
            </div>

            <div className="mt-4">
              <Label htmlFor="expireAt" className="block">Expires At</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full mt-2 justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toDateString() : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date ?? new Date()}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <span className="text-red-500">{errors?.expires_at}</span>
            </div>
            <div className='mt-6'>
              <Button className='w-full' disabled={loading}>{loading ? "Processing" : "Submit"}</Button>
            </div>
        </form>
    </DialogContent>
    </Dialog>

  )
}

export default AddKalesh