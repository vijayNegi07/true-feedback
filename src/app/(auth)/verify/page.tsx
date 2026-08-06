"use client"
import React from 'react'
import {redirect, useRouter, useSearchParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from '@/components/ui/toast';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeValidation } from '@/schemas/inputValidation.schema';
import { authClient } from '@/lib/auth-client';


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

const page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") as string; 
    console.log(email);
    

    const verifySchema = z.object({
      email:z.email(),
      code:verifyCodeValidation
    })

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver:zodResolver(verifySchema),
        defaultValues:{
          email:email,
          code:"",
        }
    })

    const onSubmit = async(formData:z.infer<typeof verifySchema>) =>{
      try {
        const response = await authClient.emailOtp.verifyEmail({
          email: email, // required
          otp: formData.code, // required
        });

        console.log(response);
        if(!response.data){
            toast.add({
            type:"Error",
            description:"Email verification failed! Try again later"
          })
          router.push("/")
        }
        toast.add({
            type:"Success",
            description:"Email is Verified"
        })
        

        router.push("/")
      } catch (error) {
        console.log("There is some error while verifying user email", error);
        toast.add({
          type:"Error",
          description:"Email verification failed! Try again later"
        })
        router.push("/")
      }
    }


  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                
                <Field data-invalid={fieldState.invalid|| undefined}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Code
                    
                  </FieldLabel>
                  <InputGroup >
                    <InputGroupInput
                    
                      {...field}
                      id="otp"
                      autoComplete="otp"
                      placeholder="Enter OTP"
                      maxLength={6}
                      aria-invalid={fieldState.invalid|| undefined  }
                      aria-describedby="otp-status"
                    />
                  </InputGroup>   
                  {form.formState.errors.code ? (<FieldError id="code-status">{form.formState.errors.code.message}</FieldError>):(<></>)}                    
                </Field>
              )}
            />
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                
                <Field data-invalid={fieldState.invalid|| undefined}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Email
                    
                  </FieldLabel>
                  <InputGroup >
                    <InputGroupInput
                    
                      {...field}
                      id="email"
                      value={email}
                      autoComplete="email"
                      placeholder="example@gmail.com"
                      aria-invalid={fieldState.invalid|| undefined  }
                      aria-describedby="email-status"
                    />
                  </InputGroup>  
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-demo">
            Verify
          </Button>       
        </Field>
      </CardFooter>
    </Card>
  )
}

export default page;