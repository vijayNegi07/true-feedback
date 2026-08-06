'use client'
import { useEffect, useState } from 'react';
import { signUp } from '../../actions/auth';
import {useForm, Controller, FieldErrors} from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useDebounceCallback } from 'usehooks-ts'
import axios,{AxiosError} from 'axios'
import { toast } from '@/components/ui/toast';
import { redirect, useRouter } from 'next/navigation';
import { sigInValidation, signUpValidation } from '@/schemas/inputValidation.schema';
import { ApiResponse } from '@/types/ApiResponse';



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
import { authClient } from '@/lib/auth-client';


function SignIn() {
  const[formSubmitting, setFormSubmitting] = useState(false);
  const[apiError, setApiError] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof sigInValidation>>({
    resolver:zodResolver(sigInValidation),
    defaultValues:{
      email:"",
      password:""
    }
  })

  const onSubmit = async(formData : z.infer <typeof sigInValidation>)=>{
    setFormSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
          email: formData.email, // required
          password: formData.password, // required
          rememberMe: true,
      });

      if(error){
        console.log("APi error -> ", error);
        setApiError(error?.message);
        toast.add({type:'error', description:"Username or passoword wrong"})
        return;
      }
      toast.add({type:'success', description:"Successfully signIn"})
      
    } catch (error) {
      console.log("Some errr while user logging in ", error);
      toast.add({
        type:"error"
      })
      
    }
  }

  console.log(form.formState.errors);
  

  return (
     <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Email
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      autoComplete="email"
                      placeholder="example@gmail.com"
                      // aria-invalid={field.value || undefined}
                      aria-describedby="email-status"
                      {...field}
                    />
              </InputGroup>
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type='password'
                      autoComplete="pass"
                      placeholder="password"
                      // aria-invalid={field.value || undefined}
                      aria-describedby="pass-status"
                      {...field}
                    />
              </InputGroup>
                </Field>
              )}
            />
            
          </FieldGroup>
          {form.formState.errors? 
             (<FormErrors fieldErrors={form.formState} apiError={apiError}></FormErrors>):(<></>)}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

type FormErrorProps = {
  errors: FieldErrors<z.infer<typeof sigInValidation>>;
};

function FormErrors({fieldErrors, apiError}:{ fieldErrors:FormErrorProps , apiError:string | undefined}) {
  if(apiError){
    return(
      <FieldError id='api-error'>{apiError}</FieldError>
    )
  }
  if(fieldErrors.errors.password){
    return(
      <FieldError id='api-error'>{fieldErrors.errors.password.message}</FieldError>
    )
  }
  if(fieldErrors.errors.email){
    return(
      <FieldError id='api-error'>{fieldErrors.errors.email?.message}</FieldError>
    )
  }
  
}

export default SignIn;