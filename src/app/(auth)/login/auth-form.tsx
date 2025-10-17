
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signupAction } from "@/app/actions/user";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useFirebase, initiateEmailSignIn, useUser } from "@/firebase";
import { Loader2 } from "lucide-react";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const initialState = {
  message: null,
  user: null,
  errors: {},
};

function AuthSubmitButton({ isLogin }: { isLogin: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : (isLogin ? "Login to Your Studio" : "Create Your Free Account")}
    </Button>
  );
}

export default function AuthForm() {
  const [signupState, signupFormAction] = useActionState(signupAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (signupState.message) {
      toast({
        title: signupState.errors ? "Error" : "Success",
        description: signupState.message,
        variant: signupState.errors ? "destructive" : "default",
      });
      if (signupState.user && auth?.currentUser) {
        // After successful sign-up, force a token refresh to get custom claims
        auth.currentUser.getIdToken(true).then(() => {
           // Firebase onAuthStateChanged will trigger with the new user object (and claims)
           // and the previous useEffect will handle the redirect.
        });
      }
    }
  }, [signupState, toast, auth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoggingIn(true);
    // initiateEmailSignIn is non-blocking. onAuthStateChanged listener handles the rest.
    initiateEmailSignIn(auth, email, password);
    // Let's add a small timeout to handle cases where login fails silently
    // before onAuthStateChanged gets a chance to react.
    setTimeout(() => {
        if(!auth.currentUser) {
            setIsLoggingIn(false);
            toast({
                title: "Login Failed",
                description: "Please check your email and password.",
                variant: "destructive"
            })
        }
    }, 2000);
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // The user will be redirected to Google's sign-in page.
      // After successful sign-in, they will be redirected back to the app.
      // The onAuthStateChanged listener will then handle the user session and redirect to the dashboard.
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google Login Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      setIsGoogleLoading(false);
    }
  };


  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader className="text-center">
        <div className="mx-auto h-40 w-40 sm:h-56 sm:w-56 relative">
            <Icons.logo />
        </div>
        <CardTitle className="font-headline text-xl sm:text-2xl font-bold">
          Welcome to Your Artist Studio
        </CardTitle>
        <CardDescription className="text-sm">
          Sign in to manage your music, or sign up to claim your free tokens and start your journey.
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
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoggingIn || isUserLoading}>
                {isLoggingIn || isUserLoading ? <Loader2 className="animate-spin" /> : "Login to Your Studio"}
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
        <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={isGoogleLoading || isUserLoading}>
            {isGoogleLoading ? <Loader2 className="animate-spin" /> : 'Login with Google'}
        </Button>
      </CardContent>
    </Card>
  );
}
