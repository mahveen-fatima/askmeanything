"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schema/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from "zod"

const Page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params = useParams<{username: string}>()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true)
        try {
            await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.verifyCode
            })
            toast.success('Account verified successfully')
            router.replace("/sign-in")
            setIsSubmitting(false)
            
        } catch (error) {
            console.error("Error while verifying user", error)
            error as AxiosError<ApiResponse>
            toast.error("Account verification failed")
            setIsSubmitting(false)
        }
    }


  return (
    <div className='flex justify-center items-center min-h-screen bg-stone-100'>
        <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
            <div className='text-center'>
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-4xl mb-6'>
                    Verify <br/>Your Account
                </h1>
                <p className='mb-4'>
                    Enter the verification code sent to your email.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                    name="verifyCode"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Verification Code</FormLabel>
                        <FormControl>
                            <Input placeholder="code" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button className='w-full bg-stone-950 hover:bg-neutral-900"' type="submit" disabled={isSubmitting}>
                        { 
                            isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                                </>
                            ) : ("Submit")
                        }
                    </Button>
                </form>
            </Form>

        </div>
    </div>
  )
}

export default Page