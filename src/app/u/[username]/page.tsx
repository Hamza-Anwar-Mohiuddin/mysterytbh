"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { useCompletion } from "ai/react"
import { Message } from "@/model/user.model";

const specialChar = '||';

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";
const MessagesArray = initialMessageString.split(specialChar)



const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const {username} = params

  


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });
  const messageContent = form.watch('content');

  const onSubmit= async(data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    console.log({...data, username});
    
    try {
        const response = await axios.post(`/api/send-messages`, {...data, username})
        toast({
            title: response.data.message,
            variant: 'default',
          });
          form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      

      toast({
        title: "Unable to send message",
        description: errorMessage ?? 'Failed to sent message',
        variant: 'destructive',
      });
    }finally{
      setIsLoading(false)
    }
  }

  const handleMessageClick = (message:string) =>{
    form.reset({ ...form.getValues(), content: message });
  }
  return (
    <>
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" mt-12 space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send anonymous message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here. "
                      className="resize-none "
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {/* You can <span>@mention</span> other users and organizations. */}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
          </form>
        </Form>
        <div className="space-y-4 my-8">
        <div className="space-y-2">
          
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
          {MessagesArray.map((message, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="mb-2"
                  onClick={() => handleMessageClick(message)}
                >
                  {message}
                </Button>
              ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/signup'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
      </div>
    </>
  );
};

export default page;
