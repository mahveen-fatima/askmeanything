"use client"
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { messageSchema } from '@/schema/messageSchema'
import * as z from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Loader2, Send } from 'lucide-react'
import { Separator } from '@/components/ui/separator'


const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGettingMessages, setIsGettingMessages] = useState(false)
  const [suggestMessages, setSuggestMessages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams<{username: string}>()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const { handleSubmit, setValue } =form

  const onSubmit = async(data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        ...data
      })
      console.log("res =>", response)
      toast.success(response.data.message || "Message sent successfully")
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error adding message", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Error adding message")
      setIsSubmitting(false)
    }
  }
  interface SuggestResponse { text: string }
  // suggest messages
  const handleSuggestMessages = async () => {
    setIsGettingMessages(true)
    setIsLoading(true)
    try {
      const response = await axios.post<SuggestResponse>("/api/suggest-messages", {})

      const rawString = response.data.text
      if(typeof rawString !== "string") {
        console.error("Expected a string but got : ", rawString)
      }

      const result = rawString
        .split("||")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

        setSuggestMessages(result)
        console.log("result ", result)
        setIsGettingMessages(false)
    } catch (error) {
      console.error("Error while suggesting messages", error)
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Error while suggesting messages")
    } finally {
        setIsLoading(false)
    }
  }
  
  useEffect(() => {
    (async () => {
      await handleSuggestMessages();
    })();
  }, []);



  return (
    <div className='flex flex-col items-center min-h-screen p-6'>
      <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>

      <div className="w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-2 text-center">Send anonymous message to {params.username}</h2>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='relative'>
                        <textarea 
                          placeholder="Write your message here..." 
                          {...field} 
                          className='w-full h-50 resize-none overflow-y-auto rounded border border-gray-300 p-4  focus:outline-none focus:ring' 
                        />

                        <Button className='w-auto bg-stone-950 hover:bg-neutral-900 absolute bottom-4 right-2 px-4 py-2 z-10' type="submit" disabled={isSubmitting}>
                          { 
                            isSubmitting ? (
                              <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                              </>
                            ) : (<Send className='h-4 w-4' />)
                          }
                        </Button>
                      </div>
                    </FormControl>
                  <FormMessage />
                  </FormItem>
                )}
                />
            </form>
          </Form>
      </div>

      <Separator className='mx-auto my-4 w-full max-w-2xl' />

      <div className='w-full max-w-xl text-center'>
        <Button onClick={handleSuggestMessages} className='w-auto bg-stone-950 hover:bg-neutral-900 cursor-pointer'
        disabled={isLoading}
        >
          {
            isGettingMessages ? (
              <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Suggesting...
              </>
            ) 
            : ("Suggest Messages")
          }
        </Button>
        <p className="text-sm text-gray-500 mb-2">
        Click any suggestion below to paste it into the message box.
      </p>
        <div className='border h-60 max-w-xl mt-5'>
          {isLoading ?
          (
            <div className='flex items-center justify-center h-full mt-4'>
              <Loader2 className='animate-spin h-6 w-6 mr-2' />
              <span>Loading...</span>
            </div>
          ) : (
            suggestMessages.map((message, index) => (

            <p className='px-4 py-4 border border-gray-800 rounded-lg mb-2 h-auto cursor-pointer ' key={index} onClick={() => setValue("content", message)}>{message}</p>
          ))
          )}
        </div>
      </div>

    </div>
  )
}

export default Page