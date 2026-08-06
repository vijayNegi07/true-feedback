'use client'
import { useEffect, useState } from 'react';
import { signUp } from '../../actions/auth';
import {useForm, Controller} from 'react-hook-form'
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
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon, Loader2Icon, XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import mongoose from 'mongoose';
import { auth } from '@/lib/auth';

// import { useUsernameAvailability } from "@/hooks/use-username-availability"


function SignUpPage() {
  const [username, setUsername] = useState("");
  const [usernameIsValid, setUsernameValid] = useState(true);
  const [checkUsername, setCheckUsername] = useState("");
  const [isformSubmit, setIsFormSubmit] = useState(false);
  const [usernameMessage, setUsernameMessage] = useState(""); 
  
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),  
    defaultValues: {
      username:'',
      email:'',
      password:'',
    },
  })

  useEffect(()=>{
    //make api request to chceck-unique-username
    async function checkUsernameUnique() {
      if(username.length < 3){
          setCheckUsername("")
          setUsernameValid(false)
          return;
        }
      
      if(username){
        
        setUsernameValid(true)
        setCheckUsername("checking")
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/checkUniqueUsername/?username=${username}`);
          console.log(response);
          
          setUsernameMessage(response.data.message)
          if(response.data.message !== "Username is unique"){
            setCheckUsername("taken")
            return;
          }
          console.log("available");
          
          setCheckUsername("available")
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error while checing unique username")
          setCheckUsername("error")
        }
      }
    }

    checkUsernameUnique();

  },[username])


  
    const onSubmit = async(formData: z.infer<typeof signUpValidation>) =>{
      setIsFormSubmit(true);

      try {
        const {email, username, password} = formData;
        const creatUserResponse = await axios.post('/api/create-user',{email, username, password});

        if(!creatUserResponse || creatUserResponse.status !== 200){
          toast.add({
            type:"error",
            description:"User Creation Failed!"
          })
          return;
        }

        toast.add({
          type:"success",
          description:"User Creation Success! Verification Code sent to email"
        })

        const { data, error } = await authClient.emailOtp.sendVerificationOtp({
            email: formData.email, // required
            type: "email-verification", // required
        });

        console.log("OTP sent data-> ", data);
        

        if(!data?.success){
          toast.add({type:"Success",description:"Email cant be sent! Try again later"})
          return;
        }

        router.push(`/verify?email=${encodeURIComponent(email)}`);


      } catch (error) {
        console.log("User Creation failed -> ", error);
        toast.add({
          type:"error",
          description:"User Creation Failed!"
        })
      }

    }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Bug Report</CardTitle>
        <CardDescription>
          Help us improve by reporting bugs you encounter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                
                <Field data-invalid={fieldState.invalid|| undefined}>
                  <FieldLabel htmlFor="form-rhf-demo-title">
                    Username
                    
                  </FieldLabel>
                  <InputGroup >
                    <InputGroupInput
                    
                      {...field}
                      className={cn(
    fieldState.invalid &&
      "border-red-500 focus-within:border-red-500"
  )}
                      id="username"
                      autoComplete="username"
                      placeholder="janedoe"
                      aria-invalid={fieldState.invalid|| undefined  }
                      aria-describedby="username-status"
                      onChange={(e)=>{field.onChange(e); debounced(e.target.value); setCheckUsername("checking"); form.trigger("username");}}
                    />
                    {usernameIsValid && (
                      <InputGroupAddon align="inline-end">
                        <UsernameStatusIcon status={checkUsername} />
                      </InputGroupAddon>
                    )}

                    
                  </InputGroup>
                  <UsernameStatusMessage
                  error={form.formState.errors.username?.message}
                  username={username}
                  usernameIsValid={usernameIsValid}
                  status={checkUsername}
                />
              
                </Field>
              )}
            />
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
                      id="username"
                      autoComplete="username"
                      placeholder="janedoe"
                      // aria-invalid={field.value || undefined}
                      aria-describedby="username-status"
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
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="password"
                    type='password'
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
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
          <button
          type="button"
          onClick={async () => {
            const valid = await form.trigger("username");
            console.log("Valid:", valid);
            console.log(form.formState.errors);
          }}
        >
          Test Validation
        </button>
        </Field>
      </CardFooter>
    </Card>
  )
}


function UsernameStatusIcon({
  status,
}:{status:string}) {
  if (status === "checking") return <Loader2Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4 animate-spin")}/>
  if (status === "available") return <CheckIcon className="text-success text-green-500" />
  if (status === "taken" || status === "error")
    return <XIcon className="text-destructive" />
  return null
}


function UsernameStatusMessage({
  error,
  username,
  usernameIsValid,
  status,
}: {
  error?: string
  username: string
  usernameIsValid: boolean
  status: string
}) {
  if (error) {
    return <FieldError id="username-status">{error}</FieldError>
  }

  if (!usernameIsValid) {
    return (
      <FieldDescription id="username-status">
        3–20 characters. Letters, numbers and underscores only.
      </FieldDescription>
    )
  }

  if (status === "checking") {
    return (
      <FieldDescription id="username-status" >
        Checking availability...
      </FieldDescription>
    )
  }

  if (status === "available") {
    return (
      <FieldDescription id="username-status" className="text-success text-green-500 " >
        {username} is available.
      </FieldDescription>
    )
  }

  if (status === "taken") {
    return (
      <FieldError id="username-status">
        {username} is already taken.
      </FieldError>
    )
  }

  if (status === "error") {
    return (
      <FieldError id="username-status">
        Could not check that username. Try again.
      </FieldError>
    )
  }

  return null
}

export default SignUpPage;

