"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import AnimatedGradientText from "@/components/animated-gradient-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupAction, loginAction } from "@/app/actions/user";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirebase, initiateEmailSignIn } from "@/firebase";
import { Loader2 } from "lucide-react";

const initialState = {
  message: null,
  user: null,
  errors: {},
};

function AuthSubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : (isLogin ? "Login" : "Create Account")}
    </Button>
  );
}

export default function AuthForm() {
  const [signupState, signupFormAction] = useFormState(signupAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);


  useEffect(() => {
    if (signupState.message) {
      toast({
        title: signupState.errors ? "Error" : "Success",
        description: signupState.message,
        variant: signupState.errors ? "destructive" : "default",
      });
      if (signupState.user) {
        router.push('/dashboard');
      }
    }
  }, [signupState, toast, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoggingIn(true);
    initiateEmailSignIn(auth, email, password);
    // The onAuthStateChanged listener in FirebaseProvider will handle the redirect
    // We add a small delay to give firebase time to process
    setTimeout(() => {
        router.push('/dashboard');
    }, 1000);
  };


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="text-center">
        <Icons.logo className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="font-headline text-2xl font-bold">
          <AnimatedGradientText>Welcome to VNDR</AnimatedGradientText>
        </CardTitle>
        <CardDescription>
          Sign in or create an account to start your journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="login-password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="login-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="animate-spin" /> : "Login"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form action={signupFormAction} className="grid gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                 {signupState.errors?.email && <p className="text-sm text-destructive">{signupState.errors.email[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" name="password" type="password" required />
                {signupState.errors?.password && <p className="text-sm text-destructive">{signupState.errors.password[0]}</p>}
              </div>
               {signupState.errors?._form && <p className="text-sm text-destructive">{signupState.errors._form[0]}</p>}
              <AuthSubmitButton isLogin={false} />
            </form>
          </TabsContent>
        </Tabs>
         <Button variant="outline" className="w-full mt-4">
            Login with Google
          </Button>
      </CardContent>
    </Card>
  );
}

    