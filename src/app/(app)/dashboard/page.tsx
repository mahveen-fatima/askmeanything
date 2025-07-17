"use client"

import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schema/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, RefreshCcw } from "lucide-react"
import MessageCard from "@/components/MessageCard"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages")
      setValue("acceptMessages", response.data.isAcceptingMessage!)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
    } finally {
      setIsSwitchLoading(false)
      setIsInitialLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages")
      setMessages(response.data.messages || [])
      if (refresh) {
        toast.success("Messages refreshed", {
          description: "Showing latest messages"
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "Failed to fetch messages")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session?.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchMessages, fetchAcceptMessage])

  if (!session?.user) {
    return <div className="min-h-screen flex items-center justify-center">Please login</div>
  }

  const { username } = session.user as User
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("URL copied to clipboard")
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-4xl font-bold mb-6 text-center">User Dashboard</h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <Button className="whitespace-nowrap" onClick={copyToClipboard}>
              Copy
            </Button>
          </div>
        </div>

        {!isInitialLoading && (
          <div className="mb-6 flex items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={async () => {
                setIsSwitchLoading(true)
                try {
                  const res = await axios.post<ApiResponse>("/api/accept-messages", { acceptMessages: !acceptMessages })
                  setValue("acceptMessages", !acceptMessages)
                  toast.success(res.data.message)
                } catch (error) {
                  const axiosError = error as AxiosError<ApiResponse>
                  toast.error(axiosError.response?.data.message || "Failed to update settings")
                } finally {
                  setIsSwitchLoading(false)
                }
              }}
              disabled={isSwitchLoading}
            />
            <span className="ml-3">Accept Messages: {acceptMessages ? "On" : "Off"}</span>
          </div>
        )}

        <Separator className="my-6" />

        <div className="mb-6">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Page;
